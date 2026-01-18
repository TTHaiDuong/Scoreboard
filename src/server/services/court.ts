import Style, { printLines } from "../terminal-styles.js"
import crypto from "crypto"

export const courts: Map<string, {
    blue: {
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        gj: number
    },
    red: {
        1: number,
        2: number,
        3: number,
        4: number,
        5: number,
        gj: number
    },
    jwt?: string
}> = new Map()

export type Score = {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number,
    gj: number
}

export function createDefaultCourt(): Score {
    return {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        gj: 0
    }
}

type ScoreKey = 1 | 2 | 3 | 4 | 5 | "gj"

type PendingVote = {
    courtId: string
    blueOrRed: "blue" | "red"
    score: ScoreKey
    voters: Set<string>
    timeout: NodeJS.Timeout
}

const pendingVotes: Map<string, PendingVote> = new Map()

function createVoteKey(data: any) {
    return `${data.courtId}|${data.blueOrRed}|${data.score}`
}

function isVoter(io: any, clientId: string, data: any) {
    const voteKey = createVoteKey(data)

    // Khi thời gian hiệp đấu kết thúc, không cho tạo thêm pending vote nhưng vẫn cho phép
    // bỏ phiếu khi pending vote đã được tạo ngay trước khi hiệp đấu vừa mới hết
    if (!pendingVotes.has(voteKey) /* && !Timeout */) {
        const voters = new Set<string>()
        voters.add(clientId)

        const timeout = setTimeout(() => {
            pendingVotes.delete(voteKey)
        }, 1000)

        pendingVotes.set(voteKey, {
            courtId: data.courtId,
            blueOrRed: data.blueOrRed,
            score: data.score,
            voters,
            timeout
        })
    }

    const pending = pendingVotes.get(voteKey)
    if (!pending) return
    pending.voters.add(clientId)

    if (pending.voters.size >= 2) {
        clearTimeout(pending.timeout)
        pendingVotes.delete(voteKey)
        updatedScore(io, data)
    }
}

function updatedScore(io: any, data: {
    courtId: string,
    blueOrRed: "blue" | "red",
    score: ScoreKey,
    action: "subtract" | undefined
}) {
    const control = courts.get(data.courtId)!

    control[data.blueOrRed][data.score] = Math.max(0, control[data.blueOrRed][data.score] + (data.action ? -1 : 1))

    io.to(`court-${data.courtId}`).emit("score:update", {
        courtId: data.courtId,
        blue: control.blue,
        red: control.red
    })
}

type PressBuffer = {
    presses: number[]
    timeout: NodeJS.Timeout
}

const pressBuffers = new Map<string, PressBuffer>()

function finalizePress(io: any, clientId: string, data: any) {
    const buffer = pressBuffers.get(clientId)
    if (!buffer) return

    const presses = buffer.presses.sort()

    let score: ScoreKey | null = null

    // Ví dụ luật
    if (presses.length === 1) {
        score = presses[0] as ScoreKey
    }
    else if (presses.includes(1) && presses.includes(3) || presses.filter(x => x === 2).length === 2) {
        score = 4
    }
    else if (presses.includes(2) && presses.includes(3)) {
        score = 5
    }

    pressBuffers.delete(clientId)

    if (!score) return

    // đưa vào hệ thống voting hiện tại của bạn
    isVoter(io, clientId, {
        courtId: data.courtId,
        blueOrRed: data.blueOrRed,
        score
    })
}

type MatchTimer = {
    remainingMs: number
    interval?: NodeJS.Timeout
    startAt: number | null
    durationMs: number
    isRunning: boolean
}

const timers: Map<string, MatchTimer> = new Map()

function resetTimer(io: any, data: any) {
    stopTimer(io, data.courtId)

    timers.set(data.courtId, {
        remainingMs: data.durationMs,
        startAt: null,
        interval: undefined,
        durationMs: data.durationMs,
        isRunning: false
    })

    io.to(`court-${data.courtId}`).emit("timer:update", {
        remaining: data.durationMs,
        durations: data.durationMs
    })
}

function runTimer(io: any, courtId: string) {
    const timer = timers.get(courtId)
    if (!timer || timer.interval) return

    timer.startAt = Date.now()

    timer.interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - timer.startAt!
        const remaining = Math.max(0, timer.remainingMs - elapsed)

        io.to(`court-${courtId}`).emit("timer:update", {
            remaining: remaining,
            serverTime: now
        })

        if (remaining === 0) {
            clearInterval(timer.interval)
            timer.interval = undefined
            timer.remainingMs = 0
            timer.startAt = null
            timer.isRunning = false
        }
    }, 50)

    timer.isRunning = true

    io.to(`court-${courtId}`).emit("timer:setRunning", {
        isRunning: true,
    })
}

