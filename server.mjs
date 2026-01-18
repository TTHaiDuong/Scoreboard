import https from "https"
import fs from "fs"
import next from "next"

const dev = true
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    https.createServer(
        {
            key: fs.readFileSync("./localhost-key.pem"),
            cert: fs.readFileSync("./localhost.pem"),
        },
        (req, res) => handle(req, res)
    ).listen(3000, () => {
        console.log("▶ Next.js HTTPS running at https://192.168.1.7:3000")
    })
})
