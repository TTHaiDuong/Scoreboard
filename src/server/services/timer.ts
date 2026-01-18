export type MatchTimer = {
    remainingMs: number
    interval?: NodeJS.Timeout
    startAt: number | null
    durationMs: number
    isRunning: boolean
}

export const timerDb: Map<string, MatchTimer> = new Map()

export function initTimer(io: any,
    data: { courtId: string, durationMs: number }
) {
    stopTimer(io, data.courtId)

    timerDb.set(data.courtId, {
        remainingMs: data.durationMs,
        startAt: null,
        interval: undefined,
        durationMs: data.durationMs,
        isRunning: false
    })

    io.to(`court-${data.courtId}`).emit("timer:updated", {
        remaining: data.durationMs,
        durations: data.durationMs
    })
}

function runTimer(io: any, courtId: string) {
    const timer = timerDb.get(courtId)
    if (!timer || timer.interval || timer.remainingMs <= 0) return

    timer.startAt = Date.now()

    timer.interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - timer.startAt!
        const remaining = Math.max(0, timer.remainingMs - elapsed)

        io.to(`court-${courtId}`).emit("timer:updated", {
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

    io.to(`court-${courtId}`).emit("timer:running:updated", {
        isRunning: true,
    })
}

function stopTimer(io: any, courtId: string) {
    const timer = timerDb.get(courtId)
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

    io.to(`court-${courtId}`).emit("timer:running:updated", {
        isRunning: false,
    })
}

export default function initTimerChannel(io: any, socket: any) {
    socket.on("timer:init", (data: { courtId: string, durationMs: number }) => {
        initTimer(io, data)
    })

    socket.on("timer:stop", (data: { courtId: string }) => {
        stopTimer(io, data.courtId)
    })

    socket.on("timer:run", (data: { courtId: string }) => {
        runTimer(io, data.courtId)
    })

    socket.on("timer:duration:set", (data: { courtId: string, durationMs: number }) => {
        const t = timerDb.get(data.courtId)
        if (!t) return
        t.durationMs = data.durationMs

        socket.to(`court-${data.courtId}`).emit("timer:duration:updated", {
            durationMs: t.durationMs,
        })
    })
}