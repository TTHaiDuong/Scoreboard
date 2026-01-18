import { timerDb, MatchTimer } from "./timer.js"
import { settings } from "./setting.js"
import { getRound } from "./match.js"
import {
    Side,
    Score,
    scoreTypes,
    ScoreType,
    PressBuffer,
    PendingVote,
    UpdateScoreData,
    Round
} from "../../scripts/types.js"


const pressBufferDb: Map<string, PressBuffer> = new Map()

function mergeCombos(presses: ScoreType[]): ScoreType[] {
    const result: ScoreType[] = []
    let i = 0

    while (i < presses.length) {
        const current = presses[i]
        const next = presses[i + 1]

        // 2 + 2 => 4
        if (current === 2 && next === 2) {
            result.push(4)
            i += 2
        }
        // 2 + 3 hoặc 3 + 2 => 5
        else if (
            (current === 2 && next === 3) ||
            (current === 3 && next === 2)
        ) {
            result.push(5)
            i += 2
        }
        // không combo
        else {
            result.push(current)
            i += 1
        }
    }

    return result
}

function finalizePress(
    judgeId: string,
    presses: ScoreType[]
): ScoreType[] {
    pressBufferDb.delete(judgeId)
    return mergeCombos(presses)
}


const pendingVoteDb: Map<string, PendingVote> = new Map()

function createVoteKey(
    courtId: string,
    side: Side,
    scoreType: ScoreType
) {
    return `${courtId}|${side}|${scoreType}`
}

function startVote(
    io: any,
    courtId: string,
    round: Round,
    judgeId: string,
    timer: MatchTimer | undefined,
    data: UpdateScoreData
) {
    const voteKey = createVoteKey(courtId, data.side, data.scoreType)
    const setting = settings.get(courtId)
    let pending = pendingVoteDb.get(voteKey)

    if (!pending) {
        if (timer && !timer.isRunning) return

        pending = {
            courtId: courtId,
            side: data.side,
            scoreType: data.scoreType,
            voters: new Set<string>([judgeId]),
            timeout: setTimeout(() =>
                pendingVoteDb.delete(voteKey),
                setting?.pendingVoteMs || 1000)
        }

        pendingVoteDb.set(voteKey, pending)
        return
    }

    if (pending.voters.has(judgeId)) return
    pending.voters.add(judgeId)

    if (pending.voters.size >= (setting?.voteThreshold || 2)) {
        if (!pendingVoteDb.has(voteKey)) return

        clearTimeout(pending.timeout)
        pendingVoteDb.delete(voteKey)
        updatedScore(io, courtId, round, {
            side: pending.side,
            scoreType: pending.scoreType,
            value: "increase"
        })
    }

    io.to(`court-${courtId}`).emit("score:vote", {
        scoreType: data.scoreType,
        judgeId: judgeId
    })
}

export function updatedScore(
    io: any,
    courtId: string,
    round: Round,
    data: UpdateScoreData
) {
    const side = data.side
    const type = data.scoreType

    const current = round[side][type]

    let next: number

    if (typeof data.value === "number") {
        next = data.value
    } else if (data.value === "increase") {
        next = current + 1
    } else {
        next = current - 1
    }

    round[side][type] = Math.max(0, next)

    sendScoreToClient(io, courtId, round)
}

export function sendScoreToClient(io: any, courtId: string, round: Round) {
    io.to(`court-${courtId}`).emit("score:updated", {
        courtId: courtId,
        blue: round.blue,
        red: round.red,
        win: round.win
    })
}

export function handleJudgeScore(io: any, judgeId: string,
    courtId: string,
    round: Round,
    data: UpdateScoreData,
    timer?: MatchTimer
) {
    const setting = settings.get(courtId)

    // Judge chỉ bấm được điểm khi đồng hồ chạy
    // Khi thời gian hiệp đấu kết thúc, không cho tạo thêm pending vote nhưng vẫn cho phép
    // bỏ phiếu khi pending vote đã được tạo ngay trước khi hiệp đấu vừa mới hết
    if (timer && (!timer.isRunning
        && (timer.remainingMs !== 0 || !setting?.allowPostTimeVote))) return

    let buffer = pressBufferDb.get(judgeId)

    if (!buffer) {
        const newBuffer: PressBuffer = {
            presses: [],
            timeout: setTimeout(() =>
                finalizePress(judgeId, newBuffer.presses)
                    .forEach(s => startVote(io, courtId, round, judgeId, timer, {
                        side: data.side,
                        scoreType: s,
                        value: "increase"
                    })),
                setting?.pressBufferMs || 400)
        }
        pressBufferDb.set(judgeId, newBuffer)
        buffer = newBuffer
    }

    buffer.presses.push(data.scoreType)

    // Mỗi combo bấm chỉ có 2 lần bấm và không có điểm 1
    if (buffer.presses.length >= 2 || data.scoreType == 1) {
        clearTimeout(buffer.timeout)
        finalizePress(judgeId, buffer.presses)
            .forEach(s => startVote(io, courtId, round, judgeId, timer, {
                side: data.side,
                scoreType: s,
                value: "increase"
            }))
    }
}

export function calScore(score: Score, rivalGJ: number) {
    return score[1] + score[2] * 2 + score[3] * 3 + score[4] * 4 + score[5] * 5 + rivalGJ
}

export default function initScoreChannel(io: any, socket: any) {
    // Máy điều khiển cập nhật điểm
    // Phải có vai trò là "control", courtId trong payload jwt
    socket.on("score:control:update", (data: UpdateScoreData) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const round = getRound(user.courtId)
        if (!round) return

        updatedScore(io, user.courtId, round, data)
    })

    // Máy giám định cập nhật điểm
    // Phải có vai trò là "judge", courtId trong payload jwt
    // Chỉ được cập nhật điểm 1, 2, 3, 4, 5 mỗi lần tăng lên 1
    // Chỉ được cập nhật khi đồng hồ đang chạy
    socket.on("score:judge:update", (data: UpdateScoreData) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "judge") return
        if (!["blue", "red"].includes(data.side)) return
        if (!scoreTypes.includes(data.scoreType) || data.scoreType === "gj") return

        const round = getRound(user.courtId)
        if (!round) return

        const timer = timerDb.get(user.courtId)
        handleJudgeScore(io, socket.id, user.courtId, round, data, timer)
    })
}