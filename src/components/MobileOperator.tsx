"use client"

import { useEffect, useRef, useState } from "react"
import { getSocket } from "@/scripts/global-client-io"
import { PointType, Score, getDefaultScore, UpdateScoreData } from "@/scripts/types"
import MobileSetting from "./MobileSetting"
import QuickAccess from "./QuickAccess"

// ── SVG assets ────────────────────────────────────────────────
import ArmorI from "@/assets/solid-armor.svg"
import HelmetI from "@/assets/solid-helmet.svg"
import PunchI from "@/assets/solid-punch.svg"
import WifiI from "@/assets/wifi.svg"
import JudgeI from "@/assets/judge.svg"
import NutI from "@/assets/nut.svg"
import CameraI from "@/assets/camera.svg"
import CameraOffI from "@/assets/camera-off.svg"
import IvrPanel, { type IvrState, createDefaultIvrState } from "./IvrPanel"

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type AppMode = "match" | "break" | "kyeshi" | "test"

const MODE_LABEL: Record<AppMode, string> = {
    match: "Thi đấu",
    break: "Giải lao",
    kyeshi: "Kye-shi",
    test: "Test mode",
}

const MODE_COLOR: Record<AppMode, string> = {
    match: "text-white/70",
    break: "text-blue-300",
    kyeshi: "text-amber-300",
    test: "text-amber-400",
}

// ══════════════════════════════════════════════════════════════
// SCORE ROW — một dòng điểm (icon + số + nút +/−)
// ══════════════════════════════════════════════════════════════

const POINT_ROWS: { type: PointType; icon?: any; label?: string }[] = [
    { type: 1, icon: PunchI },
    { type: 2, icon: ArmorI },
    { type: 3, icon: HelmetI },
    { type: 4, label: "4" },
    { type: 6, label: "6" },
]

