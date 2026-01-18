import blueArmor from "../assets/blue-armor.png"
import redArmor from "../assets/red-armor.png"
import Image from "next/image"

type ArmorProps = {
    isBlue?: boolean
    size?: string
}

const Armor = (props: ArmorProps) => {
    return (
        <Image
            className="object-contain"
            style={{
                width: props.size,
                height: props.size,
            }}
            src={props.isBlue ? blueArmor : redArmor}
            alt={props.isBlue ? "Blue Armor" : "Red Armor"}
        />
    )
}

export default Armor