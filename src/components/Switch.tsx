import { useState, useRef, useLayoutEffect } from "react"
import "@/styles/global.css"
import "@/styles/switch.css"

export default function Switch(props: {
    value?: boolean
    onValueChanged?: (value: boolean) => void
}) {
    const [value, setValue] = useState<boolean>(props.value || false)
    const ref = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    function toggle() {
        setValue(prev => {
            const newValue = !prev
            props.onValueChanged?.(newValue)
            return newValue
        })
    }

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new ResizeObserver(() => {
            const { width, height } = el.getBoundingClientRect()
            setOffset(width - height)
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className={`switch pill ${value ? "on" : ""}`}
            onClick={toggle}
        >
            <div
                className="thumb button"
                style={{
                    transform: `translateX(${value ? offset : 0}px)`
                }}
            >
            </div>
        </div>
    )
}