function ScoreRow(props: {
    side: "BLUE" | "RED"
    type: PointType
    icon?: any
    label?: string
    value: number
    onPlus: () => void
    onMinus: () => void
    disabled: boolean
}) {
    const isBlue = props.side === "BLUE"
    const accent = isBlue ? "rgba(0,136,255," : "rgba(255,56,59,"

    const BtnPlus = () => (
        <button
            disabled={props.disabled}
            onPointerDown={props.onPlus}
            className={`flex-center w-[22px] h-[22px] rounded-[6px] text-[16px] text-white
                transition-colors active:scale-95
                ${props.disabled ? "opacity-30 cursor-not-allowed" : "active:opacity-80"}`}
            style={{ background: `${accent}0.5)` }}
        >+</button>
    )

    const BtnMinus = () => (
        <button
            disabled={props.disabled}
            onPointerDown={props.onMinus}
            className={`flex-center w-[22px] h-[22px] rounded-[6px] text-[16px]
                text-white/40 transition-colors active:scale-95
                ${props.disabled ? "opacity-30 cursor-not-allowed" : "active:opacity-80"}`}
            style={{ background: `${accent}0.15)` }}
        >−</button>
    )

    const Icon = () => (
        props.icon
            ? <props.icon className="w-[18px] h-[18px]"
                style={{ color: `${accent}0.85)` }} />
            : <span className="flex-center text-[20px] w-[18px] font-bold"
                style={{ color: `${accent}0.85)` }}>{props.label}</span>
    )

    return (
        <div
            className="flex items-center px-[8px] py-[5px] rounded-[8px] gap-[6px]"
            style={{ background: `${accent}0.12)` }}
        >
            {isBlue ? (
                <>
                    <Icon />
                    <span className="flex-1 text-center font-score font-bold text-[15px] text-white/80
                        font-variant-numeric tabular-nums">
                        {props.value}
                    </span>
                    <BtnMinus />
                    <BtnPlus />
                </>
            ) : (
                <>
                    <BtnPlus />
                    <BtnMinus />
                    <span className="flex-1 text-center font-score font-bold text-[15px] text-white/80
                        font-variant-numeric tabular-nums">
                        {props.value}
                    </span>
                    <Icon />
                </>
            )}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// GJ ROW — hàng gam-jeom riêng biệt
// ══════════════════════════════════════════════════════════════

function GjRow(props: {
    side: "BLUE" | "RED"
    value: number
    onPlus: () => void
    onMinus: () => void
    disabled: boolean
}) {
    const isBlue = props.side === "BLUE"
    return (
        <div className="flex items-center px-[8px] py-[5px] rounded-[8px] gap-[6px]
            bg-white/10">
            {isBlue ? (
                <>
                    <span className="text-[16px] font-bold text-white/60">GJ</span>
                    <span className="flex-1 text-center font-score font-bold text-[15px] text-amber-300
                        font-variant-numeric tabular-nums">
                        {props.value}
                    </span>
                    <button disabled={props.disabled} onPointerDown={props.onMinus}
                        className="flex-center w-[22px] h-[22px] rounded-[6px] text-[16px]
                            text-white/40 bg-white/10 active:scale-95 disabled:opacity-30">−</button>
                    <button disabled={props.disabled} onPointerDown={props.onPlus}
                        className="flex-center w-[22px] h-[22px] rounded-[6px] text-[16px]
                            text-white bg-white/20 active:scale-95 disabled:opacity-30">+</button>
                </>
            ) : (
                <>
                    <button disabled={props.disabled} onPointerDown={props.onPlus}
                        className="flex-center w-[22px] h-[22px] rounded-[6px] text-[16px]
                            text-white bg-white/20 active:scale-95 disabled:opacity-30">+</button>
                    <button disabled={props.disabled} onPointerDown={props.onMinus}
                        className="flex-center w-[22px] h-[22px] rounded-[6px] text-[16px]
                            text-white/40 bg-white/10 active:scale-95 disabled:opacity-30">−</button>
                    <span className="flex-1 text-center font-score font-bold text-[15px] text-amber-300
                        font-variant-numeric tabular-nums">
                        {props.value}
                    </span>
                    <span className="text-[16px] font-bold text-white/60">GJ</span>
                </>
            )}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// MODE SELECTOR — dropdown chọn mode
// ══════════════════════════════════════════════════════════════

function ModeSelector(props: {
    current: AppMode
    onChange: (m: AppMode) => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [open])

    const MODES: AppMode[] = ["match", "break", "kyeshi", "test"]

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-[4px] px-[8px] py-[3px] rounded-[8px]
                    text-[10px] font-semibold tracking-wide bg-white/10 transition-colors
                    active:bg-white/20 ${MODE_COLOR[props.current]}`}
            >
                {MODE_LABEL[props.current]}
                <span className="text-[8px] text-white/30">▼</span>
            </button>

            {open && (
                <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2
                    bg-[#1a1a1a] border border-white/15 rounded-[12px]
                    overflow-hidden z-50 w-[130px] shadow-lg">
                    {MODES.map(m => (
                        <button
                            key={m}
                            onClick={() => { props.onChange(m); setOpen(false) }}
                            className={`flex items-center gap-[8px] w-full px-[12px] py-[9px]
                                text-[12px] font-medium transition-colors active:bg-white/10
                                ${props.current === m ? "bg-white/10" : "hover:bg-white/5"}`}
                        >
                            <div className={`w-[6px] h-[6px] rounded-full shrink-0
                                ${m === "test" ? "bg-amber-400" :
                                    m === "kyeshi" ? "bg-amber-300" :
                                        m === "break" ? "bg-blue-300" :
                                            "bg-green-400"}`}
                            />
                            <span className={MODE_COLOR[m]}>{MODE_LABEL[m]}</span>
                            {props.current === m && (
                                <span className="ml-auto text-white/40 text-[10px]">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// ROUND INDICATOR — hiệp thắng best-of-3
// ══════════════════════════════════════════════════════════════

function RoundIndicator(props: {
    currentRound: number
    blueWins: number
    redWins: number
    side: "BLUE" | "RED"
}) {
    const wins = props.side === "BLUE" ? props.blueWins : props.redWins
    const isBlue = props.side === "BLUE"

    return (
        <div className={`flex items-center gap-[4px] px-[6px]
            ${isBlue ? "justify-start" : "justify-end flex-row-reverse"}`}>
            <span className="text-[9px] font-semibold text-white/30 tracking-wider mr-[2px]">
                THẮNG
            </span>
            {[1, 2].map(i => {
                const won = wins >= i
                const isCurrent = props.currentRound === i
                return (
                    <div
                        key={i}
                        className={`flex-center rounded-full text-[8px] font-bold transition-all
                            ${isCurrent
                                ? "w-[16px] h-[16px] border border-white/30 text-white/40"
                                : won
                                    ? `w-[16px] h-[16px] ${isBlue ? "bg-blue-500" : "bg-red-500"} text-white`
                                    : "w-[14px] h-[14px] bg-white/10 text-white/20"
                            }`}
                    >
                        {i}
                    </div>
                )
            })}
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// SCORE PANEL — điểm lớn + camera icon
// ══════════════════════════════════════════════════════════════

function ScorePanel(props: {
    side: "BLUE" | "RED"
    total: number
    isLeading: boolean
    cameraOn?: boolean
    onCameraClick?: () => void
}) {
    const isBlue = props.side === "BLUE"
    const bg = isBlue
        ? "linear-gradient(180deg,#0800A3,#050069)"
        : "linear-gradient(180deg,#9F0000,#740707)"
    const radius = isBlue
        ? "0 var(--border-radius-medium) var(--border-radius-medium) 0"
        : "var(--border-radius-medium) 0 0 var(--border-radius-medium)"

    return (
        <div
            className="grid"
            style={{
                background: bg,
                borderRadius: radius,
                gridTemplateRows: "1fr 3fr 1fr",
                minHeight: "90px",
            }}
        >
            <div />
            <div className="flex justify-center items-center">
                <span
                    className="font-score font-bold leading-none font-variant-numeric tabular-nums"
                    style={{
                        fontSize: "clamp(2rem,10vw,4.5rem)",
                        color: props.isLeading ? "#FFD700" : "white",
                        transition: "color 0.3s",
                    }}
                >
                    {props.total}
                </span>
            </div>
            <div className="flex justify-center items-center pb-[6px]">
                <button
                    onClick={props.onCameraClick}
                    className={`flex items-center gap-[5px] px-[8px] py-[4px]
                        rounded-full transition-all active:scale-90
                        ${props.cameraOn
                            ? "bg-white/15 text-white/70 active:bg-white/25"
                            : "bg-white/5  text-white/25 active:bg-white/10"
                        }`}
                >
                    {props.cameraOn
                        ? <CameraI className="w-[13px] h-[13px]" />
                        : <CameraOffI className="w-[13px] h-[13px]" />
                    }
                    <span className="text-[9px] font-semibold tracking-wide uppercase">
                        IVR
                    </span>
                </button>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// CLOCK PANEL — đồng hồ + label hiệp
// ══════════════════════════════════════════════════════════════

function ClockPanel(props: {
    roundNo: number
    remaining: number
    duration: number
    isRunning: boolean
    mode: AppMode
    onToggle: () => void
}) {
    const min = Math.floor(props.remaining / 60000)
    const sec = Math.floor((props.remaining % 60000) / 1000)
    const timeStr = `${min}:${sec.toString().padStart(2, "0")}`

    const borderColor =
        props.mode === "test" ? "#F59E0B" :
            props.mode === "kyeshi" ? "#F59E0B" :
                props.mode === "break" ? "#60A5FA" : "#FFD700"

    const statusLabel =
        !props.isRunning && props.remaining === props.duration ? "BẮT ĐẦU" :
            props.isRunning ? "ĐANG CHẠY" :
                props.remaining === 0 ? "HẾT GIỜ" : "TẠM DỪNG"

    const statusBg =
        !props.isRunning && props.remaining === props.duration ? "bg-white/20" :
            props.isRunning ? "bg-[#FFD700]" :
                props.remaining === 0 ? "bg-red-500" : "bg-white/30"

    const statusText =
        props.isRunning ? "text-black" : "text-white"

    const roundLabel =
        props.mode === "break" ? "GIẢI LAO" :
            props.mode === "kyeshi" ? "KYE-SHI" :
                props.mode === "test" ? "TEST" :
                    `HIỆP ${props.roundNo}`

    return (
        <button
            onClick={props.onToggle}
            className="grid rounded-[10px] overflow-hidden select-none active:scale-95 transition-transform"
            style={{
                gridTemplateRows: "1fr 2.5fr 1fr",
                border: `2px solid ${borderColor}`,
            }}
        >
            <div className="flex justify-center items-center text-[10px] font-bold text-white/50 tracking-wider pt-[2px]">
                {roundLabel}
            </div>
            <div
                className="flex justify-center items-center font-score font-bold leading-none tabular-nums"
                style={{
                    fontSize: "clamp(1.6rem,5.5vw,3rem)",
                    color: borderColor,
                }}
            >
                {timeStr}
            </div>
            <div className={`flex-center text-[9px] font-bold ${statusBg} ${statusText} tracking-wider`}>
                {statusLabel}
            </div>
        </button>
    )
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MobileOperator() {
    // ── State ──────────────────────────────────────────────
    const [courtId, setCourtId] = useState("1")
    const [blueScore, setBlueScore] = useState<Score>(getDefaultScore())
    const [redScore, setRedScore] = useState<Score>(getDefaultScore())
    const [remaining, setRemaining] = useState(120_000)
    const [durationMs, setDurationMs] = useState(120_000)
    const [isRunning, setRunning] = useState(false)
    const [roundNo, setRoundNo] = useState(1)
    const [blueWins, setBlueWins] = useState(0)
    const [redWins, setRedWins] = useState(0)
    const [judgeCount, setJudgeCount] = useState(0)
    const [latencyMs, setLatencyMs] = useState<number | null>(null)

    const [mode, setMode] = useState<AppMode>("match")
    const [ivrSide, setIvrSide] = useState<"BLUE" | "RED" | null>(null)
    const [ivrState, setIvrState] = useState<IvrState>(() => createDefaultIvrState(1))
    const [settingVisible, setSettingVisible] = useState(false)
    const [quickAccessVisible, setQuickAccessVisible] = useState(false)

    // ── Score calculation ──────────────────────────────────
    function calcTotal(score: Score, rivalGj: number) {
        return score[1] + score[2] * 2 + score[3] * 3 +
            score[4] * 4 + score[6] * 6 + rivalGj
    }

    const blueTotal = calcTotal(blueScore, redScore["gj"])
    const redTotal = calcTotal(redScore, blueScore["gj"])
    const blueLeading = blueTotal > redTotal
    const redLeading = redTotal > blueTotal

    // ── Socket ──────────────────────────────────────────────
    useEffect(() => {
        const socket = getSocket()

        const onConnect = () => {
            socket.emit("court:create", (id: string) => setCourtId(id))
        }

        if (socket.connected) onConnect()
        else socket.once("connect", onConnect)

        socket.on("score:updated", (data: { blue: Score; red: Score }) => {
            setBlueScore(data.blue)
            setRedScore(data.red)
        })

        socket.on("timer:updated", (data: { remaining: number }) => {
            setRemaining(data.remaining)
            if (data.remaining === 0) setRunning(false)
        })

        socket.on("timer:running:updated", (data: { isRunning: boolean }) => {
            setRunning(data.isRunning)
        })

        socket.on("timer:duration:updated", (data: { durationMs: number }) => {
            setDurationMs(data.durationMs)
        })

        // Latency ping
        const pingInterval = setInterval(() => {
            const start = Date.now()
            socket.emit("ping", () => setLatencyMs(Date.now() - start))
        }, 3000)

        return () => {
            socket.off("score:updated")
            socket.off("timer:updated")
            socket.off("timer:running:updated")
            socket.off("timer:duration:updated")
            clearInterval(pingInterval)
        }
    }, [])

    // ── Actions ────────────────────────────────────────────
    const canScore = mode === "match" || mode === "test"

    function emitScore(side: "BLUE" | "RED", type: PointType, action: "increase" | "decrease") {
        if (!canScore) return
        const data: UpdateScoreData = { side, scoreType: type, value: action }
        getSocket().emit("score:control:update", data)
    }

    function toggleTimer() {
        const socket = getSocket()
        if (isRunning) {
            socket.emit("timer:stop", { courtId })
        } else if (remaining > 0) {
            socket.emit("timer:run", { courtId })
        }
    }

    // ── Test mode overlay ──────────────────────────────────
    // ── IVR helpers ─────────────────────────────────────────────
    function formatRemaining(): string {
        const min = Math.floor(remaining / 60000)
        const sec = Math.floor((remaining % 60000) / 1000)
        return `${min}:${sec.toString().padStart(2, "0")}`
    }

    // ── Render ──────────────────────────────────────────────────
    const isTest = mode === "test"
    const outerStyle = isTest
        ? { outline: "3px solid #F59E0B", outlineOffset: "-3px", }
        : {}

    // ── Render ─────────────────────────────────────────────
    return (
        <div
            className="relative flex flex-col justify-between w-screen h-dvh overflow-hidden select-none bg-[#111111]"
            style={{
                // background: `
                //     linear-gradient(180deg, #00000000 0%, #00000050 20%, #000000 100%),
                //     linear-gradient(270deg, #A30000 0%, #57004A 48%, #43005D 52%, #00009F 100%)
                // `,
                color: "white",
                ...outerStyle
            }}
        >
            {/* Test mode banner */}
            {isTest && (
                <div className="absolute top-0 left-0 right-0 flex-center py-[3px]
                    bg-amber-500/30 text-amber-300 text-[10px] font-bold tracking-widest z-10">
                    TEST MODE — điểm không được tính thật
                </div>
            )}

            {/* Overlays */}
            {settingVisible && (
                <MobileSetting onClose={() => setSettingVisible(false)} />
            )}
            {quickAccessVisible && (
                <div
                    className="fixed inset-0 z-[50] flex flex-col justify-end"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    onClick={e => { if (e.target === e.currentTarget) setQuickAccessVisible(false) }}
                >
                    <div className="w-full h-[85dvh] rounded-t-[20px] overflow-hidden"
                        style={{ background: "#111" }}>
                        <QuickAccess onClose={() => setQuickAccessVisible(false)} />
                    </div>
                </div>
            )}

            {/* IVR overlay */}
            {ivrSide && (
                <div className="fixed inset-0 z-[60] flex flex-col"
                    style={{ background: "#111" }}>
                    <IvrPanel
                        state={ivrState}
                        roundNo={roundNo}
                        timeLabel={formatRemaining()}
                        onClose={() => setIvrSide(null)}
                        onChange={setIvrState}
                    />
                </div>
            )}

            {/* ── HEADER: trạng thái kết nối ── */}
            <div className="flex items-center justify-between px-[12px] py-[6px]
                bg-black/30 text-[11px]">
                <div className="flex items-center gap-[6px] text-white/50">
                    <WifiI className="h-[10px]" />
                    <span>{latencyMs !== null ? `${latencyMs}ms` : "–"}</span>
                    <span className="text-white/30">·</span>
                    <span>Sân {courtId}</span>
                </div>
                <div className="flex items-center gap-[5px]">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <JudgeI
                            key={i}
                            className="h-[10px]"
                            style={{ opacity: i < judgeCount ? 1 : 0.2 }}
                        />
                    ))}
                </div>
                <span className="text-white/30 text-[10px] truncate max-w-[100px]">
                    Chung kết · 58KG
                </span>
            </div>

            {/* ── SCORE + CLOCK ── */}
            <div
                className="grid px-[0px]"
                style={{
                    gridTemplateColumns: "1fr 96px 1fr",
                    gap: "0 4px",
                }}
            >
                {/* Round wins — blue */}
                <RoundIndicator
                    currentRound={roundNo}
                    blueWins={blueWins}
                    redWins={redWins}
                    side="BLUE"
                />
                <div />
                {/* Round wins — red */}
                <RoundIndicator
                    currentRound={roundNo}
                    blueWins={blueWins}
                    redWins={redWins}
                    side="RED"
                />

                {/* Score blue */}
                <ScorePanel
                    side="BLUE"
                    total={blueTotal}
                    isLeading={blueLeading}
                    cameraOn={ivrState.blue.remaining > 0}
                    onCameraClick={() => setIvrSide("BLUE")}
                />

                {/* Clock */}
                <ClockPanel
                    roundNo={roundNo}
                    remaining={remaining}
                    duration={durationMs}
                    isRunning={isRunning}
                    mode={mode}
                    onToggle={toggleTimer}
                />

                {/* Score red */}
                <ScorePanel
                    side="RED"
                    total={redTotal}
                    isLeading={redLeading}
                    cameraOn={ivrState.red.remaining > 0}
                    onCameraClick={() => setIvrSide("RED")}
                />
            </div>

            {/* ── TIMER CONTROLS ── */}
            <div className="flex items-center justify-between px-[10px] py-[6px]
                bg-white/5 rounded-[12px] mx-[8px]">

                {/* Hiệp indicator */}
                <div className="flex flex-col gap-[3px]">
                    <span className="text-[9px] font-semibold text-white/30 tracking-wider">HIỆP</span>
                    <div className="flex items-center gap-[4px]">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`flex-center w-[18px] h-[18px] rounded-full text-[9px] font-bold
                                    transition-all
                                    ${i === roundNo
                                        ? "bg-amber-400 text-black"
                                        : i < roundNo
                                            ? "bg-white/25 text-white/60"
                                            : "bg-white/8 text-white/25"
                                    }`}
                            >
                                {i}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Play/Stop button */}
                <button
                    onClick={toggleTimer}
                    className="flex-center px-[20px] py-[8px] rounded-[12px] text-[13px]
                        font-semibold bg-white text-black active:scale-95 transition-transform
                        min-w-[80px] shadow-md"
                >
                    {isRunning ? "Dừng lại" :
                        remaining === durationMs ? "Bắt đầu" : "Tiếp tục"}
                </button>

                {/* Mode selector */}
                <div className="flex flex-col items-end gap-[3px]">
                    <span className="text-[9px] font-semibold text-white/30 tracking-wider">CHẾ ĐỘ</span>
                    <ModeSelector current={mode} onChange={setMode} />
                </div>
            </div>

            {/* ── POINT EDITORS ── */}
            <div className="flex gap-[6px] px-[8px] flex-1 min-h-0">

                {/* Blue side */}
                <div className="flex-1 flex flex-col gap-[4px]">
                    {/* GJ tách riêng lên đầu */}
                    <GjRow
                        side="BLUE"
                        value={blueScore["gj"]}
                        onPlus={() => emitScore("BLUE", "gj", "increase")}
                        onMinus={() => emitScore("BLUE", "gj", "decrease")}
                        disabled={!canScore}
                    />
                    <div className="h-[1px] bg-white/8 my-[1px]" />
                    {POINT_ROWS.map(row => (
                        <ScoreRow
                            key={row.type}
                            side="BLUE"
                            type={row.type}
                            icon={row.icon}
                            label={row.label}
                            value={blueScore[row.type]}
                            onPlus={() => emitScore("BLUE", row.type, "increase")}
                            onMinus={() => emitScore("BLUE", row.type, "decrease")}
                            disabled={!canScore}
                        />
                    ))}
                </div>

                {/* Red side */}
                <div className="flex-1 flex flex-col gap-[4px]">
                    <GjRow
                        side="RED"
                        value={redScore["gj"]}
                        onPlus={() => emitScore("RED", "gj", "increase")}
                        onMinus={() => emitScore("RED", "gj", "decrease")}
                        disabled={!canScore}
                    />
                    <div className="h-[1px] bg-white/8 my-[1px]" />
                    {POINT_ROWS.map(row => (
                        <ScoreRow
                            key={row.type}
                            side="RED"
                            type={row.type}
                            icon={row.icon}
                            label={row.label}
                            value={redScore[row.type]}
                            onPlus={() => emitScore("RED", row.type, "increase")}
                            onMinus={() => emitScore("RED", row.type, "decrease")}
                            disabled={!canScore}
                        />
                    ))}
                </div>
            </div>

            {/* ── BOTTOM TOOLBAR ── */}
            <div className="grid grid-cols-[1fr_1fr_1fr] px-[16px] py-[10px] bg-black/40">
                {/* Tìm kiếm / zoom — placeholder */}
                <button className="flex justify-center items-center active:opacity-60 transition-opacity">
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24"
                        stroke="rgba(255,255,255,0.5)" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>

                {/* Quick Access pill */}
                <button
                    className="flex justify-center items-start active:opacity-60 transition-opacity pt-[2px]"
                    onClick={() => setQuickAccessVisible(true)}
                >
                    <div className="rounded-full w-[50px] h-[5px] bg-white/30" />
                </button>

                {/* Settings */}
                <button
                    className="flex justify-center items-center active:opacity-60 transition-opacity"
                    onClick={() => setSettingVisible(true)}
                >
                    <NutI className="h-[18px] text-white/50" />
                </button>
            </div>
        </div>
    )
}