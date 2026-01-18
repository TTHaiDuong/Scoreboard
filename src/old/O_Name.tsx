import { StyleProps } from "@/utils/types"
import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"
import type { Setter, SetterGetter } from "@/utils/types"

export type NameHandle = SetterGetter<"name", string>

type NameProps = StyleProps

const Name = forwardRef<NameHandle, NameProps>(({ className }, ref) => {
    const [name, setName] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)
    const cursorRef = useRef<number>(0)

    useImperativeHandle(ref, () => ({
        getName() { return name },
        setName(value: string | Setter<string>) {
            setName(pre => value instanceof Function ? value(pre) : value)
        }
    }))

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        cursorRef.current = e.target.selectionStart || 0
        setName(e.target.value.toUpperCase())
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") e.currentTarget.blur()
    }

    useLayoutEffect(() => {
        inputRef.current?.setSelectionRange(cursorRef.current, cursorRef.current)
    }, [name])

    return (
        <input
            ref={inputRef}
            type="text"
            className={`absolute text-white bg-transparent font-bold truncate focus:bg-gray-700 ${className}`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={name}
        />
    )
})

export default Name