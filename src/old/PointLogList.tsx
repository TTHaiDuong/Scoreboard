import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import SlideBar, { SliderBarRef } from "./SlideBar"
import PointLog, { PointLogRef } from "./O_PointLog"
import { PointRef } from "./O_Point"

export type PointLogListRef = {

}

type PointLogListProps = {
    isBlue?: boolean
    maxSize?: string
    direction?: "left-to-right" | "right-to-left"
    totalPointRef?: PointRef
    buttonSize?: string
    buttonGap?: string
    buttonPadding?: string
    iconGap?: string
    iconScale?: number
    gap?: string
}

const PointLogList = forwardRef<PointLogListRef, PointLogListProps>((props, ref) => {
    const slideBarRef = useRef<SliderBarRef>(null)
    const pointLogRefs = useRef<Array<PointLogRef | null>>([])

    useImperativeHandle(ref, () => ({

    }))

    useEffect(() => {
        const slideBar = slideBarRef.current?.getContainerRef()
        if (!slideBar) return
        slideBar.scrollTop = slideBar.scrollHeight - slideBar.clientHeight
    }, [])

    useEffect(() => {
        pointLogRefs.current.forEach(e => e?.setPoints([1, 1, 2]))
    }, [])

    return (
        <SlideBar
            ref={slideBarRef}
            gap={props.gap}
            maxSize={props.maxSize || "100%"}
            reverse
        >
            {Array.from({ length: 6 }, (_, i) =>
                <PointLog
                    ref={e => { pointLogRefs.current[i] = e }}
                    iconGap={props.iconGap}
                    iconScale={props.iconScale || 1.2}
                    isBlue={props.isBlue}
                    buttonSize={props.buttonSize}
                    gap={props.buttonGap}
                    padding={props.buttonPadding}
                    direction={props.direction || "left-to-right"}
                    scoringAt={2}
                    key={i}
                />
            )}
        </SlideBar>
    )
})

export default PointLogList