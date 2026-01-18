import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"

export type SliderBarRef = {
    getContainerRef(): HTMLDivElement | null
    add(value: ReactNode): void
    remove(value: ReactNode): void
}

type SlideBarProps = {
    backgroundColor?: string
    maxSize: string
    gap?: string
    reverse?: boolean
    children?: ReactNode[] | ReactNode
    dragSensitivity?: number
}

const SlideBar = forwardRef<SliderBarRef, SlideBarProps>((props, ref) => {
    const [elements, setElements] = useState<ReactNode[]>(Array.isArray(props.children) ? props.children : [props.children])

    const containerRef = useRef<HTMLDivElement>(null)
    const firstElementRef = useRef<HTMLDivElement>(null)
    const lastElementRef = useRef<HTMLDivElement>(null)

    const [isHover, setIsHover] = useState<boolean>()
    const [isDragging, setIsDragging] = useState<boolean>()
    const startCursor = useRef<number>(0)
    const startScroll = useRef<number>(0)

    useImperativeHandle(ref, () => ({
        getContainerRef() {
            return containerRef.current
        },
        add(value: ReactNode) {
            setElements(prev => [...prev, value])
        },
        remove(value: ReactNode) {
            setElements(prev => prev.filter((e) => e !== value))
        }
    }))

    useEffect(() => {
        setElements(Array.isArray(props.children) ? props.children : [props.children])
    }, [props.children])

    function handleMouseEnter() {
        setIsHover(true)
    }

    function handleMouseLeave() {
        setIsHover(false)
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        const container = containerRef.current
        if (!container) return

        e.preventDefault()
        setIsDragging(true)

        startCursor.current = props.reverse ? e.clientY : e.clientX
        startScroll.current = props.reverse ? container.scrollTop : container.scrollLeft
    }

    function handleMouseUp() {
        setIsDragging(false)
    }

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            const container = containerRef.current
            if (!container || !isDragging) return

            e.preventDefault()

            const delta = (props.reverse ? e.clientY : e.clientX) - startCursor.current
            const walk = delta * (props.dragSensitivity || 1.5)

            container[props.reverse ? "scrollTop" : "scrollLeft"] = startScroll.current - walk
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, props.dragSensitivity, props.reverse])

    return (
        <div
            ref={containerRef}
            className="flex"
            style={{
                [props.reverse ? "height" : "width"]: props.maxSize,
                [!props.reverse ? "height" : "width"]: "fit-content",
                overflow: !isHover ? "hidden" : "auto",
                flexDirection: props.reverse ? "column" : undefined,
                cursor: isDragging ? "grabbing" : "grab",
                backgroundColor: props.backgroundColor,
                gap: props.gap
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
        >
            {elements.map((e, i) =>
                <div
                    key={i}
                    ref={i === 0 ? firstElementRef : i === elements.length - 1 ? lastElementRef : undefined}
                    className="w-fit h-fit"
                >
                    {e}
                </div>
            )}
        </div>
    )
})

export default SlideBar