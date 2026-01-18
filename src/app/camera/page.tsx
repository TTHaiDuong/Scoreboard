"use client"

import { useEffect, useRef } from "react"
import { getSocket } from "@/scripts/global-client-io"

export default function PhonePage() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) {
            console.error("getUserMedia not supported")
            return
        }

        const socket = getSocket()
        const roomId = "room1" // hoặc dynamic tuỳ nhu cầu
        socket.emit("join-room", roomId)

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        })

        // gửi ICE candidate tới server (có room)
        pc.onicecandidate = e => {
            if (e.candidate) {
                socket.emit("ice-candidate", { roomId, candidate: e.candidate })
            }
        }

        // Bắt đầu camera và tạo offer
        const startCameraAndStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } }
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }

            // Add track trước khi tạo offer
            stream.getTracks().forEach(t => pc.addTrack(t, stream))

            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            socket.emit("offer", { roomId, offer })
        }

        // Nhận answer từ viewer
        socket.on("answer", async ({ answer }) => {
            await pc.setRemoteDescription(answer)
        })

        // Nhận ICE từ viewer
        socket.on("ice-candidate", async ({ candidate }) => {
            if (candidate) {
                try {
                    await pc.addIceCandidate(candidate)
                } catch (err) {
                    console.error("Error adding ICE candidate:", err)
                }
            }
        })

        startCameraAndStream()

        return () => {
            pc.close()
            socket.disconnect()
        }
    }, [])

    return (
        <video
            ref={videoRef}
            className="w-full h-full"
            autoPlay
            playsInline
            muted
        />
    )
}
