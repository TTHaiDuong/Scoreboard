import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import FitText from "../components/FitText"
import { Setter, SetterGetter } from "@/utils/types"
import { findMostFrequent } from "@/utils/find-most-frequent"
import Punch from "./O_Punch"
import Helmet from "./O_Helmet"
import Armor from "./O_Armor"

export type PointLogRef = SetterGetter<"points", ValidPoint[]> & {
    removeUnnecessary(value: Setter<number> | void): void
    getResult(): number
}

type PointLogProps = {
    isBlue?: boolean
    scoringAt: number
    buttonSize?: string
    padding?: string
    iconGap?: string
    gap?: string
    direction?: PointLogDirection
    backgroundColor?: string
    iconScale?: number
}

type ValidPoint = 0 | 1 | 2 | 3 | 4 | 5

type PointLogDirection = "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top"

const PointLog = forwardRef<PointLogRef, PointLogProps>((props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const [result, setResult] = useState<ValidPoint>(0)
    const [points, setPoints] = useState<ValidPoint[]>([])

    useImperativeHandle(ref, () => ({
        setPoints(value) {
            let mostFrequent: [any, number]

            if (value instanceof Function) {
                setPoints(value(points))
                mostFrequent = findMostFrequent(value(points))
            }
            else {
                setPoints(value)
                mostFrequent = findMostFrequent(value)
            }

            if (mostFrequent[1] >= props.scoringAt) setResult(mostFrequent[0])
        },
        getPoints() {
            return points
        },
        removeUnnecessary(value) {
            setPoints(prev => prev.filter(v =>
                v === (value instanceof Function ? value(result) : result)))
        },
        getResult() {
            return result
        }
    }))

    const iconSize = `calc(${props.buttonSize} * ${props.iconScale || 1})`

    return (
        <div
            ref={containerRef}
            className="flex"
            style={{
                flexDirection:
                    props.direction === "left-to-right" || !props.direction ? "row"
                        : props.direction === "right-to-left" ? "row-reverse"
                            : props.direction === "top-to-bottom" ? "column" : "column-reverse",
                justifyContent:
                    props.direction === "left-to-right" || !props.direction ? "flex-start"
                        : props.direction === "right-to-left" ? "flex-end" : "center",
                alignItems:
                    props.direction === "top-to-bottom" ? "flex-start"
                        : props.direction === "bottom-to-top" ? "flex-end" : "center",
                gap: props.iconGap
            }}
        >
            <div
                style={{
                    width: iconSize,
                    height: iconSize,
                    padding: props.padding
                }}
            >
                {result == 1 ? <Punch size="100%" />
                    : result == 2 ? <Armor isBlue={props.isBlue} size="100%" />
                        : result == 3 ? <Helmet isBlue={props.isBlue} size="100%" /> : null}
            </div>
            <div
                className="flex justify-inherit items-inherit"
                style={{
                    gap: props.gap
                }}
            >
                {points.map((p, i) =>
                    <div
                        key={i}
                        style={{
                            width: props.buttonSize,
                            height: props.buttonSize,
                            padding: props.padding
                        }}
                    >
                        {p !== 0 &&
                            <FitText
                                scale={0.8}
                                className="w-full h-full text-white rounded-[10%]"
                                style={{
                                    backgroundColor: props.backgroundColor || "rgba(137, 137, 137, 0.5)",
                                }}
                            >
                                {p}
                            </FitText>}
                    </div>
                )}
            </div>
        </div>
    )
})

export default PointLog