import { Swiper, SwiperSlide } from "swiper/react"
import { Mousewheel } from "swiper/modules"
import "@/styles/judge.css"
import { getSocket } from "@/scripts/global-client-io"
import React, { useEffect, useState } from "react"

export default function Judge() {
    const [courtId, setCourtId] = useState<string>("1")
    const [id, setId] = useState<string>()
    const [fullScrReq, setFullScrReq] = useState<boolean>(true)
    const [isMobile, setIsMobile] = useState<boolean>()

    useEffect(() => {
        const ua = navigator.userAgent
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua))
    }, [])

    useEffect(() => {
        function handleFullscreenChange() {
            setFullScrReq(!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => { document.removeEventListener('fullscreenchange', handleFullscreenChange) }
    }, [])

    useEffect(() => {
        function handleFullscreenChange() {
            setFullScrReq(!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => { document.removeEventListener('fullscreenchange', handleFullscreenChange) }
    }, [])

    useEffect(() => {
        const socket = getSocket()

        const requestId = () => {
            socket.emit("get-id", (id: string) => {
                console.log(id)
                setId(id)
            })
        }

        if (socket.connected) {
            requestId()
        } else {
            socket.once("connect", requestId)
        }

        return () => {
            socket.off("connect", requestId)
        }
    }, [])

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

        setFullScrReq(false)
    }

    function handleClick(e: React.TouchEvent, blueOrRed: "blue" | "red", score: number) {
        e.preventDefault()
        if (navigator.vibrate) {
            navigator.vibrate(80)
        }
        getSocket().emit("update-score", { blueOrRed, score, courtId: courtId })
    }

    return (
        <div className="root">
            {isMobile && fullScrReq && <div className="req-fullscreen" onClick={() => fullscreenRequest()}>
                Nhấn vào để mở toàn màn hình
            </div>}
            <Swiper
                className="swiper"
                direction="vertical"
                modules={[Mousewheel]}
                mousewheel={{
                    forceToAxis: true,
                    sensitivity: 1, // giảm độ nhạy nếu cuộn quá nhanh
                    releaseOnEdges: false
                }}

                speed={300} // thời gian chuyển slide
                resistanceRatio={0.85} // độ "kháng" khi kéo quá nhanh
                threshold={10} // ngưỡng kéo phải vượt qua mới chuyển slide
                touchStartPreventDefault={false}
                passiveListeners={true}
                slideToClickedSlide={true}
                preventInteractionOnTransition={true} // tránh spam
                preventClicks={false}            // <--- cho phép nhấn
                preventClicksPropagation={false}
            >
                <SwiperSlide>
                    <div className="control">
                        <div className="tracking">
                            {/* <div className="board">
                                <div className="header">Chung kết 58KG Nam</div>
                                <div className="point blue">12</div>
                                <div className="point red">12</div>
                                <div className="stopwatch">2:00</div>
                            </div> */}
                        </div>
                        <div className="btn s1 blue" onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => handleClick(e, "blue", 1)}><span>1</span></div>
                        <div className="btn s1 red" onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => handleClick(e, "red", 1)}><span>1</span></div>
                        <div className="btn s2 blue" onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => handleClick(e, "blue", 2)}>2</div>
                        <div className="btn s2 red" onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => handleClick(e, "red", 2)}>2</div>
                        <div className="btn s3 blue" onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => handleClick(e, "blue", 3)}>3</div>
                        <div className="btn s3 red" onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => handleClick(e, "red", 3)}>3</div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}
