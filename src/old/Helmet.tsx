import { StyleProps, Vector2 } from "@/utils/types"
import { forwardRef, useState, useEffect } from "react"

type HelmetProps = StyleProps & {
    isBlue?: boolean
}

type Color = {
    gradientFront: [string, string]
    gradientInside: [string, string]
    light: string
    dark: string
}

const white: Color = {
    gradientFront: ["#EEEEEE", "#ADADAD"],
    gradientInside: ["#848484", "#000000"],
    light: "#EEEEEE",
    dark: "#999999"
}

const red: Color = {
    gradientFront: ["#FF0000", "#CE0000"],
    gradientInside: ["#FFA5A6", "#FF5F62"],
    light: "#FF0000",
    dark: "#B80000"
}

const blue: Color = {
    gradientFront: ["#003CFF", "#002FC8"],
    gradientInside: ["#714DFF", "#A172FF"],
    light: "#003CFF",
    dark: "#0E00AD"
}

const Helmet = forwardRef(({ className, isBlue }: HelmetProps, ref) => {
    const [color, setColor] = useState<Color>(white);
    const [position, setPosition] = useState<Vector2>({ x: 0, y: 0 });
    const [offset, setOffset] = useState<Vector2>({ x: 0, y: 0 })
    const [dragging, setDragging] = useState<boolean>(false)
    const [dragTimestamp, setDragTimestamp] = useState<number>()

    function handleMouseDown(e: React.MouseEvent<SVGSVGElement>) {
        setDragTimestamp(Date.now())

        setDragging(true)
        setOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    function handleMouseMove(e: MouseEvent) {
        if (!dragging) return
        setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    }

    function handleMouseUp() {
        setDragging(false)
    }

    function changeColor(e: KeyboardEvent) {
        if (e.key === "d") setColor(white)
        else if (e.key === "r") setColor(red)
        else if (e.key === 'b') setColor(blue)
    }

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        document.addEventListener("keydown", changeColor)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)

            document.removeEventListener("keydown", changeColor)
        }
    })

    const tranEffect = "transition-colors duration-1000"
    const stopTranEffect = "transition-all duration-1000"

    return (
        <svg
            className={`absolute active:scale-90 z-50 p-5 ${className}`}
            width={211 / 2} height={198 / 2} viewBox="0 0 211 211" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{
                top: position.y + "px",
                left: position.x + "px",
            }}
            onMouseDown={handleMouseDown}
        >
            <g filter="url(#filter0_d_99_24)">
                <path className={tranEffect} d="M8.27778 127.412C0.500001 123.752 0.5 127.412 0.5 94.0124C0.5 85.7767 0.500002 85.8008 19.0556 85.8008C21.6492 85.7767 21.6753 85.7767 25.2059 85.7767C25.2059 115.974 27.1211 136.563 29.781 148.001H24H19.7157C15.1405 148.001 13.3105 150.289 8.27778 127.412Z" fill={color.dark} />
                <path className={tranEffect} d="M210.5 94.0124C210.5 85.7767 210.5 85.7767 185.794 85.7767C185.794 45.5136 185.337 33.6177 170.239 19.4341C155.076 5.18984 144.397 1.71672 134.095 0.908622C176.76 14.2941 175.641 52.2437 174.386 94.8193C174.376 95.1601 174.366 95.5011 174.356 95.8424C172.837 147.497 172.532 147.996 157.862 171.999L157.428 172.708C150.438 184.147 138.212 196.5 134.552 193.647C135.504 194.647 136.714 195.601 138.212 196.5C151.938 204.736 176.644 167.675 181.219 148.001H191.284C195.86 148.001 197.69 150.289 202.722 127.412C210.5 123.752 210.5 127.412 210.5 94.0124Z" fill={color.dark} />
                <path d="M69.1274 88.5219C57.232 82.4395 49.9118 84.8616 49.4543 92.6397C49.264 95.8747 48.0272 111.738 49.7915 126.04C59.9771 120.549 81.9379 114.601 105.729 114.601C129.52 114.601 151.023 120.549 161.209 126.04C162.973 111.738 161.736 95.8747 161.546 92.6397C161.088 84.8616 153.768 82.4395 141.873 88.5219C125.402 96.9436 123.729 101.333 105.729 101.333C87.7282 101.333 85.598 96.9436 69.1274 88.5219Z" fill="url(#paint0_radial_99_24)" />
                <path className={tranEffect} d="M185.794 85.7767C185.794 134.275 183.028 140.223 181.219 148.001H191.284C195.86 148.001 197.69 150.289 202.722 127.412C210.5 123.752 210.5 127.412 210.5 94.0124C210.5 85.7767 210.5 85.7767 185.794 85.7767Z" fill={color.light} />
                <path className={tranEffect} d="M8.27778 127.412C0.500001 123.752 0.5 127.412 0.5 94.0124C0.5 85.7767 0.500002 85.8008 19.0556 85.8008C19.0556 121.007 20 131.175 24 148.001H19.7157C15.1405 148.001 13.3105 150.289 8.27778 127.412Z" fill={color.light} />
                <path fillRule="evenodd" clipRule="evenodd" d="M40.7614 19.4341C25.6634 33.6177 25.2059 45.5136 25.2059 85.7767C25.2059 115.974 27.1211 136.563 29.781 148.001C34.3562 167.675 59.0621 204.736 72.7876 196.5C86.5131 188.264 75.9902 175.453 65.4673 164.473C58.5334 157.237 52.9096 142.562 50.8268 132.445C50.4017 130.38 50.0615 128.228 49.7915 126.04C48.0272 111.738 49.264 95.8747 49.4543 92.6397C49.9118 84.8616 57.232 82.4395 69.1274 88.5219C85.598 96.9436 87.7282 101.333 105.729 101.333C123.729 101.333 125.402 96.9436 141.873 88.5219C153.768 82.4395 161.088 84.8616 161.546 92.6397C161.736 95.8747 162.973 111.738 161.209 126.04C160.939 128.228 160.598 130.38 160.173 132.445C158.09 142.562 152.467 157.237 145.533 164.473C136.159 174.254 126.785 185.489 134.552 193.647C138.212 196.5 150.438 184.147 157.428 172.708L157.862 171.999C172.532 147.996 172.837 147.497 174.356 95.8424L174.386 94.8193C175.641 52.2437 176.76 14.2941 134.095 0.908622C131.652 0.717001 129.23 0.675232 126.774 0.675232H84.2255C71.415 0.675232 59.5196 1.81213 40.7614 19.4341ZM55.8595 45.5136C55.8595 43.2259 65.4673 22.6369 105.729 22.6369C145.99 22.6369 155.141 43.2259 155.141 45.5136C155.141 47.8013 155.141 47.8013 145.99 47.8013H65.0098C55.8595 47.8013 55.8595 47.8013 55.8595 45.5136Z" fill="url(#paint1_diamond_99_24)" />
            </g>
            <defs>
                <filter id="filter0_d_99_24" x="-3.5" y="0.675232" width="218" height="205" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_99_24" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_99_24" result="shape" />
                </filter>
                <radialGradient id="paint0_radial_99_24" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(105.5 99.1752) rotate(90) scale(98.5 105)">
                    <stop className={stopTranEffect} offset="0.374" stopColor={color.gradientInside[0]} />
                    <stop className={stopTranEffect} offset="0.689" stopColor={color.gradientInside[1]} />
                </radialGradient>
                <radialGradient id="paint1_diamond_99_24" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(105.5 99.1752) rotate(90) scale(98.5 105)">
                    <stop className={stopTranEffect} offset="0.38" stopColor={color.gradientFront[0]} />
                    <stop className={stopTranEffect} offset="1" stopColor={color.gradientFront[1]} />
                </radialGradient>
            </defs>
        </svg >)
})

export default Helmet