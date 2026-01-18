import { forwardRef, useImperativeHandle, useState } from "react"
import PlusMinusButton from "./O_PlusMinusButton"
import type { StyleProps, Setter, SetterGetter } from "@/utils/types"

export type GamJeomHandle = SetterGetter<"point", number>

type GamJeomProps = StyleProps & {
    onPointChange?(prePoint: number, newPoint: number): void
    pointFontSize?: number
}

const GamJeom = forwardRef<GamJeomHandle, GamJeomProps>(({ className, pointFontSize = 8, onPointChange }, ref) => {
    // Không sử dụng trực tiếp phương thức setPoint mà sử dụng phương thức setPointAndInvoke
    const [point, setPoint] = useState<number>(0)
    const [isHover, setIsHover] = useState<boolean>(false)

    useImperativeHandle(ref, () => ({
        getPoint() { return point },
        setPoint(value: number | Setter<number>) {
            setPoint(pre => value instanceof Function ? value(pre) : value)
        }
    }))

    function setPointAndInvoke(setter: ((pre: number) => number) | number) {
        setPoint(pre => {
            const newPoint = setter instanceof Function ? setter(pre) : setter
            onPointChange?.(point, newPoint)
            return newPoint
        })
    }

    function handleMouseEnter() {
        setIsHover(true)
    }

    function handleMouseLeave() {
        setIsHover(false)
    }

    function handlePlusMouseDown() {
        setPointAndInvoke(pre => pre + 1)
    }

    function handleMinusMouseDown(e: React.MouseEvent<SVGSVGElement>) {
        if (e.ctrlKey) setPointAndInvoke(0)
        else setPointAndInvoke(pre => Math.max(pre - 1, 0))
    }

    return (
        <div className={`absolute flex justify-center items-center ${className}`}>
            <div
                className={`font-bold select-none`}
                style={{ fontSize: pointFontSize * 5 / 16 + "vmin" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                GAM-JEOM
            </div>
            <div
                className={`absolute w-[5ch] font-bold select-none top-[100%] flex justify-center items-center`}
                style={{ fontSize: pointFontSize + "vmin" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {point}
                {isHover &&
                    <PlusMinusButton
                        isPlus
                        className="h-[50%] top-[25%] left-[0]"
                        onMouseDown={handlePlusMouseDown}
                    />}
                {isHover &&
                    <PlusMinusButton
                        className="h-[50%] top-[25%] right-[0]"
                        onMouseDown={handleMinusMouseDown}
                    />}
            </div>
        </div>
    )
})

export default GamJeom