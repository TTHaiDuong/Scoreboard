import "@/styles/split-btn.css"
import FitText from "../components/FitText"
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { ReactNode, useEffect, useState, useRef } from "react"

export default function SplitButton(props: {
    icon?: string | StaticImport,
    alt?: string,
    color?: string,
    children?: ReactNode,
    topOnClick?: () => void,
    bottomOnClick?: () => void,
    background?: string
    styles?: any
}) {
    const ctnRef = useRef<HTMLDivElement>(null)
    const [translY, setTranslY] = useState<number>(0)

    useEffect(() => {
        function updatePosition() {
            const container = ctnRef.current
            if (container) {
                const ctnRect = container.getBoundingClientRect()

                const translate = ctnRect.width / 2
                setTranslY(translate)
            }
        }

        const observer = new ResizeObserver(updatePosition)
        if (ctnRef.current) observer.observe(ctnRef.current)

        return () => { observer.disconnect() }
    }, [])

    return (
        <div
            className="split-btn"
            ref={ctnRef}
            style={props.styles}
        >
            <div onClick={props.topOnClick} style={{ background: props.background }}>
                <FitText
                    fitDirection="vertical"
                    scale={1.2}
                    style={{ color: props.color }}
                >
                    +
                </FitText>
                <div
                    className="icon"
                    style={{ top: translY + "px" }}
                >
                    {props.children
                        ? <FitText
                            fitDirection="vertical"
                            style={{ color: props.color }}
                        >
                            {props.children}
                        </FitText>

                        : <Image
                            src={props.icon!}
                            alt={props.alt || ""}
                        />
                    }
                </div>
            </div>
            <div onClick={props.bottomOnClick} style={{ background: props.background }}>
                <div
                    className="icon"
                    style={{ bottom: translY + "px" }}
                >
                    {props.children
                        ? <FitText
                            fitDirection="vertical"
                            style={{ color: props.color }}
                        >
                            {props.children}
                        </FitText>

                        : <Image
                            src={props.icon!}
                            alt={props.alt || ""}
                        />
                    }
                </div>
                <FitText
                    fitDirection="vertical"
                    scale={1.2}
                    style={{ color: props.color }}
                >
                    -
                </FitText>
            </div>
        </div>
    )
}