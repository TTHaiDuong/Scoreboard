"use client"

import "@/styles/tracking.css"
import { useState, useEffect } from "react"
import { getSocket } from "@/scripts/global-client-io"
import FitText from "@/components/FitText"
import { formatTime } from "@/components/Timer"
import { whoAdvantage } from "@/scripts/rule"

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

function cal(score: Score, gjRival: number) {
    return score[1] + score[2] * 2 + score[3] * 3 + score[4] * 4 + score[5] * 5 + gjRival
}

export default function Home() {
    const [courtId, setCourtId] = useState<string>("1")
    const [scoreBoard, setScoreBoard] = useState<{ blue: Score, red: Score }>({
        blue: createDefaultCourt(),
        red: createDefaultCourt()
    })
    const [time, setTime] = useState<number>(0)
    const [timerRunning, setTimerRunning] = useState<boolean>()
    const [advantage, setAdvantage] = useState<"blue" | "red" | null>()

    useEffect(() => {
        setAdvantage(whoAdvantage(scoreBoard.blue, scoreBoard.red))
    }, [scoreBoard])

    useEffect(() => {
        const socket = getSocket()
        socket.emit("court:join", courtId)

        return () => {
            socket.emit("court:leave", courtId)
        }
    }, [courtId])

    useEffect(() => {
        const socket = getSocket()

        const handler = (data: {
            courtId: number
            blue: Score
            red: Score
        }) => {
            setScoreBoard({
                blue: data.blue,
                red: data.red
            })
        }

        const handleTimerRunning = (data: {
            isRunning: boolean
        }) => {
            setTimerRunning(data.isRunning)
        }

        socket.on("score:update", handler)
        socket.on("timer:setRunning", handleTimerRunning)

        return () => {
            socket.off("score:update", handler)
            socket.off("timer:setRunning", handleTimerRunning)
        }
    }, [])

    useEffect(() => {
        const socket = getSocket()

        function handleUpdate(data: { remaining: number }) {
            setTime(data.remaining)
            if (data.remaining === 0) setTimerRunning(false)
        }

        socket.on("timer:update", handleUpdate)

        return () => {
            socket.off("timer:update", handleUpdate)
        }
    }, [courtId])

    return (
        <div className="root">
            <div className="header">
                Beta version
            </div>
            <div className="body">
                <div className="athlete blue">CHONG</div>
                <div className="athlete red">HONG</div>
                <div className="team blue"></div>
                <div className="team red"></div>
                <div className="side blue"></div>
                <div className="side red"></div>
                <FitText style={{ color: advantage === "blue" ? "gold" : "white" }} scale={0.9} className="point blue">{cal(scoreBoard["blue"], scoreBoard["red"]["gj"])}</FitText>
                <FitText style={{ color: advantage === "red" ? "gold" : "white" }} scale={0.9} className="point red">{cal(scoreBoard["red"], scoreBoard["blue"]["gj"])}</FitText>
                <div className="gamjeom blue label-number score">
                    <span>GAM-JEOM</span>
                    <span>{scoreBoard["blue"].gj}</span>
                </div>
                <div className="won blue label-number score">
                    {/* <span>WON</span>
                    <span>_</span> */}
                </div>
                <div className="won red label-number score">
                    {/* <span>WON</span>
                    <span>_</span> */}
                </div>
                <div className="gamjeom red label-number score">
                    <span>GAM-JEOM</span>
                    <span>{scoreBoard["red"].gj}</span>
                </div>
                <div className="middle top">
                    {/* <div className="label-number">
                        <span>MATCH</span>
                        <span>_</span>
                    </div> */}
                    <div className="stopwatch">
                        <FitText
                            scale={0.9}
                            style={{
                                borderColor: timerRunning ? "gold" : "white"
                            }}
                        >
                            {formatTime(time)}
                        </FitText>
                        {!timerRunning &&
                            <FitText
                                scale={0.8}
                                className="stop"
                            >
                                {time === 0 ? "TIMEOUT" : "STOP"}
                            </FitText>}
                    </div>
                    {/* <div className="label-number round">
                        <span>ROUND</span>
                        <span>_</span>
                    </div> */}
                </div>
                <div className="middle bottom">

                </div>
            </div>
        </div>
    )
}
