import express from 'express'
import https from 'https'
import http from 'http'
import fs from 'fs'
import cors from 'cors'
import 'dotenv/config'
import { Server } from 'socket.io'
import Style, { printLines } from './terminal-styles.js'
import { getIP } from '../scripts/network.js'
import handleVir from './services/vir.js'
import { handleCourt } from './services/court.js'
import initAuthMiddleWare from './services/middleware.js'
import initRoundChannel from './services/match.js'
import initScoreChannel from './services/score.js'
import initTestModeChannel from './services/testmode.js'
import initTimerChannel from './services/timer.js'

const useHttps = process.env.USE_HTTPS
const PORT = process.env.EXPRESS_PORT || 3001
const app = express()

// == EXPRESS ==
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", (req, res) =>
    res.json({
        message: "Path not found"
    })
)

let server
if (useHttps) {
    server = https.createServer(
        {
            key: fs.readFileSync('./localhost-key.pem'),
            cert: fs.readFileSync('./localhost.pem')
        },
        app
    )
}
else {
    server = http.createServer(app)
}

// == WEBSOCKET ==

const io = new Server(server, { cors: { origin: "*" } })

io.on("connection", (socket) => {
    // handleCourt(io, socket)
    // handleVir(io, socket)

    initAuthMiddleWare(io)
    initRoundChannel(io, socket)
    initScoreChannel(io, socket)
    initTestModeChannel(io, socket)
    initTimerChannel(io, socket)
})

server.listen(PORT, () => {
    printLines([
        Style.apply("   ▲ Express Server", ["blue", "bold"]),
        `   - Local:        http://localhost:${PORT}`,
        `   - Network:      http://${getIP()}:${PORT}`,
        ""
    ])
})