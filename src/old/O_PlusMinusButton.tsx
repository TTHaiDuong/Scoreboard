import type { StyleProps, ComponentEvents } from "@/utils/types"
import React, { useRef } from "react"

type PlusMinusButton = StyleProps & ComponentEvents<SVGSVGElement> & {
    onMouseHold?(e: React.MouseEvent<SVGSVGElement> | undefined): void
    onMouseHoldInterval?: number
    isPlus?: boolean
}

const PlusMinusButton = (props: PlusMinusButton) => {
    const timeoutRef = useRef<NodeJS.Timeout>(null)
    const intervalRef = useRef<NodeJS.Timeout>(null)

    function handleMouseDown(e: React.MouseEvent<SVGSVGElement>) {
        props.onMouseDown?.(e)

        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                props.onMouseHold?.(e)
            }, props.onMouseHoldInterval)
        }, 1000)
    }

    function handleMouseUpLeave(e: React.MouseEvent<SVGSVGElement>) {
        props.onMouseUp?.(e)

        clearInterval(intervalRef.current || undefined)
        clearTimeout(timeoutRef.current || undefined)
    }

    return (
        <svg
            className={`active:scale-90 ${props.className}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            onClick={props.onClick}
            onMouseUp={handleMouseUpLeave}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUpLeave}
        >
            <rect width="100" height="100" rx="15" ry="15" fill="#FFFFFF" />
            <rect x="15" y="42.5" width="70" height="15" rx="5" ry="5" fill="#D1D5DB" />
            {props.isPlus && <rect x="42.5" y="15" width="15" height="70" rx="5" ry="5" fill="#D1D5DB" />}
        </svg>
    )
}

export default PlusMinusButton