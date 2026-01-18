import { useEffect, useState } from "react"
import "@/styles/entry.css"
import PINInput from "react-otp-input"
import FitText from "../components/FitText"
import { useRouter } from "next/navigation"
import { socket } from "@/scripts/global-client-io"

export type SocketData = {
    id: string
    courtAddress?: string
    matchTitle?: string
    isActive: boolean
}

export type SocketMSG = {
    method: "get"
}

export default function Entry() {
    const [messages, setMessage] = useState<SocketData[]>()
    const [visibleCourtForm, setVisibleCourtForm] = useState<boolean>(false)
    const [chooseCourt, setChooseCourt] = useState<boolean>(false)
    const [pin1, setPin1] = useState("")
    const [pin2, setPin2] = useState("")
    const router = useRouter()

    useEffect(() => {
        socket.on("courtslist", (msg) => {
            setMessage(msg)
        })

        socket.emit("courtslist", { method: "get" }, (res: any) => {
            setMessage(res.data)
        })

        return () => {
            socket.off("courtslist")
        }
    }, [])

    // const { data, isLoading, isError } = useQuery({
    //     queryKey: ["courtsList"],
    //     queryFn: fetchCourtList
    // })

    function handleCourtCardClick(id: string) {
        setChooseCourt(true)
    }

    const handleChange = (value: string) => {
        const numericValue = value.replace(/\D/g, ""); // loại bỏ mọi ký tự không phải số
        setPin1(numericValue);
    }

    const handleCreateCourt = (e: any) => {
        if (pin1 === pin2) {

        }
    }

    return (
        <div id="main-container">
            {visibleCourtForm &&
                <div
                    className="court-form"
                    onClick={() => { setVisibleCourtForm(false) }}
                >
                    <div onClick={(e) => { e.stopPropagation() }}>
                        <FitText
                            fitDirection="vertical"
                            className="courtID"
                        >
                            Order ID
                            <FitText
                                fitDirection="vertical"
                                className="id"
                            >1</FitText>
                        </FitText>
                        <PINInput
                            value={pin1}
                            onChange={handleChange}
                            numInputs={4}
                            shouldAutoFocus
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    type="password"
                                    maxLength={1}   // chỉ 1 ký tự mỗi ô
                                    pattern="\d*"   // hint cho mobile chỉ số
                                    inputMode="numeric" // hint cho bàn phím số trên mobile
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        fontSize: "20px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                        textAlign: "center",
                                    }}
                                />
                            )}
                            containerStyle={{ gap: "10px" }}
                        />
                        <PINInput
                            value={pin2}
                            onChange={(value) => setPin2(value)}
                            numInputs={4}
                            shouldAutoFocus
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    type="password"
                                    maxLength={1}   // chỉ 1 ký tự mỗi ô
                                    pattern="\d*"   // hint cho mobile chỉ số
                                    inputMode="numeric" // hint cho bàn phím số trên mobile
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        fontSize: "20px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                        textAlign: "center",
                                    }}
                                />
                            )}
                            containerStyle={{ gap: "10px" }}
                        />

                        <div
                            className="create-court"
                            onClick={() => router.push("/control")}
                        >
                            <div
                                onClick={handleCreateCourt}
                            >Create Court</div>
                        </div>

                    </div>
                </div>}

            <div className="header"></div>
            {!chooseCourt
                ? <>
                    <div>
                        <div className="list-top">
                            <div
                                className="create-court"
                                onClick={() => { setVisibleCourtForm(true) }}
                            >
                                <div>Create Court</div>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="courts-list">
                            <div className="header">
                                <div>Order ID</div>
                                <div>Court</div>
                                <div>Match Title</div>
                                <div>Status</div>
                            </div>
                            {messages?.map((court: SocketData) => (
                                <CourtCard
                                    key={court.id}
                                    id={court.id}
                                    court={court.courtAddress}
                                    title={court.matchTitle}
                                    isActive={court.isActive}
                                    onClick={() => handleCourtCardClick("1")}
                                />
                            ))}
                        </div>
                    </div>
                </>
                : <div className="choose-court">
                    <div onClick={() => router.push("/control")}>
                        Control
                    </div>
                    <div onClick={() => router.push("/judge")}>
                        Judge {"Số kết nối 1/3"}
                    </div>
                    <div>
                        Trackboard
                    </div>
                </div>
            }
        </div>
    )
}

/* Thẻ sân thi đấu trong danh sách các sân thi đấu */
function CourtCard(props: {
    id: string,
    court?: string,
    title?: string,
    isActive?: boolean,
    onClick?: () => void
}) {
    return (
        <div
            className="court-card"
            onClick={props.onClick}
        >
            <div className="id">{props.id}</div>
            <div className="court-address">{props.court}</div>
            <div
                className="title"
                style={{
                    color: props.title ? "black" : "gray"
                }}
            >
                <span>{props.title ? props.title : "Unset"}</span>
            </div>
            <div
                className="status"
                style={{
                    color: props.isActive ? "#00B25D" : "#F44336",
                    background: props.isActive ? "#E5F7EE" : "#FDEDED"
                }}
            >
                {props.isActive ? "● Active" : "● InActive"}
            </div>
            <div className="">
            </div>
        </div>
    )
}