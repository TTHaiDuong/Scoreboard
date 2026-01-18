import Image from "next/image"
import punch from "../assets/red-punch.png"

type PunchProps = {
    size?: string
}

const Punch = (props: PunchProps) => {
    return (
        <Image
            className="object-contain"
            style={{
                width: props.size,
                height: props.size,
            }}
            src={punch}
            alt="Punch"
        />
    )
}

export default Punch