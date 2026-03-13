export const side = ["BLUE", "RED"] as const
export type Side = typeof side[number]

// === TYPE CHẤM ĐIỂM ===
export const pointTypes = [1, 2, 3, 4, 6, "gj"] as const
export type PointType = typeof pointTypes[number]
export type Score = {
    [k in PointType]: number
}
export function getDefaultScore(): Score {
    const score = {} as Score
    for (const t of pointTypes) {
        score[t] = 0
    }
    return score
}

export type UpdateScoreData = {
    side: Side
    scoreType: PointType
    value: number | "increase" | "decrease"
}

export type PressBuffer = {
    presses: PointType[]
    timeout: NodeJS.Timeout
}

export type PendingVote = {
    courtId: string
    side: Side
    scoreType: PointType
    voters: Set<string>
    timeout: NodeJS.Timeout
}


// === TYPE HIỆP ĐẤU, TRẬN ĐẤU ===
export type Round = {
    blue: Score
    red: Score
    win?: Side
}
export function getDefaultRound(): Round {
    return {
        blue: getDefaultScore(),
        red: getDefaultScore()
    }
}

export type Match = {
    rounds: Map<number, Round>
    currentRoundIdx: number
}

export type MatchResult = {
    [k in number]: {
        blue: number
        red: number
        win?: Side
    }
}