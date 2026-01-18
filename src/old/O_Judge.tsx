import { forwardRef, useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import FitText from "../components/FitText"
import "@/styles/judgeO.css"
import Image from "next/image"
import blueArmor from "@/assets/blue-armor.png"
import blueHelmet from "@/assets/blue-helmet.png"
import bluePunch from "@/assets/blue-punch.png"
import redArmor from "@/assets/red-armor.png"
import redHelmet from "@/assets/red-helmet.png"
import redPunch from "@/assets/red-punch.png"
import flag from "@/assets/flag-of-vietnam.png"
import { StaticImport } from "next/dist/shared/lib/get-img-props"

export const SubScoring = forwardRef<HTMLElement, {}>((props, ref) => {
    const [visible, setVisible] = useState<boolean>(true)
    const [pointH, setPointH] = useState<number>(0)

    useEffect(() => {
        function handleFullscreenChange() {
            return
            if (!document.fullscreenElement)
                setVisible(true)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => { document.removeEventListener('fullscreenchange', handleFullscreenChange) }
    }, [])

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        if (navigator.vibrate) {
            navigator.vibrate(50) // Rung
        }
    }

    function pointHUpdate(height: number) {
        setPointH(height)
    }

    const fullscreenRequest = async () => {
        const el = document.documentElement

        if (el.requestFullscreen) {
            await el.requestFullscreen()
        } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen()
        } else {
            alert("API toàn màn hình không được hỗ trợ trên trình duyệt này.")
        }

        if ('orientation' in screen && 'lock' in screen.orientation) {
            try {
                await (screen.orientation as any).lock("landscape")
            }
            catch (err) {
                console.warn("Không thể khóa xoay màn hình:", err)
                // alert("Không thể khóa xoay màn hình.")
            }
        } else {
            alert("Thiết bị hoặc trình duyệt không hỗ trợ Orientation Lock API.")
        }

        setVisible(false)
    }

    return (
        <>
            {visible
                ? <FitText
                    scale={0.7}
                    className="fullscreen-req"
                    onClick={fullscreenRequest}
                >
                    Nhấn để mở toàn màn hình
                </FitText>

                : <Swiper
                    id="main-container"
                    direction="vertical"
                    loop={true}

                    mousewheel={{
                        forceToAxis: true,
                        sensitivity: 1, // giảm độ nhạy nếu cuộn quá nhanh
                        releaseOnEdges: false
                    }}

                    speed={300} // thời gian chuyển slide
                    resistanceRatio={0.85} // độ "kháng" khi kéo quá nhanh
                    threshold={10} // ngưỡng kéo phải vượt qua mới chuyển slide

                    slideToClickedSlide={true}
                    preventInteractionOnTransition={true} // tránh spam
                >
                    <SwiperSlide>
                        <div className="detail-result">
                            <div>
                                <PointHDiv icon={blueHelmet} alt="Blue Helmet" point={2} fontSize={pointH} />
                                <PointHDiv icon={blueArmor} alt="Blue Armor" point={2} fontSize={pointH} />
                                <PointHDiv icon={bluePunch} alt="Blue Punch" point={2} fontSize={pointH} />
                                <PointVDiv icon={blueHelmet} alt="Blue Helmet" point={2} title={<>Turning<br />Kick</>} onPointHeightChange={pointHUpdate} />
                                <PointVDiv icon={blueArmor} alt="Blue Armor" point={2} title={<>Turning<br />Kick</>} />
                                <PointVDiv point={2} title={<>Gam<br />Jeom</>} />
                                <FitText scale={0.7} className="total-point blue">3</FitText>
                            </div>

                            {/* Hàng giữa */}
                            <div>
                                <div className="match-info">
                                    <FitText
                                        scale={0.6}
                                        fitDirection="vertical"
                                        className="h-full"
                                    >
                                        QF M-68kg
                                    </FitText>
                                    <div className="bg-[#355050] rounded-lg">
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.4}
                                            className="bg-[#0000ff] team-name text-white"
                                        >CDUO</FitText>
                                        <Image className="object-contain w-fit h-[80%] rounded-sm" src={flag} alt="Flag" />
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.5}
                                            className="w-1/2 h-[80%] text-white font-bold"
                                        >
                                            N. Khắc Duy
                                        </FitText>
                                    </div>
                                    <div className="bg-[#355050] rounded-lg">
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.4}
                                            className="bg-[#ff0000] team-name text-white"
                                        >CDUO</FitText>
                                        <Image className="object-contain w-fit h-[80%] rounded-sm" src={flag} alt="Flag" />
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.5}
                                            className="w-1/2 h-[80%] text-white font-bold"
                                        >
                                            D. Hoàng Nam
                                        </FitText>
                                    </div>
                                </div>
                                <FitText
                                    fitDirection="vertical"
                                    className="text-white round"
                                >
                                    Round {2} Result
                                </FitText>
                                <div className="rounds-result">
                                    <div className="each-round-row">
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.7}
                                            className="each-round two-ends-each-round"
                                            style={{ background: "#0000ff" }}
                                        >2</FitText>
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.7}
                                            className="each-round two-ends-each-round"
                                            style={{ background: undefined }}
                                        >8</FitText>
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.7}
                                            className="each-round two-ends-each-round"
                                            style={{ background: "#0000ff" }}
                                        >12</FitText>
                                    </div>
                                    <div className="each-round-row">
                                        <FitText fitDirection="vertical" scale={0.7} className="each-round">R1</FitText>
                                        <FitText fitDirection="vertical" scale={0.7} className="each-round" style={{ border: "2px solid yellow" }}>2</FitText>
                                        <FitText fitDirection="vertical" scale={0.7} className="each-round">3</FitText>
                                    </div>
                                    <div className="each-round-row">
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.7}
                                            className="each-round two-ends-each-round"
                                            style={{ background: undefined }}
                                        >0</FitText>
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.7}
                                            className="each-round two-ends-each-round"
                                            style={{ background: "#ff0000" }}
                                        >12</FitText>
                                        <FitText
                                            fitDirection="vertical"
                                            scale={0.7}
                                            className="each-round two-ends-each-round"
                                            style={{ background: undefined }}
                                        >2</FitText>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <PointHDiv icon={redHelmet} alt="Red Helmet" point={2} fontSize={pointH} />
                                <PointHDiv icon={redArmor} alt="Red Armor" point={2} fontSize={pointH} />
                                <PointHDiv icon={redPunch} alt="Red Punch" point={2} fontSize={pointH} />
                                <PointVDiv icon={redHelmet} alt="Red Helmet" point={2} title={<>Turning<br />Kick</>} />
                                <PointVDiv icon={redArmor} alt="Red Armor" point={2} title={<>Turning<br />Kick</>} />
                                <PointVDiv point={2} title={<>Gam<br />Jeom</>} />
                                <FitText scale={0.7} className="total-point red">3</FitText>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="business-container">
                            <div className="tracking">
                                <FitText
                                    scale={0.7}
                                    fitDirection="vertical"
                                    className="title"
                                >
                                    U17 - Nam - 68kg
                                </FitText>
                                <div className="flex justify-between items-start w-full h-[50%]">
                                    <FitText
                                        scale={0.7}
                                        className="red rounded-lg w-[25%] h-full"
                                        style={{ color: "yellow" }}
                                    >3</FitText>
                                    <FitText
                                        scale={0.7}
                                        className="text-black bg-yellow-100 w-[40%] h-full"
                                    >
                                        2:00
                                    </FitText>
                                    <FitText
                                        scale={0.7}
                                        className="blue rounded-lg w-[25%] h-full"
                                        style={{ color: "white" }}
                                    >2</FitText>
                                </div>
                                <FitText
                                    scale={0.7}
                                    className="text-white bg-red-500 rounded-lg w-full h-[20%]"
                                    style={{ visibility: "hidden" }}
                                    virtualText="Taekwondo"
                                >
                                    TIME OUT
                                </FitText>
                            </div>

                            <div className="flex flex-col justify-between gap-3">
                                <FitText
                                    scale={0.5}
                                    className="bg-red-300 text-white active:scale-90 active:bg-gray-400 flex-1"
                                    onClick={handleClick}
                                >1</FitText>
                                <FitText
                                    scale={0.5}
                                    className="bg-red-500 text-black font-bold active:scale-90 active:bg-gray-400 h-[60%]"
                                    onClick={handleClick}
                                >2</FitText>
                            </div>
                            <FitText
                                scale={0.5}
                                className="self-end bg-red-800 text-white active:scale-90 active:bg-gray-400 h-[55%]"
                                onClick={handleClick}
                            >3</FitText>
                            <FitText
                                scale={0.5}
                                className="self-end bg-blue-800 text-white active:scale-90 active:bg-gray-400 h-[55%]"
                                onClick={handleClick}
                            >3</FitText>
                            <div className="flex flex-col justify-between gap-3">
                                <FitText
                                    scale={0.5}
                                    className="bg-blue-300 text-white active:scale-90 active:bg-gray-400 flex-1"
                                    onClick={handleClick}
                                >1</FitText>
                                <FitText
                                    scale={0.5}
                                    className="bg-blue-500 text-black font-bold active:scale-90 active:bg-gray-400 h-[60%]"
                                    onClick={handleClick}
                                >2</FitText>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="match-result">
                            <div className="head">
                                <FitText
                                    fitDirection="vertical"
                                    className="title"
                                >
                                    Match { } Result
                                </FitText>
                                <FitText
                                    fitDirection="vertical"
                                    className="subtitle"
                                >
                                    QF M-68kg
                                </FitText>
                            </div>
                            <div className="content">
                                <div className="h-[20%]">
                                    <FitText
                                        scale={0.4}
                                        fitDirection="vertical"
                                        className="winner"
                                    >
                                        WINNER
                                    </FitText>
                                    <FitText
                                        scale={0.8}
                                        fitDirection="vertical"
                                        className="blue"
                                    >
                                        2
                                    </FitText>
                                    <FitText
                                        scale={0.8}
                                        fitDirection="vertical"
                                        className="red"
                                    >
                                        1
                                    </FitText>
                                </div>
                                <div>
                                    <Image
                                        className="flag"
                                        src={flag}
                                        alt="Flag" />
                                    <FitText
                                        scale={0.4}
                                        fitDirection="vertical"
                                        className="athlete red"
                                    >
                                        N. Khắc Duy - CDUOC
                                    </FitText>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>}
        </>
    )
})

