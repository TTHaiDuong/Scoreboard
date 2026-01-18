import { StyleProps, Vector2 } from "@/utils/types"
import { forwardRef, useState, useEffect } from "react"

type ArmorProps = StyleProps & {
    isBlue?: boolean
}

type Color = {
    gradientFront: [string, string]
    gradientSide: [string, string]
}

const white: Color = {
    gradientFront: ["#D7D7D7", "#979797"],
    gradientSide: ["#ECECEC", "#999999"]
}

const red: Color = {
    gradientFront: ["#FF0000", "#990000"],
    gradientSide: ["#E00000", "#7A0000"],
}

const blue: Color = {
    gradientFront: ["#003CFF", "#002FC8"],
    gradientSide: ["#003CFF", "#0E00AD"],
}

const Armor = forwardRef(({ className, isBlue }: ArmorProps, ref) => {
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
    }, [])

    const stopTranEffect = "transition-all duration-1000"

    return (
        <svg
            className={`
                active:scale-90 
                z-50 
                ${className}
            `}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 170 212"
            width="170" height="212"
            preserveAspectRatio="xMidYMid meet"
            // style={{
            //     top: position.y + "px",
            //     left: position.x + "px",
            // }}
            onMouseDown={handleMouseDown}
        >
            <path d="M84.7415 47.9218C72.3186 47.9218 39.7886 45.2767 26.2555 42.4219C26.338 44.68 25.7555 48.4219 20.7555 51.4219C18.8915 52.5403 16.4613 53.6988 14 54.9611C59.5 126 52 118 24.6857 189.5C29.8324 193.383 35.2164 195.422 41.7554 195.422C50 195.422 62.7555 211.049 84.7554 211.049C106.755 211.049 119.755 195.422 128 195.422C134.539 195.422 139.923 193.383 145.07 189.5C117.755 118 110.255 126 155.755 54.9611C153.294 53.6988 150.864 52.5403 149 51.4219C144 48.4219 143.418 44.68 143.5 42.4219C129.967 45.2767 97.1645 47.9218 84.7415 47.9218Z" fill="url(#paint0_linear_110_205)" />
            <path d="M0.75523 16.5487C4.75547 20.4219 17.7552 25.6695 23.3204 32.308C26.2223 35.7697 25.9133 38.7169 26.2555 42.4219C39.7886 45.2767 72.3186 47.9218 84.7415 47.9218C97.1645 47.9218 129.967 45.2767 143.5 42.4219C143.842 38.7169 143.533 35.7697 146.435 32.308C152 25.6695 165 20.4219 169 16.5487C169.71 15.8617 169.895 14.9861 169.657 14L169.134 13.8535C146.28 7.4555 136.003 4.57827 102.755 14.8751C96.683 17.3994 91.9145 16.5487 84.7554 16.5487C77.5963 16.5487 73.0725 17.3994 67 14.8751C33.5 4.5 23.3204 7.5 0.0983455 14C-0.139925 14.9861 0.0456149 15.8617 0.75523 16.5487Z" fill="url(#paint1_linear_110_205)" />
            <path d="M149 0.921876C137.654 -0.969151 123.5 -0.326429 115.5 6.42191C110.22 10.8762 106.234 13.4293 102.755 14.8751C136.003 4.57827 146.28 7.4555 169.134 13.8535L169.657 14C168.552 9.42726 158.334 2.47745 149 0.921876Z" fill="url(#paint2_linear_110_205)" />
            <path d="M54.2552 6.42191C46.2552 -0.326429 32.1018 -0.969151 20.7553 0.921876C11.4216 2.47745 1.20325 9.42726 0.0983455 14C23.3204 7.5 33.5 4.5 67 14.8751C63.5219 13.4293 59.5357 10.8762 54.2552 6.42191Z" fill="url(#paint3_linear_110_205)" />
            <path d="M3 65.5C3 72 11.837 175 15 180C18.2877 183.868 21.4395 187.051 24.6857 189.5C52 118 59.5 126 14 54.9611C8.57567 57.7429 3 61.0288 3 65.5Z" fill="url(#paint4_radial_110_205)" />
            <path d="M154.755 180C157.918 175 166.755 72 166.755 65.5C166.755 61.0288 161.18 57.7429 155.755 54.9611C110.255 126 117.755 118 145.07 189.5C148.316 187.051 151.468 183.868 154.755 180Z" fill="url(#paint5_radial_110_205)" />
            <path d="M28.7552 155.422C28.7552 158.183 26.5167 160.422 23.7552 160.422C20.9938 160.422 18.7552 158.183 18.7552 155.422C18.7552 152.661 20.9938 150.422 23.7552 150.422C26.5167 150.422 28.7552 152.661 28.7552 155.422Z" fill="#D9D9D9" />
            <path d="M28.7552 95.422C28.7552 92.6606 26.5167 90.422 23.7552 90.422C20.9938 90.422 18.7552 92.6606 18.7552 95.422C18.7552 98.1834 20.9938 100.422 23.7552 100.422C26.5167 100.422 28.7552 98.1834 28.7552 95.422Z" fill="#D9D9D9" />
            <path d="M59.7552 145.422C59.7552 148.183 57.5167 150.422 54.7552 150.422C51.9938 150.422 49.7552 148.183 49.7552 145.422C49.7552 142.661 51.9938 140.422 54.7552 140.422C57.5167 140.422 59.7552 142.661 59.7552 145.422Z" fill="#D9D9D9" />
            <path d="M59.7552 105.422C59.7552 102.661 57.5167 100.422 54.7552 100.422C51.9938 100.422 49.7552 102.661 49.7552 105.422C49.7552 108.183 51.9938 110.422 54.7552 110.422C57.5167 110.422 59.7552 108.183 59.7552 105.422Z" fill="#D9D9D9" />
            <path d="M69.7552 125.422C69.7552 122.661 67.5167 120.422 64.7552 120.422C61.9938 120.422 59.7552 122.661 59.7552 125.422C59.7552 128.183 61.9938 130.422 64.7552 130.422C67.5167 130.422 69.7552 128.183 69.7552 125.422Z" fill="#D9D9D9" />
            <path d="M39.7552 135.422C39.7552 138.183 37.5167 140.422 34.7552 140.422C31.9938 140.422 29.7552 138.183 29.7552 135.422C29.7552 132.661 31.9938 130.422 34.7552 130.422C37.5167 130.422 39.7552 132.661 39.7552 135.422Z" fill="#D9D9D9" />
            <path d="M39.7552 115.422C39.7552 112.661 37.5167 110.422 34.7552 110.422C31.9938 110.422 29.7552 112.661 29.7552 115.422C29.7552 118.183 31.9938 120.422 34.7552 120.422C37.5167 120.422 39.7552 118.183 39.7552 115.422Z" fill="#D9D9D9" />
            <path d="M49.7552 165.422C49.7552 168.183 47.5167 170.422 44.7552 170.422C41.9938 170.422 39.7552 168.183 39.7552 165.422C39.7552 162.661 41.9938 160.422 44.7552 160.422C47.5167 160.422 49.7552 162.661 49.7552 165.422Z" fill="#D9D9D9" />
            <path d="M49.7552 85.422C49.7552 82.6606 47.5167 80.422 44.7552 80.422C41.9938 80.422 39.7552 82.6606 39.7552 85.422C39.7552 88.1834 41.9938 90.422 44.7552 90.422C47.5167 90.422 49.7552 88.1834 49.7552 85.422Z" fill="#D9D9D9" />
            <path d="M38.7552 65.422C38.7552 62.6606 36.5167 60.422 33.7552 60.422C30.9938 60.422 28.7552 62.6606 28.7552 65.422C28.7552 68.1834 30.9938 70.422 33.7552 70.422C36.5167 70.422 38.7552 68.1834 38.7552 65.422Z" fill="#D9D9D9" />
            <path d="M18.7552 75.422C18.7552 72.6606 16.5167 70.422 13.7552 70.422C10.9938 70.422 8.75525 72.6606 8.75525 75.422C8.75525 78.1834 10.9938 80.422 13.7552 80.422C16.5167 80.422 18.7552 78.1834 18.7552 75.422Z" fill="#D9D9D9" />
            <path d="M141 155.422C141 158.183 143.239 160.422 146 160.422C148.762 160.422 151 158.183 151 155.422C151 152.661 148.762 150.422 146 150.422C143.239 150.422 141 152.661 141 155.422Z" fill="#D9D9D9" />
            <path d="M141 95.422C141 92.6606 143.239 90.422 146 90.422C148.762 90.422 151 92.6606 151 95.422C151 98.1834 148.762 100.422 146 100.422C143.239 100.422 141 98.1834 141 95.422Z" fill="#D9D9D9" />
            <path d="M110 145.422C110 148.183 112.239 150.422 115 150.422C117.762 150.422 120 148.183 120 145.422C120 142.661 117.762 140.422 115 140.422C112.239 140.422 110 142.661 110 145.422Z" fill="#D9D9D9" />
            <path d="M110 105.422C110 102.661 112.239 100.422 115 100.422C117.762 100.422 120 102.661 120 105.422C120 108.183 117.762 110.422 115 110.422C112.239 110.422 110 108.183 110 105.422Z" fill="#D9D9D9" />
            <path d="M100 125.422C100 122.661 102.239 120.422 105 120.422C107.762 120.422 110 122.661 110 125.422C110 128.183 107.762 130.422 105 130.422C102.239 130.422 100 128.183 100 125.422Z" fill="#D9D9D9" />
            <path d="M130 135.422C130 138.183 132.239 140.422 135 140.422C137.762 140.422 140 138.183 140 135.422C140 132.661 137.762 130.422 135 130.422C132.239 130.422 130 132.661 130 135.422Z" fill="#D9D9D9" />
            <path d="M130 115.422C130 112.661 132.239 110.422 135 110.422C137.762 110.422 140 112.661 140 115.422C140 118.183 137.762 120.422 135 120.422C132.239 120.422 130 118.183 130 115.422Z" fill="#D9D9D9" />
            <path d="M120 165.422C120 168.183 122.239 170.422 125 170.422C127.762 170.422 130 168.183 130 165.422C130 162.661 127.762 160.422 125 160.422C122.239 160.422 120 162.661 120 165.422Z" fill="#D9D9D9" />
            <path d="M120 85.422C120 82.6606 122.239 80.422 125 80.422C127.762 80.422 130 82.6606 130 85.422C130 88.1834 127.762 90.422 125 90.422C122.239 90.422 120 88.1834 120 85.422Z" fill="#D9D9D9" />
            <path d="M131 65.422C131 62.6606 133.239 60.422 136 60.422C138.762 60.422 141 62.6606 141 65.422C141 68.1834 138.762 70.422 136 70.422C133.239 70.422 131 68.1834 131 65.422Z" fill="#D9D9D9" />
            <path d="M151 75.422C151 72.6606 153.239 70.422 156 70.422C158.762 70.422 161 72.6606 161 75.422C161 78.1834 158.762 80.422 156 80.422C153.239 80.422 151 78.1834 151 75.422Z" fill="#D9D9D9" />
            <defs>
                <linearGradient shapeRendering="geometricPrecision" id="paint0_linear_110_205" x1="84.8777" y1="0" x2="84.8777" y2="211.049" gradientUnits="userSpaceOnUse">
                    <stop className={stopTranEffect} stopColor={color.gradientFront[0]} />
                    <stop className={stopTranEffect} offset="1" stopColor={color.gradientFront[1]} />
                </linearGradient>
                <linearGradient shapeRendering="geometricPrecision" id="paint1_linear_110_205" x1="84.8777" y1="0" x2="84.8777" y2="211.049" gradientUnits="userSpaceOnUse">
                    <stop offset="0.01" stopColor="#CCCCCC" />
                    <stop offset="1" stopColor="#5D5D5D" />
                </linearGradient>
                <linearGradient shapeRendering="geometricPrecision" id="paint2_linear_110_205" x1="84.8777" y1="0" x2="84.8777" y2="211.049" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="0.1" stopColor="#999999" />
                </linearGradient>
                <linearGradient shapeRendering="geometricPrecision" id="paint3_linear_110_205" x1="84.8777" y1="0" x2="84.8777" y2="211.049" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="0.1" stopColor="#999999" />
                </linearGradient>
                <radialGradient shapeRendering="geometricPrecision" id="paint4_radial_110_205" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(84.8777 105.524) rotate(90) scale(105.524 84.8777)">
                    <stop className={stopTranEffect} offset="0.54" stopColor={color.gradientSide[0]} />
                    <stop className={stopTranEffect} offset="1" stopColor={color.gradientSide[1]} />
                </radialGradient>
                <radialGradient shapeRendering="geometricPrecision" id="paint5_radial_110_205" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(84.8777 105.524) rotate(90) scale(105.524 84.8777)">
                    <stop className={stopTranEffect} offset="0.54" stopColor={color.gradientSide[0]} />
                    <stop className={stopTranEffect} offset="1" stopColor={color.gradientSide[1]} />
                </radialGradient>
            </defs>
        </svg>)
})

export default Armor