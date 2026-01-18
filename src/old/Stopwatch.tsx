import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react"
import { formatTime } from "@/utils/time-format"
import { StyleProps, SetterGetter } from "@/utils/types"
import FitText from "../components/FitText"

export type StopwatchRef = SetterGetter<"time", number> & {
    resume: () => void
    pause: () => void
    reset: () => void
    getIsRunning: () => boolean
}

type StopwatchProps = StyleProps & {
    onTimeOut?: () => void
    initTime: number
    contentScale?: number
    borderScale?: number
}

// Đồng hồ đếm ngược
const Stopwatch = forwardRef<StopwatchRef, StopwatchProps>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [borderWidth, setBorderWidth] = useState<number>()

    const [time, setTime] = useState<number>(props.initTime)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const prevIsRunningState = useRef<boolean>(false)
    const lastTimeRef = useRef<number>(0)

    useImperativeHandle(ref, () => ({
        resume() {
            lastTimeRef.current = Date.now()
            setIsRunning(true)
        },
        pause() {
            setIsRunning(false)
        },
        reset() {
            setIsRunning(false)
            setTime(props.initTime)
        },
        setTime(value) {
            if (value instanceof Function) setTime(value(time))
            else setTime(value)
        },
        getTime() {
            return time
        },
        getIsRunning() {
            return isRunning
        }
    }))

    useEffect(() => {
        let interval: NodeJS.Timeout
        let currentTime: number = time

        if (isRunning && currentTime > 0) {

            interval = setInterval(() => {
                const now = Date.now()
                currentTime = Math.max(currentTime - (now - lastTimeRef.current), 0)
                lastTimeRef.current = now

                if (currentTime <= 10000 || currentTime > 10000 && currentTime % 1000 <= 10)
                    setTime(currentTime)

                if (currentTime <= 0) {
                    setIsRunning(false)
                    props.onTimeOut?.()
                }
            }, 10)
        }

        return () => { clearInterval(interval) }
    }, [isRunning, props.onTimeOut])

    useEffect(() => {
        function handleVisibilityChange() {
            if (prevIsRunningState.current || document.hidden) setIsRunning(!document.hidden)
            prevIsRunningState.current = isRunning
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => { document.removeEventListener("visibilitychange", handleVisibilityChange) }
    }, [isRunning])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const observer = new ResizeObserver(() => {
            const width = container.clientWidth
            setBorderWidth(width * ((props.borderScale || 0.1)) * 0.25)
        })
        observer.observe(container)

        return () => { observer.disconnect() }
    }, [])

    return (
        <FitText
            ref={containerRef}
            className={"text-white active:scale-90 select-none border border-yellow-500 " + props.className}
            style={{
                borderWidth: `${borderWidth}px`,
                ...props.style
            }}
            scale={props.contentScale}
        >
            {time > 10000 ? formatTime(time, "M:SS") : formatTime(time, "S.cc")}
        </FitText>
    )
})

export default Stopwatch