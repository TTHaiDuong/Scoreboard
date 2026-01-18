"use client"

import { useEffect, useRef } from "react"
import { getSocket } from "@/scripts/global-client-io"

export default function ViewerPage() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const socket = getSocket()

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        })

        // ✅ Khi nhận được track từ phone → gán vào video
        pc.ontrack = event => {
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0]
            }
        }

        // ✅ Gửi ICE candidate về phone
        pc.onicecandidate = e => {
            if (e.candidate) {
                socket.emit("ice-candidate", e.candidate)
            }
        }

        // ✅ Nhận offer từ phone
        socket.on("offer", async offer => {
            await pc.setRemoteDescription(offer)

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            socket.emit("answer", answer)
        })

        // ✅ Nhận ICE từ phone
        socket.on("ice-candidate", candidate => {
            pc.addIceCandidate(candidate)
        })

        return () => {
            pc.close()
            socket.disconnect()
        }
    }, [])

    return (
        <video
            ref={videoRef}
            className="w-full h-full"
        />
    )
}
