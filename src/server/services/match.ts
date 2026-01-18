import { sendScoreToClient, calScore } from "./score.js"
import {
    side,
    Side,
    Round,
    getDefaultRound,
    Match,
    MatchResult,
} from "../../scripts/types.js"


export const MATCH_DB: Map<string, Match> = new Map()

export function getRound(courtId: string): Round | null {
    const match = MATCH_DB.get(courtId)
    if (!match) return null

    return match.rounds.get(match.currentRoundIdx) || null
}

export function sendRoundToClient(io: any, courtId: string, currentRoundIdx: number) {
    io.to(`court-${courtId}`).emit("match:round:updated", {
        courtId: courtId,
        currentRoundIdx: currentRoundIdx
    })
}

export default function initRoundChannel(io: any, socket: any) {
    socket.on("match:init", () => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const match: Match = {
            rounds: new Map(),
            currentRoundIdx: 1
        };
        [1, 2, 3].forEach(r => match.rounds.set(r, getDefaultRound()))

        MATCH_DB.set(user.courtId, match)

        sendScoreToClient(io, user.courtId, match.rounds.get(1)!)
        sendRoundToClient(io, user.courtId, match.currentRoundIdx)
    })

    socket.on("match:round:create", (data: { roundIdx: number }) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const match = MATCH_DB.get(user.courtId)
        if (!match) return

        const newRound = getDefaultRound()
        match.rounds.set(data.roundIdx, newRound)
        if (data.roundIdx === match.currentRoundIdx)
            sendScoreToClient(io, user.courtId, newRound)
    })

    socket.on("match:round:delete", (data: { roundIdx: number }, ack: any) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const match = MATCH_DB.get(user.courtId)
        if (!match) return

        if (match.rounds.size <= 1) return
        const result = match.rounds.delete(data.roundIdx)
        if (typeof ack === "function") ack(result)

        if (data.roundIdx === match.currentRoundIdx) {
            const firstEntry = match.rounds.entries().next().value
            if (!firstEntry) return

            match.currentRoundIdx = firstEntry[0]
            sendScoreToClient(io, user.courtId, firstEntry[1])
            sendRoundToClient(io, user.courtId, match.currentRoundIdx)
        }
    })

    socket.on("match:round:win", (data: { side: Side, roundIdx: number }) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return
        if (!side.includes(data.side)) return

        const match = MATCH_DB.get(user.courtId)
        if (!match) return
        const round = match.rounds.get(data.roundIdx)
        if (!round) return
        round.win = data.side
    })

    socket.on("match:total", (data: { courtId: string }, ack: any) => {
        if (typeof ack !== "function") return
        const match = MATCH_DB.get(data.courtId)
        if (!match) return

        const matchResult: MatchResult = {}
        match.rounds.forEach((r, roundIdx) => {
            const roundResult = {
                blue: calScore(r.blue, r.red.gj),
                red: calScore(r.red, r.blue.gj)
            }
            matchResult[roundIdx] = roundResult
        })

        ack(matchResult)
    })

    socket.on("match:round:switch", (data: { roundIdx: number }) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const match = MATCH_DB.get(user.courtId)
        if (!match) return
        const round = match.rounds.get(data.roundIdx)
        if (!round) return
        match.currentRoundIdx = data.roundIdx

        sendScoreToClient(io, user.courtId, round)
        sendRoundToClient(io, user.courtId, match.currentRoundIdx)
    })
}