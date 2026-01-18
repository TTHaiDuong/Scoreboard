import { handleJudgeScore, sendScoreToClient, updatedScore, } from "./score.js"
import { scoreTypes, UpdateScoreData, getDefaultRound, Round } from "../../scripts/types.js"
import { getRound } from "./match.js"

const testModeDb: Map<string, Omit<Round, "win">> = new Map()

export default function initTestModeChannel(io: any, socket: any) {
    socket.on("testmode:start", () => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const test = getDefaultRound()
        testModeDb.set(socket.user.courtId, test)
        sendScoreToClient(io, user.courtId, test)
    })

    socket.on("testmode:control:use", (data: UpdateScoreData) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        const test = testModeDb.get(user.courtId)
        if (!test) return

        updatedScore(io, socket, test, data)
    })

    socket.on("testmode:judge:use", (data: UpdateScoreData) => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "judge") return
        if (!["blue", "red"].includes(data.side)) return
        if (!scoreTypes.includes(data.scoreType) || data.scoreType === "gj") return

        const round = testModeDb.get(user.courtId)
        if (!round) return

        handleJudgeScore(io, socket.id, user.courtId, round, data)
    })

    socket.on("testmode:close", () => {
        const user = socket.user
        if (!user || !user.courtId || user.role !== "control") return

        testModeDb.delete(user.courtId)
        const round = getRound(socket.user.courtId)
        if (!round) return
        sendScoreToClient(io, user.courtId, round)
    })
}