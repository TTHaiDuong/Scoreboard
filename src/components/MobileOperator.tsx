import "@/styles/mobile-operator.css"
import ArmorI from "@/assets/solid-armor.svg"
import HelmetI from "@/assets/solid-helmet.svg"
import PunchI from "@/assets/solid-punch.svg"
import CameraI from "@/assets/camera.svg"
import CameraOffI from "@/assets/camera-off.svg"
import WifiI from "@/assets/wifi.svg"
import JudgeI from "@/assets/judge.svg"
import ZoomInI from "@/assets/zoom-in.svg"
import ZoomOutI from "@/assets/zoom-out.svg"
import EditI from "@/assets/edit.svg"
import NutI from "@/assets/nut.svg"
import { getDefaultRound, Round, PointType } from "@/scripts/types"
import PointEditor from "./PointEditor"
import { forwardRef, ReactNode, useRef, useState } from "react"
import PopupOverlay from "./PopupOverlay"
import GoogleSheetI from "@/assets/google-sheet.svg"
import ExclamationI from "@/assets/exclamation.svg"
import Switch from "./Switch"
import ChainI from "@/assets/chain.svg"
import XSignI from "@/assets/x-sign.svg"
import TimePicker from "./TimePicker"
import Notification from "./Notification"
import Selector from "./Selector"
import MobileSetting from "./MobileSetting"

const POINT_EDITORS: { key: PointType, icon: any }[] = [
    { key: 1, icon: PunchI },
    { key: 2, icon: ArmorI },
    { key: 3, icon: HelmetI },
    { key: 4, icon: 4 },
    { key: 6, icon: 6 },
]

const WIN_CODES = [
    { key: "PTG", description: "Thắng do cách biệt điểm" },
    { key: "WIN", description: "Thắng điểm chung cuộc" },
    { key: "GDP", description: "Thắng Golden Point" },
    { key: "SUP", description: "Thắng bằng ưu thế (Woo-se girok)" },
    { key: "RSC", description: "Trọng tài dừng trận" },
    { key: "KO", description: "Knock-out" },
    { key: "PUN", description: "Thắng do đối phương bị phạt" },
    { key: "WDR", description: "Đối phương bỏ cuộc" },
    { key: "DSQ", description: "Đối phương bị truất quyền" },
]

