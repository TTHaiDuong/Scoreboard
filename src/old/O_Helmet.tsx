import blueHelmet from "../assets/blue-helmet.png"
import redHelmet from "../assets/red-helmet.png"
import Image from "next/image"

type HelmetProps = {
    isBlue?: boolean
    size?: string
}

const Helmet = (props: HelmetProps) => {
    return (
        <Image
            className="object-contain"
            style={{
                width: props.size,
                height: props.size,
            }}
            src={props.isBlue ? blueHelmet : redHelmet}
            alt={props.isBlue ? "Blue Helmet" : "Red Helmet"}
        />
    )
}

export default Helmet