import { useState, useEffect } from "react"
import { getDefaultRound, Round, PointType } from "@/scripts/types"
import { getSocket } from "@/scripts/global-client-io"

export function useScore(courtId: string) {
    const [score, setScore] = useState<Round>(getDefaultRound())

    return {
        score,
        setScore
    }
}
