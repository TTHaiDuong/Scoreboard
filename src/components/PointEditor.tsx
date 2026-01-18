import "@/styles/point-editor.css"
import "@/styles/switch.css"
import Plus from "@/assets/plus.svg"
import Minus from "@/assets/minus.svg"
import { ReactNode } from "react"

export default function PointEditor(props: {
    icon?: any
    iconColor?: string
    backgroundColor?: string
    children?: ReactNode
    direction?: "row" | "row-reverse" | "column" | "column-reverse"
    onPlusClick?: () => void
    onMinusClick?: () => void
    className?: string
}) {
    return (
        <div
            className={"point-editor pill " + props.className}
            style={{
                backgroundColor: props.backgroundColor,
                flexDirection: props.direction
            }}
        >
            <div className="thumb button center drop-shadow">
                <div
                    className="point-editor_main-icon center point-editor_icon-container drop-shadow"
                    style={{ color: props.iconColor }}
                >
                    {typeof props.icon === "function" ? <props.icon className="icon drop-shadow" /> : props.icon}
                </div>
            </div>
            <div
                className="point-editor_body"
                style={{ flexDirection: props.direction }}
            >
                <div
                    className="button center drop-shadow active"
                    onClick={props.onPlusClick}
                >
                    <div className="point-editor_icon-container">
                        <Plus className="icon icon_default" />
                    </div>
                </div>
                <div>{props.children}</div>
                <div
                    className="button center drop-shadow active"
                    onClick={props.onMinusClick}
                >
                    <div className="point-editor_icon-container">
                        <Minus className="icon icon_default" />
                    </div>
                </div>
            </div>
        </div>
    )
}