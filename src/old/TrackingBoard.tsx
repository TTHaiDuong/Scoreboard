"use client"

import { useEffect, useRef, useState } from "react"
import Point, { PointRef } from "./O_Point"
import Stopwatch, { StopwatchRef } from "./Stopwatch"
import Name from "./O_Name"
import PointLog, { PointLogRef } from "./O_PointLog"
import PointLogList from "./PointLogList"
import TextLabel from "./TextLabel"
import FitText from "../components/FitText"
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import VietNamFlag from "../assets/flag-of-vietnam.png"

export default function TrackingBoard() {
    const stopwatchRef = useRef<StopwatchRef>(null)
    const [redFlag, setRedFlag] = useState<string | StaticImport>()
    const [blueFlag, setBlueFlag] = useState<string | StaticImport>(VietNamFlag)
    const redPointRef = useRef<PointRef>(null)
    const bluePointRef = useRef<PointRef>(null)
    const pointLogRef = useRef<PointLogRef>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [minSize, setMinSize] = useState<number>(0)
    const [pointListSize, setPointListSize] = useState<number>(0)

    useEffect(() => {
        redPointRef.current?.setPoint(25)

        setTimeout(() => pointLogRef?.current?.removeUnnecessary(), 1000)
    }, [])

    const onStart = () => {
        stopwatchRef.current?.resume()
    }

    const onPause = () => {
        stopwatchRef.current?.pause()
    }

    const onReset = () => {
        stopwatchRef?.current?.reset()
    }

    const onTimeOut = () => {
        new Notification("Ứng dụng đang cần bạn!", {
            body: "Nhấp vào đây để quay lại ứng dụng.",
            requireInteraction: true,
        })
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new ResizeObserver(() => {
            const width = container.clientWidth
            const height = container.clientHeight
            const min = Math.min(width, height)
            setMinSize(min)
        })
        observer.observe(container)

        return () => { observer.disconnect() }
    }, [containerRef.current])

    return (
        <div ref={containerRef} className="relative flex w-screen h-screen overflow-hidden">
            <div className="w-1/2 h-full bg-[#cc0000]" />
            <div className="w-1/2 h-full bg-[#1155cc]" />

            {/* <div className="absolute z-10">
                <div onClick={onStart} className="text-[30px]">Start</div>
                <div onClick={onPause} className="text-[30px]">Pause</div>
                <div onClick={onReset} className="text-[30px]">Reset</div>
            </div> */}

            <div className="absolute w-full h-full">
                {/* Dải đen trên cùng, thông tin trận */}
                <FitText
                    scale={0.3}
                    virtualText={"A".repeat(16)}
                    className="w-full h-[8%] font-bold text-white bg-black"
                >
                    SÂN 1 - CHUNG KẾT - 68KG-NAM
                </FitText>

                <div className="flex w-full h-[92%]">

                    {/* Container đỏ */}
                    <div className="w-[42%] h-full">
                        <div className="flex w-full h-[82%]">
                            <div className="flex flex-col justify-between w-[24%] h-full">
                                <div
                                    className="flex-center flex-col gap-[10%] w-full"
                                    style={{ height: redFlag ? "27%" : "17%", }}
                                >
                                    {redFlag && <Image
                                        src={redFlag}
                                        alt="Red Flag"
                                        className="object-contain aspect-[1/1]"
                                        style={{ height: `${minSize * 0.016}vmin` }}
                                    />}
                                    <FitText
                                        scale={redFlag ? 0.8 : 1.15}
                                        virtualText={"A".repeat(3)}
                                        className="w-full font-bold text-white"
                                        style={{ height: `${minSize * 0.06}px` }}
                                    >
                                        CDU
                                    </FitText>
                                </div>
                                <div className="flex-center w-full h-[73%] select-none">
                                    <PointLogList
                                        buttonSize={`${minSize * 0.025}px`}
                                        buttonGap={`${minSize * 0.005}px`}
                                        iconGap={`${minSize * 0.01}px`}
                                        gap={`${minSize * 0.02}px`}
                                        maxSize="80%"
                                        direction="right-to-left"
                                        isBlue
                                    />
                                </div>
                            </div>

                            {/* Thành phần điểm */}
                            <div className="flex-center flex-col w-[76%] h-full">
                                <div className="flex-center w-full h-[17%]">
                                    <FitText
                                        useEllipses
                                        virtualText={"A".repeat(10)}
                                        scale={0.8}
                                        className="w-[90%] h-[36%] text-white font-bold"
                                    >
                                        TRẦN HẢI DƯƠNG GGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                                    </FitText>
                                </div>
                                <Point
                                    ref={redPointRef}
                                    className="w-full h-[83%] select-none"
                                />
                            </div>
                        </div>

                        {/* Gam-jeom, won */}
                        <div className="flex justify-between items-center w-full h-[18%] overflow-hidden">
                            <TextLabel
                                className="w-[30%] h-[75%] select-none"
                                title="GAM-JEOM"
                                titleClassName="w-full h-[22%] text-white font-bold"
                                content={0}
                                contentClassName="w-full h-[70%] text-white font-bold"
                            />
                            <TextLabel
                                className="w-[30%] h-[75%] select-none"
                                title="WON"
                                titleVirtualText="GAM-JEOM"
                                titleClassName="w-full h-[22%] text-white font-bold"
                                content={0}
                                contentClassName="w-full h-[70%] text-white font-bold"
                            />
                        </div>
                    </div>

                    {/* Dải đen giữa, match, time, round */}
                    <div className="flex justify-center items-end w-[16%] h-full">
                        <div className="flex flex-col justify-around items-center w-full h-[86%] bg-black">
                            <TextLabel
                                className="w-[80%] h-[12%] select-none"
                                title="MATCH"
                                titleClassName="text-white font-bold w-full h-[35%]"
                                content={123}
                                contentClassName="text-white font-bold w-full h-[55%]"
                            />
                            <Stopwatch
                                ref={stopwatchRef}
                                initTime={15 * 1000}
                                contentScale={0.9}
                                className="w-full h-[25%]"
                            />
                            <TextLabel
                                className="w-[80%] h-[20%] select-none"
                                title="ROUND"
                                titleClassName="text-white font-bold w-full h-[20%]"
                                content={2}
                                contentClassName="text-white font-bold w-full h-[75%]"
                            />
                        </div>
                    </div>

                    {/* Container xanh */}
                    <div className="w-[42%] h-full">
                        <div className="flex w-full h-[82%]">
                            {/* Thành phần điểm */}
                            <div className="flex-center flex-col w-[76%] h-full">
                                <div className="flex-center w-full h-[17%]">
                                    <FitText
                                        useEllipses
                                        virtualText={"A".repeat(10)}
                                        scale={0.8}
                                        className="w-[90%] h-[36%] text-white font-bold"
                                    >
                                        TRẦN HẢI DƯƠNG
                                    </FitText>
                                </div>
                                <Point
                                    isBlue
                                    className="w-full h-[83%] select-none"
                                />
                            </div>

                            <div className="flex-center flex-col w-[24%] h-full">
                                <div
                                    className="flex-center flex-col gap-[10%] w-full"
                                    style={{ height: blueFlag ? "27%" : "17%" }}
                                >
                                    {blueFlag && <Image
                                        src={blueFlag}
                                        alt="Blue Flag"
                                        className="object-contain aspect-[1/1]"
                                        style={{ height: `${minSize * 0.016}vmin` }}
                                    />}
                                    <FitText
                                        scale={blueFlag ? 0.8 : 1.2}
                                        virtualText={"A".repeat(3)}
                                        className="w-full font-bold text-white"
                                        style={{ height: `${minSize * 0.06}px` }}
                                    >
                                        VIE
                                    </FitText>
                                </div>
                                <div className="flex-center w-full h-[73%] select-none">
                                    <PointLogList
                                        buttonSize={`${minSize * 0.025}px`}
                                        buttonGap={`${minSize * 0.005}px`}
                                        iconGap={`${minSize * 0.01}px`}
                                        gap={`${minSize * 0.02}px`}
                                        maxSize="80%"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gam-jeom, won */}
                        <div className="flex justify-between items-center w-full h-[18%] overflow-hidden">
                            <TextLabel
                                className="w-[30%] h-[75%] select-none"
                                title="WON"
                                titleVirtualText="GAM-JEOM"
                                titleClassName="w-full h-[22%] text-white font-bold"
                                content={0}
                                contentClassName="w-full h-[70%] text-white font-bold"
                            />
                            <TextLabel
                                className="w-[30%] h-[75%] select-none"
                                title="GAM-JEOM"
                                titleClassName="w-full h-[22%] text-white font-bold"
                                content={0}
                                contentClassName="w-full h-[70%] text-white font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}