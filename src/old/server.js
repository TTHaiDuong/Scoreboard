import { parse } from "url"
import express from "express"
import next from "next"
import { WebSocketServer } from "ws"

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = express()
const server = app.listen(port, () => {
    console.log(`> listen at http://localhost:${port}`)
})
const wss = new WebSocketServer({ noServer: true })
const nextApp = next({ dev })

nextApp.prepare().then(() => {
    app.use((req, res) => {
        nextApp.getRequestHandler()(req, res, parse(req.url, true))
    })

    wss.on("connection", ws => {
        let time = 0
        let lastTime
        let interval

        function setRunning(isRunning) {
            clearInterval(interval)

            if (isRunning) {
                interval = setInterval(() => {
                    const now = Date.now()
                    time = Math.max(time - (now - lastTime), 0)
                    lastTime = now

                    if (time === 0) {
                        setRunning(false)
                        sendMessage({ time: 0 })
                    }
                }, 10)
            }
        }

        function sendMessage(value) {
            ws.send(JSON.stringify(value))
        }

        ws.on("message", message => {
            const { isRunning, setTime, isAppVisible } = JSON.parse(message.toString())

            if (typeof isRunning === "boolean")
                setRunning(isRunning)

            if (typeof setTime === "number") {
                setRunning(false)
                time = setTime
            }

            if (isAppVisible === true)
                sendMessage({ time: time })
        })

        ws.on("close", () => {
            setRunning(false)
        })
    })

    server.on("upgrade", (req, socket, head) => {
        const { pathname } = parse(req.url || "/", true)

        if (pathname === "/_next/webpack-hmr") {
            nextApp.getUpgradeHandler()(req, socket, head);
        }

        if (pathname === "/api/ws") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req)
            })
        }
    })
})