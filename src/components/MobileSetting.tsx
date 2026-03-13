import { ReactNode, useRef, useState } from "react"
import XSignI from "@/assets/x-sign.svg"
import Switch from "./Switch"
import ChainI from "@/assets/chain.svg"
import ArrowI from "@/assets/arrow.svg"

export default function MobileSetting(props: {
    onHeaderClick?: () => void
}) {

    return (
        <div className="fixed flex flex-col justify-between w-full h-full text-black bg-white z-[100]">
            <div
                className="w-full px-[15px]"
                onClick={props.onHeaderClick}
            >
                Cài đặt
            </div>

            {/* Thân settings */}
            <div className="flex-1 flex flex-col gap-[20px] p-[10px] overflow-y-auto">
                <SettingGroup title="Kết nối & Thiết bị">
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-[10px] items-center">
                        <span>Mã bảng điểm</span>
                        <div className="flex-center bg-white rounded">1</div>
                        <ArrowI className="h-[10px] -rotate-90" />

                        <span>Kết nối Giám định</span>
                        <div className="flex-center bg-white rounded">2/3</div>
                        <ArrowI className="h-[10px] -rotate-90" />

                        <span>Kênh hiển thị</span>
                        <div className="flex-center bg-white rounded">2/3</div>
                        <ArrowI className="h-[10px] -rotate-90" />

                        {/* <span>Giám định 1</span>
                        <span>123456</span>
                        <XSignI className="h-[1.5rem]" />

                        <span>Giám định 2</span>
                        <span>123456</span>
                        <XSignI className="h-[1.5rem]" />

                        <span>Giám định 3</span>
                        <span>123456</span>
                        <XSignI className="h-[1.5rem]" /> */}
                    </div>
                </SettingGroup>

                <SettingGroup title="Luật thi đấu">
                    <div className="grid grid-cols-[1fr_auto_100px_auto] gap-[10px] items-center">
                        <span>Gam-jeom</span>
                        <ChainI className="h-[1rem]" />
                        <input type="number" className="flex-center w-full" value={5} readOnly />
                        <div />

                        <span>Điểm cách biệt</span>
                        <ChainI className="h-[1rem]" />
                        <input type="number" className="flex-center w-full" value={12} readOnly />
                        <Switch />

                    </div>
                </SettingGroup>

                <SettingGroup title="Thời gian">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-[10px] items-center">
                        <span>Hiệp đấu</span>
                        <ChainI className="h-[1rem]" />
                        <span className="flex-center bg-white rounded">1 phút 30 giây</span>

                        <span>Giải lao</span>
                        <ChainI className="h-[1rem]" />
                        <span className="flex-center bg-white rounded">1 phút</span>

                        <span>Điều trị (Kye-shi)</span>
                        <ChainI className="h-[1rem]" />
                        <span className="flex-center bg-white rounded">1 phút</span>
                    </div>
                </SettingGroup>

                {/* <SettingGroup title="Giám định">
                    <div className="grid grid-cols-[auto_100px] gap-[10px] items-center">
                        <span>Số máy Giám định</span>
                        <span
                            className="flex-center w-full h-full"
                        // onClick={() => judgeNumberSelectorRef.current.setVisible(true)}
                        >3</span>

                        <span>Ngưỡng bình chọn</span>
                        <input type="number" className="flex-center w-full" value={2} readOnly />

                        <span>Thời gian chờ bình chọn</span>
                        <span>1000 mili giây</span>

                        <span>Thời gian chờ nhấn tổ hợp</span>
                        <span>1000 mili giây</span>
                    </div>
                </SettingGroup> */}

                <SettingGroup title="Hỗ trợ">
                    <div className="grid grid-cols-[1fr_auto] gap-[10px] items-center">
                        <span>Tự động giải lao khi hết giờ</span>
                        <Switch className="self-center" />
                    </div>
                </SettingGroup>
            </div>
        </div>
    )
}

function SettingGroup(props: {
    title: string
    children: ReactNode
}) {
    return (
        <div className="flex flex-col">
            <span className="px-[20px] text-gray-500">{props.title}</span>
            <div className="p-[20px] bg-gray-100 rounded-medium">
                {props.children}
            </div>
        </div>
    )
}