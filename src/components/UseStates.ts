import { useState, useEffect } from "react"

export default function useIsMobile() {
    const [isTouch, setIsTouch] = useState<boolean>(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        setIsTouch(
            window.matchMedia("(hover: none)").matches
        )
    }, [])

    return isTouch
}