import React, { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { StyleProps, SetterGetter } from "@/utils/types"
import FitText from "../components/FitText"
import { PointLogListRef } from "./PointLogList"

export type PointRef = SetterGetter<"point", number> & {
    setSuperiority(value: boolean): void
}

type PointProps = StyleProps & {
    isBlue?: boolean
    pointLogListRef?: PointLogListRef
}

const Point = forwardRef<PointRef, PointProps>((props, ref) => {
    const [point, setPoint] = useState<number>(0)
    const [superiority, setSuperiority] = useState<boolean>(false)
    const pointLogListRef = useRef<PointLogListRef>(props.pointLogListRef)
    const gamJeomRef = useRef(null)

    useImperativeHandle(ref, () => ({
        setPoint(value) {
            if (value instanceof Function) setPoint(value(point))
            else setPoint(value)
        },
        getPoint() {
            return point
        },
        setSuperiority(value) {
            setSuperiority(value)
        }
    }))

    return (
        <FitText
            scale={0.9}
            className={props.className}
            style={{
                backgroundColor: props.isBlue ? "#0000ff" : "#ff0000",
                color: superiority ? "yellow" : "white",
                ...props.style
            }}
        >
            {point}
        </FitText>
    )
})

export default Point
