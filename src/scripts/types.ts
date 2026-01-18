export const side = ["blue", "red"] as const
export type Side = typeof side[number]

// === TYPE CHẤM ĐIỂM ===
export const scoreTypes = [1, 2, 3, 4, 5, "gj"] as const
export type ScoreType = typeof scoreTypes[number]
export type Score = {
    [k in ScoreType]: number
}
export function getDefaultScore(): Score {
    const score = {} as Score
    for (const t of scoreTypes) {
        score[t] = 0
    }
    return score
}

export type UpdateScoreData = {
    side: Side
    scoreType: ScoreType
    value: number | "increase" | "decrease"
}

export type PressBuffer = {
    presses: ScoreType[]
    timeout: NodeJS.Timeout
}

export type PendingVote = {
    courtId: string
    side: Side
    scoreType: ScoreType
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