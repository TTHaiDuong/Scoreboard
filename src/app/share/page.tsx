"use client"

import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import "@/styles/sharing.css"

export default function Home() {
    const [hostpost, setHostPost] = useState("")
    const [judgeUrl, setJudgeUrl] = useState("")
    const [ssid, setSsid] = useState("Taekwondo Scoring Server")
    const [password, setPassword] = useState("12345678")

    useEffect(() => {
        const wifiQR = `WIFI:T:WPA;S:${ssid};P:${password};H:false;;`
        setHostPost(wifiQR)
    }, [ssid, password])

    useEffect(() => {
        if (typeof window !== "undefined") {
            setJudgeUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/judge`)
        }
    }, [])

    if (!judgeUrl) return null

    return (
        <div className="root">
            <div>
                <QRCode value={hostpost} size={300} />
                <p className="text">{ssid}</p>
                <p className="text">Mật khẩu: {password}</p>
            </div>
            <div>
                <QRCode value={judgeUrl} size={300} />
                <p className="text">{judgeUrl}</p>
            </div>
        </div>
    )
}