function stopTimer(io: any, courtId: string) {
    const timer = timers.get(courtId)
    if (!timer) return

    if (timer.interval) {
        clearInterval(timer.interval)
        timer.interval = undefined
    }

    if (timer.startAt) {
        timer.remainingMs -= Date.now() - timer.startAt
        timer.startAt = null
    }

    timer.isRunning = false

    io.to(`court-${courtId}`).emit("timer:setRunning", {
        isRunning: false,
    })
}

export function handleCourt(io: any, socket: any) {
    socket.on("court:join", (courtId: string) => {
        const room = `court-${courtId}`
        socket.join(room)

        const score = courts.get(courtId)
        if (!score) return
        io.to(`court-${courtId}`).emit("score:update", {
            courtId: courtId,
            blue: score.blue,
            red: score.red
        })
    })

    socket.on("court:leave", (courtId: string) => {
        socket.leave(`court-${courtId}`)
    })

    socket.on("get-id", (ack: any) => {
        const id = crypto.randomUUID()
        socket.data.clientId = id
        if (typeof ack === "function") ack(id)
    })

    socket.on("court:create", (ack: any) => {
        const courtId = "1"
        if (courts.has(courtId)) return
        courts.set(courtId, { blue: createDefaultCourt(), red: createDefaultCourt() })
        ack(courtId)
    })

    socket.on("court:clear", (data: { courtId: string, durationMs: number }) => {
        const control = courts.get(data.courtId)
        if (!control) return
        control.blue = createDefaultCourt()
        control.red = createDefaultCourt()

        io.to(`court-${data.courtId}`).emit("score:update", {
            courtId: data.courtId,
            blue: control.blue,
            red: control.red
        })

        resetTimer(io, data)
    })

    socket.on("update-score", (data: {
        courtId: string
        blueOrRed: "blue" | "red"
        score: ScoreKey,
        action: "subtract" | undefined
        isControl: boolean
    }) => {
        const { courtId, blueOrRed, score } = data

        if (!courtId || !["blue", "red"].includes(blueOrRed)) return
        if (![1, 2, 3, 4, 5, "gj"].includes(score)) return
        if (!courts.has(courtId)) return

        const timer = timers.get(courtId)

        const clientId = socket.data.clientId
        if (clientId) {
            console.log(
                "Side: " + Style.apply(blueOrRed, [blueOrRed]),
                "| Score: " + Style.apply(score + "", ["yellow"]),
                "| Client: " + Style.apply(clientId, ["green"])
            )
            if (timer && !timer.isRunning && timer.durationMs !== timer.remainingMs) return

            let buffer = pressBuffers.get(clientId)

            if (!buffer) {
                buffer = {
                    presses: [],
                    timeout: setTimeout(() => finalizePress(io, clientId, data), 400)
                }
                pressBuffers.set(clientId, buffer)
            }

            buffer.presses.push(data.score as number)
            if (buffer.presses.length >= 2) {
                clearTimeout(buffer.timeout)
                finalizePress(io, clientId, data)
            }
            return
        }

        if (data.isControl) {
            if (timer && timer.isRunning) return
            updatedScore(io, data)
        }
    })


    socket.on("court:reset", (data: { courtId: string, isControl: boolean }) => {
        if (!data.isControl) return
        const score = courts.get(data.courtId)
        if (!score) return

        const resetScore = <T extends Record<string | number, number>>(obj: T): T =>
            Object.fromEntries(
                Object.keys(obj).map(k => [k, 0])
            ) as T

        score.blue = resetScore(score.blue)
        score.red = resetScore(score.red)

    })

    socket.on("timer:reset", (data: { courtId: string, durationMs: number }) => {
        resetTimer(io, data)
    })

    socket.on("timer:stop", (data: { courtId: string }) => {
        stopTimer(io, data.courtId)
    })

    socket.on("timer:run", (data: { courtId: string }) => {
        const t = timers.get(data.courtId)
        if (!t || t.interval || t.remainingMs <= 0) return
        runTimer(io, data.courtId)
    })

    socket.on("timer:duration", (data: { courtId: string, duration: number }) => {
        const t = timers.get(data.courtId)
        if (!t) return
        t.durationMs = data.duration

        socket.to(`court-${data.courtId}`).emit("duration:update", {
            duration: data.duration,
        })
    })
}