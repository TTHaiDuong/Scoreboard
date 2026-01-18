import Style, { printLines } from "../terminal-styles.js"
import jwt from "jsonwebtoken"
import { settings } from "./setting.js"
import IdManager from "./id-manager.js"
import { initTimer, timerDb } from "./timer.js"
import { getDefaultScore } from "@/scripts/types.js"
import "dotenv/config"
import { getRound } from "./match.js"

const JWT_SECRET = process.env.JWT_SECRET!

type CourtAuth = {
    pin: string
}

class CourtManager {
    private idManager = new IdManager((id) => this.courtDb.has(id.toString()))
    private courtDb: Map<string, CourtAuth> = new Map()
    // private countCourtCreatedDb: Map<string, number> = new Map()

    readonly MAX_COURTS = 5
    // readonly MAX_COURTS_BY_CONTROL = 3

    create(pin: string): { courtId: string, accessToken: string } | null {
        if (this.courtDb.size >= this.MAX_COURTS) return null

        const courtId = this.idManager.acquire().toString()
        const accessToken = this.requireAccessToken(courtId)

        this.courtDb.set(courtId, { pin: pin })
        return { courtId, accessToken }
    }

    requireAccessToken(courtId: string) {
        return jwt.sign({
            role: "control",
            courtId: courtId
        }, JWT_SECRET)
    }

    delete(courtId: string): boolean {
        const numberId = Number(courtId)
        if (isNaN(numberId)) return false

        this.idManager.release(numberId)
        return this.courtDb.delete(courtId)
    }

    get(courtId: string) {
        return this.courtDb.get(courtId)
    }
}
const COURT_MANAGER = new CourtManager()

export function initCourtChannel(io: any, socket: any) {
    socket.on("court:create", (data: { pin: string }, ack: any) => {
        if (typeof ack !== "function") return
        const res = COURT_MANAGER.create(data.pin)
        ack(res)
    })

    socket.on("court:access:require", (data: { courtId: string, pin: string }, ack: any) => {
        if (typeof ack !== "function") return
        const court = COURT_MANAGER.get(data.courtId)
        if (!court) {
            ack(null)
            return
        }

        const accessT = COURT_MANAGER.requireAccessToken(data.courtId)
        if (court!.pin === data.pin) {
            ack(accessT)
            return
        }
        ack(null)
    })

    socket.on("court:join", (data: { courtId: string }) => {
        const room = `court-${data.courtId}`
        socket.join(room)

        const round = getRound(data.courtId)
        if (!round) return

        io.to(`court-${data.courtId}`).emit("score:updated", {
            blue: round.blue,
            red: round.red
        })
    })

    socket.on("court:leave", (data: { courtId: string }) => {
        socket.leave(`court-${data.courtId}`)
    })
}