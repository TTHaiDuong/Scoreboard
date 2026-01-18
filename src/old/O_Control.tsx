import "@/styles/control.css"
import FitText from "../components/FitText"
import Image from "next/image"
import sBlueHelmet from "@/assets/solid-blue-helmet.png"
import sBlueArmor from "@/assets/solid-blue-armor.png"
import sBluePunch from "@/assets/solid-blue-punch.png"
import sRedHelmet from "@/assets/solid-red-helmet.png"
import sRedArmor from "@/assets/solid-red-armor.png"
import sRedPunch from "@/assets/solid-red-punch.png"
import blueHelmet from "@/assets/blue-helmet.png"
import blueArmor from "@/assets/blue-armor.png"
import bluePunch from "@/assets/blue-punch.png"
import redHelmet from "@/assets/red-helmet.png"
import redArmor from "@/assets/red-armor.png"
import redPunch from "@/assets/red-punch.png"
import turning from "@/assets/turning.png"
import flag from "@/assets/flag-of-vietnam.png"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { ReactNode, useEffect, useState, useRef } from "react"
import PlayBtn from "@/assets/play"
import { useQuery } from "@tanstack/react-query"
import { Round, Rule1vs1 } from "@/scripts/rule"
import { getSocket } from "@/scripts/global-client-io"
// import pauseBtn from "@/assets/pause"

