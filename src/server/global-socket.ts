import { SocketMethods } from "./websocket"
import { socketBroadcast } from "./server.js"



const GlobalSocket: SocketMethods<SocketData[], SocketMSG> = {
    messageHandlers: {
        courtslist: (data, send, id) => {

        }
    },
    onMessage: (msg, send) => {
        send([
            { id: "1", courtAddress: "1", matchTitle: "Qualification Senior - Final Male - 58KG", isActive: false },
            { id: "2", courtAddress: "1", matchTitle: "Qualification Senior - Final Male - 58KG", isActive: false },
            { id: "3", courtAddress: "1", matchTitle: "Qualification Senior - Final Male - 58KG", isActive: false },
            { id: "4", courtAddress: "1", matchTitle: "Qualification Senior - Final Male - 58KG", isActive: false },
            { id: "5", courtAddress: "1", matchTitle: "Qualification Senior - Final Male - 58KG", isActive: false }
        ])
    },
    onClose: () => {
        console.log("Close")
    },
    onError: (err) => {
        console.error(err)
    }
}

export default GlobalSocket