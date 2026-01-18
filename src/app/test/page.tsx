"use client"

import "@/styles/test.css"
import "@/styles/global.css"
import Switch from "@/components/Switch"
import PointEditor from "@/components/PointEditor"
import Armor from "@/assets/solid-armor.svg"
import Helmet from "@/assets/solid-helmet.svg"
import Punch from "@/assets/solid-punch.svg"
import { useState } from "react"

const POINT_EDITORS = [
    {
        key: "gj",
        icon: <span className="point-editor_gj drop-shadow">GJ</span>
    },
    {
        key: "1",
        icon: Punch
    },
    {
        key: "2",
        icon: Armor
    },
    {
        key: "3",
        icon: Helmet
    },
    {
        key: "4",
        icon: <span className="point-editor_number drop-shadow">4</span>
    },
    {
        key: "5",
        icon: <span className="point-editor_number drop-shadow">5</span>
    }
]

export default function Home() {
    const [score, setScore] = useState<{}>()
    return (
        <div className="operator">
            <div className="overlay"></div>
            <div className="layout">
                <div className="header"></div>
                <div className="team blue"></div>
                <div className="team red"></div>
                <div className="athlete blue"></div>
                <div className="athlete red"></div>
                <div className="side blue"></div>
                <div className="side red"></div>
                <div className="control blue"></div>
                <div className="control red"></div>
                <div className="point-editor-container blue">
                    {POINT_EDITORS.map(v =>
                        <PointEditor
                            className="external-point-editor"
                            key={v.key}
                            icon={v.icon}
                            iconColor="#187BCD"
                            backgroundColor={v.key === "gj" ? "rgb(255, 255, 255, 0.5)" : "rgb(0, 136, 255, 0.3)"}
                        >

                        </PointEditor>)}
                </div>
                <div className="point-editor-container red">
                    {POINT_EDITORS.map(v =>
                        <PointEditor
                            className="external-point-editor"
                            key={v.key}
                            icon={v.icon}
                            iconColor="#FE3939"
                            backgroundColor={v.key === "gj" ? "rgb(255, 255, 255, 0.5)" : "rgb(255, 56, 59, 0.3)"}
                            direction="row-reverse"
                        >

                        </PointEditor>)}
                </div>
                <div className="footer"></div>
            </div>
        </div>
    )
}