export default function Control() {
    const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(1)
    const [data, setData] = useState<Round>()

    useEffect(() => {
        getSocket().emit("control", { round: currentRound }, (res: any) => {
            setData(res)
        })
    }, [])

    return (
        <div className="main-container">
            <div className="float">
                <div className="header">
                    <div></div>
                    <FitText
                        fitDirection="vertical"
                        className="title"
                        scale={0.4}
                    >
                        Qualification Senior - Final Male - 58KG
                    </FitText>
                </div>
                <div className="team blue">
                    <Image
                        src={flag}
                        alt=""
                        className="flag" />
                    <FitText
                        fitDirection="vertical"
                        scale={0.8}
                        className="name"
                    >
                        VIE
                    </FitText>
                </div>
                <FitText
                    fitDirection="vertical"
                    scale={0.5}
                    className="athlete blue"
                >
                    CHUNG
                </FitText>
                <div className="side blue" />
                <div className="point blue">
                    <FitText
                        fitDirection="vertical"
                        scale={0.6}
                        className=""
                    >
                        {data && Rule1vs1.getTotal(data).totalA}
                    </FitText>
                    <div className="gamjeom">
                        <FitText
                            fitDirection="vertical"
                            scale={0.5}
                        >
                            GAM-JEOM
                        </FitText>
                        <FitText
                            fitDirection="vertical"
                            scale={1}
                        >
                            {data?.gamJeom.countA}
                        </FitText>
                    </div>
                    <table className="total">
                        <tbody>
                            <tr>
                                <th>R1</th>
                                <td className="text-[gold]">12</td>
                            </tr>
                            <tr>
                                <th>R2</th>
                                <td>12</td>
                            </tr>
                            <tr>
                                <th>R3</th>
                                <td>12</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="control blue">
                    <div className="buttons">
                        <div>
                            <div>{data?.punch.countA}</div>
                            <SplitButton icon={sBluePunch} color="#187bcd" />
                        </div>
                        <div>
                            <div>{data?.trunkKick.countA}</div>
                            <SplitButton icon={sBlueArmor} color="#187bcd" />
                        </div>
                        <div>
                            <div>{data?.headKick.countA}</div>
                            <SplitButton icon={sBlueHelmet} color="#187bcd" />
                        </div>
                        <div>
                            <div>{data?.turningTrunkKick.countA}</div>
                            <SplitButton color="#187bcd">4</SplitButton>
                        </div>
                        <div>
                            <div>{data?.turningHeadKick.countA}</div>
                            <SplitButton color="#187bcd">5</SplitButton>
                        </div>
                        <div>
                            <div>{data?.gamJeom.countA}</div>
                            <SplitButton color="#187bcd">GJ</SplitButton>
                        </div>
                    </div>
                    <div className="match-detail">
                        <table>
                            <thead>
                                <tr>
                                    <th>SEQ {false ? "⬆" : "⬇"}</th>
                                    <th>ROUND {`(${1})`}</th>
                                    <th>POINT {`(${"+2"})`}</th>
                                    <th>DETAIL</th>
                                    <th>TIME {false ? "⬆" : "⬇"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr><tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="middle">
                    <FitText
                        fitDirection="vertical"
                        scale={0.3}
                        className="match"
                    >
                        MATCH
                        <br />
                        <b>123</b>
                    </FitText>
                    <FitText
                        fitDirection="vertical"
                        scale={0.8}
                        className="stopwatch"
                    >
                        02:00
                    </FitText>
                    <FitText
                        fitDirection="vertical"
                        scale={0.6}
                        className="timeout"
                    >
                        Time out
                    </FitText>
                    <FitText
                        fitDirection="vertical"
                        scale={0.3}
                        className="round"
                    >
                        ROUND
                        <br />
                        <b>1</b>
                    </FitText>
                </div>

                <div className="team red">
                    <Image
                        src={flag}
                        alt=""
                        className="flag" />
                    <FitText
                        fitDirection="vertical"
                        scale={0.8}
                        className="name"
                    >
                        VIE
                    </FitText>
                </div>
                <FitText
                    fitDirection="vertical"
                    scale={0.5}
                    className="athlete red"
                >
                    HONG
                </FitText>
                <div className="side red" />
                <div className="point red">
                    <FitText
                        fitDirection="vertical"
                        scale={0.6}
                        className=""
                    >
                        {data && Rule1vs1.getTotal(data).totalB}
                    </FitText>
                    <div className="gamjeom">
                        <FitText
                            fitDirection="vertical"
                            scale={0.5}
                        >
                            GAM-JEOM
                        </FitText>
                        <FitText
                            fitDirection="vertical"
                            scale={1}
                        >
                            {data?.gamJeom.countB}
                        </FitText>
                    </div>
                    <table className="total">
                        <tbody>
                            <tr>
                                <th>R1</th>
                                <td className="text-[gold]">12</td>
                            </tr>
                            <tr>
                                <th>R2</th>
                                <td>12</td>
                            </tr>
                            <tr>
                                <th>R3</th>
                                <td>12</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="control red">
                    <div className="buttons">
                        <div>
                            <div>{data?.punch.countB}</div>
                            <SplitButton icon={sRedPunch} color="#fe3939" />
                        </div>
                        <div>
                            <div>{data?.trunkKick.countB}</div>
                            <SplitButton icon={sRedArmor} color="#fe3939" />
                        </div>
                        <div>
                            <div>{data?.headKick.countB}</div>
                            <SplitButton icon={sRedHelmet} color="#fe3939" />
                        </div>
                        <div>
                            <div>{data?.turningTrunkKick.countB}</div>
                            <SplitButton color="#fe3939">4</SplitButton>
                        </div>
                        <div>
                            <div>{data?.turningHeadKick.countB}</div>
                            <SplitButton color="#fe3939">5</SplitButton>
                        </div>
                        <div>
                            <div>{data?.gamJeom.countB}</div>
                            <SplitButton color="#fe3939">GJ</SplitButton>
                        </div>
                    </div>
                    <div className="match-detail">
                        <table>
                            <thead>
                                <tr>
                                    <th>SEQ {false ? "⬆" : "⬇"}</th>
                                    <th>ROUND {`(${1})`}</th>
                                    <th>POINT {`(${"+2"})`}</th>
                                    <th>DETAIL</th>
                                    <th>TIME {false ? "⬆" : "⬇"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr><tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>+2</td>
                                    <td>Trunk Kick</td>
                                    <td>1:50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="footer">
                    <div></div>
                    <div></div>
                    <div className="play-pause"><PlayBtn /></div>
                    <div></div>
                </div>
            </div>
            <div className="bg blue" />
            <div className="bg red" />
        </div >
    )
}

export const SplitButton = (props: {
    icon?: string | StaticImport,
    alt?: string,
    color?: string,
    children?: ReactNode,
    topOnClick?: () => void,
    bottomOnClick?: () => void
}) => {
    const ctnRef = useRef<HTMLDivElement>(null)
    const [translY, setTranslY] = useState<number>(0)

    useEffect(() => {
        function updatePosition() {
            const container = ctnRef.current
            if (container) {
                const ctnRect = container.getBoundingClientRect()

                const translate = ctnRect.width / 2
                setTranslY(translate)
            }
        }

        const observer = new ResizeObserver(updatePosition)
        if (ctnRef.current) observer.observe(ctnRef.current)

        return () => { observer.disconnect() }
    }, [])

    return (
        <div
            className="split-btn"
            ref={ctnRef}
        >
            <div onClick={props.topOnClick}>
                <FitText
                    fitDirection="vertical"
                    scale={1.2}
                    style={{ color: props.color }}
                >
                    +
                </FitText>
                <div
                    className="icon"
                    style={{ top: translY + "px" }}
                >
                    {props.children
                        ? <FitText
                            fitDirection="vertical"
                            style={{ color: props.color }}
                        >
                            {props.children}
                        </FitText>

                        : <Image
                            src={props.icon!}
                            alt={props.alt || ""}
                        />
                    }
                </div>
            </div>
            <div onClick={props.bottomOnClick}>
                <div
                    className="icon"
                    style={{ bottom: translY + "px" }}
                >
                    {props.children
                        ? <FitText
                            fitDirection="vertical"
                            style={{ color: props.color }}
                        >
                            {props.children}
                        </FitText>

                        : <Image
                            src={props.icon!}
                            alt={props.alt || ""}
                        />
                    }
                </div>
                <FitText
                    fitDirection="vertical"
                    scale={1.2}
                    style={{ color: props.color }}
                >
                    -
                </FitText>
            </div>
        </div>
    )
}