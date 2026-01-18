"use client"
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        const proto = window.location.protocol
        const host = window.location.hostname // tự động lấy IP/host
        const port = 3001
        socket = io(`${proto}//${host}:${port}`, {
            transports: ["websocket"]
        })
    }
    return socket;
}