export default function MobileOperator() {
    const [score, setScore] = useState<Round>(getDefaultRound())
    const businessLogicMenuRef = useRef<any>(null)
    const winCodePickerRef = useRef<any>(null)
    const settingsRef = useRef<any>(null)
    const testTimePickerRef = useRef<any>(null)
    const judgeNumberSelectorRef = useRef<any>(null)

    return (
        <div className="mobile-operator blue-red-container">
            <MobileSetting />

            {/* Menu chức năng nghiệp vụ */}
            <PopupOverlay ref={testTimePickerRef} background className="flex-center">
                <TimePicker title="Thời gian Hiệp 1" initTimeMs={1234} />
            </PopupOverlay>

            <PopupOverlay
                ref={businessLogicMenuRef}
                className="flex flex-col justify-end"
                background
            >
                <div className="flex flex-col justify-between w-full h-[80%] text-black bg-white rounded-t-[20px]">
                    <div
                        className="flex-center pt-[10px] pb-[20px]"
                        onClick={() => businessLogicMenuRef.current.setVisible(false)}
                    >
                        <div className="pill flex justify-between w-[50px] h-[7px] bg-[#00000080]" />
                    </div>

                    <div className="flex-1 flex flex-col gap-[20px] overflow-y-auto">
                        {/* Kết quả các hiệp */}
                        <div className="grid grid-cols-[6ch_6ch_6ch_1fr_1fr] place-items-center text-black gap-y-[5px]">
                            <div className="col-span-5 grid grid-cols-[1fr_auto_1fr] place-items-center gap-x-[10px]">
                                <div />
                                <span>Kết quả các hiệp đấu</span>
                                <EditI className="h-[15px] text-black" />
                            </div>

                            <span>Hiệp</span>
                            <span>Xanh</span>
                            <span>Đỏ</span>
                            <span>Thắng</span>
                            <span>Mã</span>

                            <div className="col-span-5 w-[calc(100%-20px)] h-[1px] bg-black" />

                            <span className="circle flex-center h-full bg-[gold] drop-shadow">1</span>
                            <span>12</span>
                            <span>12</span>
                            <div className="grid grid-cols-[1rem_auto_1rem] w-[8ch] text-[red]">
                                <span className="flex-center text-[0.8rem]">◀</span>
                                <span className="flex-center">Đỏ</span>
                                <span className="flex-center text-[0.8rem]">▶</span>
                            </div>
                            <div className="grid grid-cols-[auto_1rem] w-[6ch]" onClick={() => winCodePickerRef.current.setVisible(true)}>
                                <span className="flex-center">WIN</span>
                                <span className="flex-center text-[0.8rem]">▼</span>
                            </div>

                            <span className="circle flex-center h-full drop-shadow">2</span>
                            <span>12</span>
                            <span>12</span>
                            <div className="grid grid-cols-[1rem_auto_1rem] w-[8ch] text-[blue]">
                                <span className="flex-center text-[0.8rem]">◀</span>
                                <span className="flex-center">Xanh</span>
                                <span className="flex-center text-[0.8rem]">▶</span>
                            </div>
                            <div className="grid grid-cols-[auto_1rem] w-[6ch]">
                                <span className="flex-center">WIN</span>
                                <span className="flex-center text-[0.8rem]">▼</span>
                            </div>

                            <span className="circle flex-center h-full drop-shadow">3</span>
                            <span>12</span>
                            <span>12</span>
                            <div className="grid grid-cols-[1rem_auto_1rem] w-[8ch] text-[red]">
                                <span className="flex-center text-[0.8rem]">◀</span>
                                <span className="flex-center">Đỏ</span>
                                <span className="flex-center text-[0.8rem]">▶</span>
                            </div>
                            <div className="grid grid-cols-[auto_1rem] w-[6ch]">
                                <span className="flex-center">WIN</span>
                                <span className="flex-center text-[0.8rem]">▼</span>
                            </div>
                        </div>

                        {/* Kết quả trận */}
                        <div className="grid grid-cols-[6ch_6ch_6ch_1fr_1fr] place-items-center text-black gap-y-[5px]">
                            <div className="col-span-5 grid grid-cols-[1fr_auto_1fr] place-items-center gap-x-[10px]">
                                <div />
                                <span>Kết quả trận đấu</span>
                                <EditI className="h-[15px] text-black" />
                            </div>
                            <div />
                            <span>Xanh</span>
                            <span>Đỏ</span>
                            <span>Thắng</span>
                            <span>Mã</span>

                            <div className="col-span-5 w-[calc(100%-20px)] h-[1px] bg-black" />

                            <span>Tổng</span>
                            <span>1</span>
                            <span>2</span>
                            <div className="grid grid-cols-[1rem_auto_1rem] w-[8ch] text-[red]">
                                <span className="flex-center text-[0.8rem]">◀</span>
                                <span className="flex-center">Đỏ</span>
                                <span className="flex-center text-[0.8rem]">▶</span>
                            </div>
                            <div className="grid grid-cols-[auto_1rem] w-[6ch]">
                                <span className="flex-center">WIN</span>
                                <span className="flex-center text-[0.8rem]">▼</span>
                            </div>
                        </div>

                        <div className="flex flex-col p-[10px]">
                            <div className="grid grid-cols-[auto_auto] grid-rows-[auto_auto_auto_auto] w-[250px]">
                                <div className="col-span-2 flex items-center gap-[10px] p-[5px_15px] border-[1px] border-[gray] rounded-medium">
                                    <GoogleSheetI className="h-[1rem]" />
                                    <span>Google Sheet Link</span>
                                </div>
                                <div className="col-span-2 flex items-center p-[0px_10px] gap-[10px] text-[red]">
                                    <ExclamationI className="h-[1rem]" />
                                    <span>Không có quyền truy cập</span>
                                </div>
                                <span className="flex-center">SheetTab</span>
                                <div className="flex items-center  gap-[10px] p-[5px_15px] border-[1px] border-[gray] rounded-medium truncate">
                                    <span>SheetTab</span>
                                </div>
                                <div className="col-span-2 flex items-center p-[0px_10px] gap-[10px] text-[red]">
                                    <ExclamationI className="h-[1rem]" />
                                    <span>SheetTab không tồn tại</span>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-col">
                            <div className="flex">
                                <span>Trước</span>
                                <span>Tiếp</span>
                            </div>
                            <div className="grid grid-cols-[1fr_1fr]">
                                <span>Trận số</span>
                                <span>123</span>

                                <span>Hạng cân</span>
                                <span>Dưới 58KG</span>

                                <span>Giới tính</span>
                                <span>Nam</span>

                                <span>Đội xanh</span>
                                <span>CDU</span>

                                <span>Đội đỏ</span>
                                <span>CDU</span>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_1fr_1fr] w-full p-[15px] bg-white drop-shadow">
                        <div className="flex-center"><ZoomInI className="h-[1.2rem] text-[#00000080]" /></div>
                        <div />
                        <div className="flex-center"><NutI className="h-[1.2rem] text-[#00000080]" /></div>
                    </div>
                </div>
            </PopupOverlay >

            <PopupOverlay
                ref={winCodePickerRef}
                className="flex flex-col justify-end"
            >
                <Selector
                    title="Chọn WIN CODE Hiệp 1"
                    data={WIN_CODES}
                    value={"KO"}
                />
            </PopupOverlay>

            <PopupOverlay
                ref={judgeNumberSelectorRef}
                className="flex flex-col justify-end items-center gap-[20px]"
                z={1000}
                background
            >
                <button className="px-[20px] py-[10px] text-black bg-white rounded-medium">Xác nhận</button>
                <Selector
                    title="Số máy Giám định"
                    data={["3", "2", "1", "0"]}
                    value={"3"}
                />
            </PopupOverlay>

            {/* Thông tin VĐV, trận đấu */}
            < div className="match-info bg-darkBg" >
                <div className="flex">
                    <WifiI className="h-[0.7rem]" />
                    <span>20ms</span>
                    <span>Court: 1</span>
                </div>
                <div />
                <div className="flex justify-evenly">
                    <JudgeI className="w-[0.7rem]" />
                    <JudgeI className="w-[0.7rem]" />
                    <JudgeI className="w-[0.7rem]" />
                </div>
                <div className="col-span-3 flex-center">
                    Chung kết - Dưới 54KG - Nam - Đối tượng 2
                </div>
                {/* <div className="flex max-w-full text-[#ffffff80] truncate">VẬN ĐỘNG VIÊN XANH</div>
                <div className="flex-center">TRẬN 123</div>
                <div className="flex justify-end max-w-full text-[#ffffff80] truncate">VẬN ĐỘNG VIÊN ĐỎ</div> */}
            </div >

            {/* Điểm số lớn, đồng hồ, điều khiển đồng hồ */}
            < div className="score-clock-container" >

                {/* Ghi nhận thắng các hiệp */}
                < div className="won" >
                    <span className="text-caption opacity-medium leading-none">THẮNG</span>
                    <div className="circle h-[0.6rem] bg-white opacity-medium"></div>
                    <div className="circle h-[0.6rem] bg-white opacity-medium"></div>
                </div >
                <div />
                <div className="won flex-row-reverse">
                    <span className="text-caption opacity-medium leading-none">THẮNG</span>
                    <div className="circle h-[0.6rem] bg-white opacity-medium"></div>
                    <div className="circle h-[0.6rem] bg-white opacity-medium"></div>
                </div>

                {/* Điểm lớn xanh */}
                <div className="score blue">
                    <div className="flex justify-evenly items-center">
                        {/* <div className="circle flex-center h-[1.2rem] font-bold text-black bg-white">3</div>
                        <div className="circle flex-center h-[1.2rem] font-bold text-black bg-white">3</div>
                        <div className="circle flex-center h-[1.2rem] font-bold text-black bg-white">3</div> */}
                    </div>
                    <span className="text-largeScore place-self-center leading-none">20</span>
                    <div className="flex-center"><CameraOffI className="small-icon text-white" /></div>
                </div>

                {/* Đồng hồ */}
                <div className="clock" onClick={() => testTimePickerRef.current.setVisible(true)}>
                    <div className="place-self-center">HIỆP 1</div>
                    <div className="flex-center text-[2.5rem] border-[3px] border-[gold] leading-none">2:00</div>
                    <div className="flex-center text-[black] font-bold bg-[gold]">ĐANG CHẠY</div>
                </div>

                {/* Điểm lớn đỏ */}
                <div className="score red">
                    <div className="flex justify-evenly items-center">
                        {/* <div className="circle flex-center h-[1.2rem] font-bold text-black bg-white">3</div>
                        <div className="circle flex-center h-[1.2rem] font-bold text-black bg-white">3</div>
                        <div className="circle flex-center h-[1.2rem] font-bold text-black bg-white">3</div> */}
                    </div>
                    <span className="text-largeScore place-self-center leading-none">20</span>
                    <div className="flex-center"><CameraI className="small-icon text-white" /></div>
                </div>

                {/* Bảng điều khiển đồng hồ */}
                <div className="col-span-3 grid grid-cols-[1fr_1fr_1fr] p-[10px] bg-surface rounded-[20px]">
                    <div className="flex-center flex-col w-full px-[10px] font-bold text-[0.8rem]">
                        <span>Chế độ</span>
                        <div className="grid grid-cols-[auto_1rem] w-full bg-[#ffffff80] px-[5px] py-[2px] text-[gray] rounded-[10px]">
                            <span className="flex-center truncate">Thi đấu</span>
                            <span className="flex-center">▼</span>
                        </div>
                    </div>
                    <div className="flex-center">
                        <button className="flex-center min-w-[4rem] w-full h-[3.5rem] text-black bg-white rounded-[20px] drop-shadow">Dừng lại</button>
                    </div>
                    <div className="flex flex-col justify-between items-center text-[gray] text-[0.8rem] font-bold">
                        <div className="grid grid-cols-[1fr_1fr_auto] place-items-center bg-[#ffffff80] px-[7px] py-[2px] rounded-[10px]">
                            <span>Hiệp:</span>
                            <span>2:00</span>
                            <EditI className="h-[1rem]" />
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_auto] place-items-center bg-[#ffffff80] px-[7px] py-[2px] rounded-[10px]">
                            <span>Nghỉ:</span>
                            <span>1:00</span>
                            <EditI className="h-[1rem]" />
                        </div>
                    </div>
                </div>
            </div >

            {/* Các nút bấm chỉnh sửa điểm */}
            < div className="flex justify-around w-full" >
                <div className="flex flex-col gap-[10px]">
                    <div className="pb-[10px]">
                        <PointEditor
                            className="external-point-editor gj blue"
                            icon={<span className="text-[80%]">GJ</span>}
                            iconColor="#187BCD"
                        >
                            <span className="text-[gold]">0</span>
                        </PointEditor>
                    </div>
                    {POINT_EDITORS.map(v =>
                        <PointEditor
                            className="external-point-editor blue"
                            key={v.key}
                            icon={v.icon}
                            iconColor="#187BCD"
                        >
                            <span>{score["blue"][v.key]}</span>
                        </PointEditor>)}
                </div>
                <div className="flex flex-col gap-[10px]">
                    <div className="pb-[10px]">
                        <PointEditor
                            className="external-point-editor gj red"
                            icon={<span className="text-[80%]">GJ</span>}
                            iconColor="#FE3939"
                        >
                            <span className="text-[gold]">0</span>
                        </PointEditor>
                    </div>
                    {POINT_EDITORS.map(v =>
                        <PointEditor
                            className="external-point-editor red"
                            key={v.key}
                            icon={v.icon}
                            iconColor="#FE3939"
                        >
                            <span>{score["red"][v.key]}</span>
                        </PointEditor>)}
                </div>
            </div >

            {/* Thanh công cụ, điều hướng */}
            < div className="grid grid-cols-[1fr_1fr_1fr] w-full p-[15px] bg-darkBg" >
                <div className="flex-center"><ZoomInI className="h-[1.2rem]" /></div>
                <div
                    className="flex justify-center items-start"
                    onClick={() => businessLogicMenuRef.current.setVisible(true)}
                >
                    <div className="pill flex justify-between w-[50px] h-[7px] bg-surface" />
                </div>
                <div className="flex-center" onClick={() => settingsRef.current.setVisible(true)}><NutI className="h-[1.2rem]" /></div>
            </div >
        </div >
    )
}