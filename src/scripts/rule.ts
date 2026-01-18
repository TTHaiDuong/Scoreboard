type PairCount = {
    countA: number
    countB: number
}

export const pairCountDefault: PairCount = {
    countA: 0,
    countB: 0,
}

export type Round = {
    punch: PairCount
    trunkKick: PairCount
    headKick: PairCount
    turningTrunkKick: PairCount
    turningHeadKick: PairCount
    gamJeom: PairCount
}

export const roundDefault: Round = {
    punch: pairCountDefault,
    trunkKick: pairCountDefault,
    headKick: pairCountDefault,
    turningTrunkKick: pairCountDefault,
    turningHeadKick: pairCountDefault,
    gamJeom: pairCountDefault
}

export class Rule1vs1 {
    private static weights: Record<keyof Round, number> = {
        punch: 1,
        trunkKick: 2,
        headKick: 3,
        turningTrunkKick: 4,
        turningHeadKick: 5,
        gamJeom: 0 // gamJeom xử lý riêng
    }

    static getTotal(round: Round): { totalA: number, totalB: number } {
        // cộng các loại đòn trừ gamJeom
        return (Object.entries(round) as [keyof Round, PairCount][])
            .reduce(
                ({ totalA, totalB }, [key, { countA, countB }]) => {
                    if (key === "gamJeom") {
                        return {
                            totalA: totalA + countB,
                            totalB: totalB + countA
                        }
                    }

                    const w = this.weights[key]
                    return {
                        totalA: totalA + countA * w,
                        totalB: totalB + countB * w
                    }
                },
                { totalA: 0, totalB: 0 }
            )
    }
}

import { Score } from "@/server/services/court"

export function calScore(score: Score, rivalGJ: number) {
    return score[1] + score[2] * 2 + score[3] * 3 + score[4] * 4 + score[5] * 5 + rivalGJ
}

export function whoAdvantage(blue: Score, red: Score): "blue" | "red" | null {
    const totalBlue = calScore(blue, red.gj)
    const totalRed = calScore(red, blue.gj)

    if (totalBlue > totalRed) return "blue"
    if (totalRed > totalBlue) return "red"

    if (blue[5] > red[5]) return "blue"
    if (red[5] > blue[5]) return "red"

    if (blue[4] > red[4]) return "blue"
    if (red[4] > blue[4]) return "red"

    if (blue[3] > red[3]) return "blue"
    if (red[3] > blue[3]) return "red"

    if (blue.gj > red.gj) return "blue"
    if (red.gj > blue.gj) return "red"

    return null
}