const PointHDiv = (props: {
    icon: string | StaticImport,
    alt: string,
    point: number,
    fontSize: number
}) => {
    return (
        <div className="h-point">
            <Image
                className="object-contain w-fit h-full"
                src={props.icon}
                alt={props.alt} />
            <FitText
                fitDirection="vertical"
                className="text-white"
                style={{ height: props.fontSize }}
            >
                {props.point}
            </FitText>
        </div>
    )
}

const PointVDiv = (props: {
    title: any,
    point: number,
    icon?: string | StaticImport,
    alt?: string,
    onPointHeightChange?: (height: number) => void
}) => {
    const pointRef = useRef<HTMLDivElement>(null)
    const pointHRef = useRef<number>(0)

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newHeight = entry.contentRect.height
                if (Math.abs(pointHRef.current - newHeight) > 1) {
                    props.onPointHeightChange?.(newHeight)
                    pointHRef.current = newHeight
                }
            }
        })

        if (pointRef.current) {
            observer.observe(pointRef.current)
        }

        return () => { observer.disconnect() }
    }, [])

    return (
        <div className="v-point">
            <FitText
                scale={0.7}
                fitDirection="vertical"
                className="two-ends text-white text-center leading-none"
            >
                {props.title}
            </FitText>
            <FitText
                ref={pointRef}
                fitDirection="vertical"
                className="middle text-white"
            >
                {props.point}
            </FitText>
            {props.icon
                ? <Image
                    className="two-ends object-contain h-full"
                    src={props.icon}
                    alt={props.alt || ""} />
                : <div className="two-ends" />}
        </div>
    )
}