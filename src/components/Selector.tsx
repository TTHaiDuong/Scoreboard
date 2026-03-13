import { useEffect, useRef } from "react"

type SelectorRecord = string | { key: string, description: string }

export default function Selector(props: {
    title?: string
    data: SelectorRecord[]
    value?: SelectorRecord
    onHeaderClick?: () => void
    onValueChanged?: (value: string) => void
}) {
    const selectedRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({
                block: "center",
                behavior: "instant"
            })
        }
    }, [props.value])

    return (
        <div
            className="flex flex-col w-full h-[40%] bg-white text-black border border-gray drop-shadow"
            onClick={props.onHeaderClick}
        >
            <div className="flex-center w-full p-[15px]">{props.title}</div>

            <div className="flex-1 w-full overflow-y-auto">
                {props.data.map((row) => {
                    const key = typeof row === "string" ? row : row.key
                    const isSelected = key === props.value

                    if (typeof row === "string") return (
                        <button
                            ref={isSelected ? selectedRef : null}
                            key={row}
                            className="grid grid-cols-[1fr_1fr] p-[15px] w-full place-items-center"
                            onClick={() => props.onValueChanged?.(row)}
                            style={{ backgroundColor: isSelected ? "var(--color-selected)" : undefined }}
                        >
                            <span>{row}</span>
                            <div>{isSelected && "✓"}</div>
                        </button>
                    )

                    return (
                        <button
                            ref={isSelected ? selectedRef : null}
                            key={row.key}
                            className="grid grid-cols-[1fr_3fr_1fr] p-[15px] w-full"
                            onClick={() => props.onValueChanged?.(row.key)}
                            style={{ backgroundColor: isSelected ? "var(--color-selected)" : undefined }}
                        >
                            <span className="flex-center">{row.key}</span>
                            <span>{row.description}</span>
                            <div className="flex-center">{isSelected && "✓"}</div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}