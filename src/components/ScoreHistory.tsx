"use client"

import { ScoreEvent, RoundResult } from "../scripts/match-types"

// ============================================================
// SCORE HISTORY — Timeline điểm từng hiệp + undo
// ============================================================

const SCORE_LABEL: Record<number | "gj", string> = {
    1: "Đấm (1đ)",
    2: "Đá thân (2đ)",
    3: "Đá đầu (3đ)",
    4: "Đá xoay thân (4đ)",
    6: "Đá xoay đầu (6đ)",
    gj: "Gam-jeom",
}

const SCORE_POINTS: Record<number | "gj", number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 6: 6, gj: 0,
}

function formatRemainingTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${sec.toString().padStart(2, "0")}`
}

function EventItem(props: {
    event: ScoreEvent
    runningBlue: number
    runningRed: number
    onUndo?: () => void
    isLast: boolean
}) {
    const { event } = props
    const isBlue = event.side === "blue"
    const isGj = event.scoreType === "gj"
    const pts = SCORE_POINTS[event.scoreType]

    return (
        <div className={`flex items-center gap-[10px] py-[8px] px-[4px]
            ${props.isLast ? "" : "border-b border-white/5"}`}>

            {/* Đồng hồ lúc ghi */}
            <span className="font-score text-[13px] text-white/40 w-[36px] shrink-0 text-right">
                {formatRemainingTime(event.remainingMs)}
            </span>

            {/* Điểm xanh */}
            <span className={`font-score text-[16px] w-[24px] text-center leading-none
                ${isBlue && !isGj ? "text-blue-300 font-bold" : "text-white/20"}`}>
                {isBlue && !isGj ? `+${pts}` : ""}
            </span>

            {/* Mô tả sự kiện */}
            <div className="flex-1 flex flex-col gap-[1px]">
                <span className={`text-[13px] font-medium
                    ${isGj
                        ? isBlue ? "text-red-300" : "text-blue-300"  // GJ đội nào bị phạt thì đội kia được
                        : isBlue ? "text-blue-300" : "text-red-300"
                    }`}>
                    {isBlue ? "Xanh" : "Đỏ"} — {SCORE_LABEL[event.scoreType]}
                    {isGj && <span className="text-white/40 font-normal"> (+1 cho đối thủ)</span>}
                </span>
            </div>

            {/* Điểm đỏ */}
            <span className={`font-score text-[16px] w-[24px] text-center leading-none
                ${!isBlue && !isGj ? "text-red-300 font-bold" : "text-white/20"}`}>
                {!isBlue && !isGj ? `+${pts}` : ""}
            </span>

            {/* Tổng điểm chạy */}
            <span className="text-[12px] text-white/30 w-[36px] text-right font-score shrink-0">
                {props.runningBlue}:{props.runningRed}
            </span>

            {/* Nút undo (chỉ hiện ở event cuối cùng) */}
            {props.isLast && props.onUndo && (
                <button
                    onClick={props.onUndo}
                    className="flex-center px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium
                        bg-amber-500/20 text-amber-400 active:bg-amber-500/40 transition-colors shrink-0"
                >
                    Hoàn tác
                </button>
            )}
        </div>
    )
}

export default function ScoreHistory(props: {
    round?: RoundResult
    roundNo: 1 | 2 | 3 | "golden"
    onUndo?: () => void
}) {
    const { round } = props

    if (!round || round.events.length === 0) {
        return (
            <div className="flex-center py-[24px] text-[13px] text-white/30">
                {round ? "Chưa có điểm nào trong hiệp này" : "Hiệp này chưa diễn ra"}
            </div>
        )
    }

    // Tính điểm chạy tích lũy
    type Running = { blue: number; red: number }
    const runningScores: Running[] = []
    let cur: Running = { blue: 0, red: 0 }

    for (const ev of round.events) {
        if (ev.delta === -1) continue // bỏ qua undo events trong display

        const pts = SCORE_POINTS[ev.scoreType]
        if (ev.scoreType === "gj") {
            if (ev.side === "blue") cur = { ...cur, red: cur.red + 1 }
            else cur = { ...cur, blue: cur.blue + 1 }
        } else {
            if (ev.side === "blue") cur = { ...cur, blue: cur.blue + pts }
            else cur = { ...cur, red: cur.red + pts }
        }
        runningScores.push({ ...cur })
    }

    const visibleEvents = round.events.filter(e => e.delta !== -1)

    const label = props.roundNo === "golden" ? "Golden Point" : `Hiệp ${props.roundNo}`

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-[4px] pb-[8px]
                border-b border-white/10 mb-[4px]">
                <span className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">
                    {label} — {visibleEvents.length} lần ghi điểm
                </span>
                <div className="flex gap-[16px]">
                    <span className="text-[11px] text-white/30">TG</span>
                    <span className="text-[11px] text-blue-400 w-[24px] text-center">X</span>
                    <span className="text-[11px] text-red-400 w-[24px] text-center">Đ</span>
                    <span className="text-[11px] text-white/30 w-[36px] text-right">Tổng</span>
                </div>
            </div>

            {visibleEvents.map((ev, idx) => (
                <EventItem
                    key={ev.id}
                    event={ev}
                    runningBlue={runningScores[idx]?.blue ?? 0}
                    runningRed={runningScores[idx]?.red ?? 0}
                    isLast={idx === visibleEvents.length - 1}
                    onUndo={idx === visibleEvents.length - 1 ? props.onUndo : undefined}
                />
            ))}
        </div>
    )
}