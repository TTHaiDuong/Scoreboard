export function measureFontSize(text: string, targetWidth: number, fontFamily: string): number {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return 0

    const baseFontSize = 100
    ctx.font = `${baseFontSize}px ${fontFamily}`
    const measuredTextWidth = ctx.measureText(text).width

    return (targetWidth / measuredTextWidth) * baseFontSize
}