import { StyleProps, SetterGetter } from "@/utils/types"
import { forwardRef, useImperativeHandle, useState } from "react"
import FitText, { FitTextDirection } from "../components/FitText"

export type TextLabelRef = SetterGetter<"content", string | number> & SetterGetter<"title", string | number>

type TextLabelProps = StyleProps & {
    title?: string | number
    titleClassName?: string
    titleStyle?: React.CSSProperties
    titleOnWayLimit?: FitTextDirection
    titleVirtualText?: string

    content?: string | number
    contentClassName?: string
    contentStyle?: React.CSSProperties
    contentOnWayLimit?: FitTextDirection
    contentVirtualText?: string
}

const TextLabel = forwardRef<TextLabelRef, TextLabelProps>((props, ref) => {
    const [title, setTitle] = useState<string | number>(props.title !== undefined ? props.title : "")
    const [content, setContent] = useState<string | number>(props.content !== undefined ? props.content : "")

    useImperativeHandle(ref, () => ({
        setTitle(value) {
            if (value instanceof Function) setTitle(value(title))
            else setTitle(value)
        },
        getTitle() {
            return title
        },
        setContent(value) {
            if (value instanceof Function) setContent(value(content))
            else setContent(value)
        },
        getContent() {
            return content
        }
    }))

    return (
        <div
            className={"flex flex-col justify-between items-center " + props.className}
            style={props.style}
        >
            <FitText
                virtualText={props.titleVirtualText}
                fitDirection={props.titleOnWayLimit}
                className={props.titleClassName}
                style={props.titleStyle}
            >
                {title}
            </FitText>
            <FitText
                virtualText={props.contentVirtualText}
                fitDirection={props.contentOnWayLimit}
                className={props.contentClassName}
                style={props.contentStyle}
            >
                {content}
            </FitText>
        </div>
    )
})

export default TextLabel