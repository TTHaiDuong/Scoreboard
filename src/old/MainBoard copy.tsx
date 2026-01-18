// "use client"

// import { useEffect, useRef, useState } from "react"
// import Point, { PointRef } from "./Point"
// import Stopwatch, { StopwatchRef } from "./Stopwatch"
// import Name from "./Name"
// import PointLog, { PointLogRef } from "./PointLog"
// import PointLogList from "./PointLogList"
// import TextLabel from "./TextLabel"
// import AutoFitText from "./AutoFitText"
// import Image from "next/image"
// import { StaticImport } from "next/dist/shared/lib/get-img-props"
// import VietNamFlag from "../assets/flag-of-vietnam.png"

// export default function MainBoard() {
//     const stopwatchRef = useRef<StopwatchRef>(null)
//     const [redFlag, setRedFlag] = useState<string | StaticImport>(VietNamFlag)
//     const [blueFlag, setBlueFlag] = useState<string | StaticImport>(VietNamFlag)
//     const redPointRef = useRef<PointRef>(null)
//     const bluePointRef = useRef<PointRef>(null)
//     const pointLogRef = useRef<PointLogRef>(null)
//     const containerRef = useRef<HTMLDivElement>(null)
//     const [minSize, setMinSize] = useState<number>(0)

//     useEffect(() => {
//         redPointRef.current?.setPoint(25)

//         setTimeout(() => pointLogRef?.current?.removeUnnecessary(), 1000)
//     }, [])

//     const onStart = () => {
//         stopwatchRef.current?.start()
//     }

//     const onPause = () => {
//         stopwatchRef.current?.pause()
//     }

//     const onReset = () => {
//         stopwatchRef?.current?.reset()
//     }

//     const onTimeOut = () => {
//         new Notification("Ứng dụng đang cần bạn!", {
//             body: "Nhấp vào đây để quay lại ứng dụng.",
//             requireInteraction: true,
//         })
//     }

//     useEffect(() => {
//         const container = containerRef.current
//         if (!container) return

//         const observer = new ResizeObserver(() => {
//             const width = container.clientWidth
//             const height = container.clientHeight
//             const min = Math.min(width, height)
//             setMinSize(min)
//         })
//         observer.observe(container)

//         return () => { observer.disconnect() }
//     }, [containerRef.current])

//     return (
//         <div ref={containerRef} className="relative flex w-screen h-screen">
//             {/* Nền nửa đỏ, nửa xanh */}
//             <div className="w-1/2 h-full bg-[#cc0000]" />
//             <div className="w-1/2 h-full bg-[#1155cc]" />

//             {/* <div className="absolute z-10">
//                 <div onClick={onStart} className="text-[30px]">Start</div>
//                 <div onClick={onPause} className="text-[30px]">Pause</div>
//                 <div onClick={onReset} className="text-[30px]">Reset</div>
//             </div> */}

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
//                 {/* Dải đen trên cùng, thông tin trận */}
//                 <div className="flex-center w-full h-[8%] bg-black">
//                     <AutoFitText
//                         className="w-[70%] h-[48%] font-bold text-white"
//                     >
//                         SÂN 1 - CHUNG KẾT - 68KG-NAM
//                     </AutoFitText>
//                 </div>

//                 <div className="flex w-full h-[92%]">

//                     {/* Container đỏ */}
//                     <div className="w-[42%] h-full">
//                         <div className="flex w-full h-[82%]">
//                             <div className="w-[24%] h-full">
//                                 <div
//                                     className="flex-center w-full h-[17%]"
//                                 >
//                                     {redFlag && <Image
//                                         src={redFlag}
//                                         alt="Red Flag"
//                                         className="object-contain aspect-[1/1]"
//                                         style={{ height: `${minSize * 0.1}px` }}
//                                     />}
//                                 </div>
//                                 <div className="flex-center flex-col gap-[10%] w-full h-[83%]">
//                                     <AutoFitText
//                                         virtualText={"A".repeat(3)}
//                                         className="w-[70%] h-[8%] font-bold text-white"
//                                     >
//                                         VIE
//                                     </AutoFitText>
//                                     <PointLogList
//                                         buttonSize={`${minSize * 0.025}px`}
//                                         buttonGap={`${minSize * 0.005}px`}
//                                         iconGap={`${minSize * 0.01}px`}
//                                         gap={`${minSize * 0.02}px`}
//                                         maxSize="80%"
//                                         direction="right-to-left"
//                                         isBlue
//                                     />
//                                 </div>
//                             </div>

//                             {/* Thành phần điểm */}
//                             <div className="flex-center flex-col w-[76%] h-full">
//                                 <AutoFitText
//                                     virtualText={"A".repeat(10)}
//                                     className="w-[40%] h-[17%] font-bold"
//                                 >
//                                     TRẦN HẢI DƯƠNG
//                                 </AutoFitText>
//                                 <Point
//                                     ref={redPointRef}
//                                     className="w-full h-[83%] select-none"
//                                 />
//                             </div>
//                         </div>

//                         {/* Gam-jeom, won */}
//                         <div className="flex justify-between items-center w-full h-[18%]">
//                             <TextLabel
//                                 className="w-[25%] h-[70%] select-none"
//                                 title="GAM-JEOM"
//                                 titleClassName="w-full h-[22%] text-white font-bold"
//                                 content={0}
//                                 contentClassName="w-full h-[70%] text-white font-bold"
//                             />
//                             <TextLabel
//                                 className="w-[25%] h-[70%] select-none"
//                                 title="WON"
//                                 titleVirtualText="GAM-JEOM"
//                                 titleClassName="w-full h-[22%] text-white font-bold"
//                                 content={0}
//                                 contentClassName="w-full h-[70%] text-white font-bold"
//                             />
//                         </div>
//                     </div>

//                     {/* Dải đen giữa, match, time, round */}
//                     <div className="flex justify-center items-end w-[16%] h-full">
//                         <div className="flex flex-col justify-around items-center w-full h-[86%] bg-black">
//                             <TextLabel
//                                 className="w-[80%] h-[10%] select-none"
//                                 title="MATCH"
//                                 titleClassName="text-white font-bold w-full h-[35%]"
//                                 content={123}
//                                 contentClassName="text-white font-bold w-full h-[55%]"
//                             />
//                             <Stopwatch
//                                 ref={stopwatchRef}
//                                 initTime={15 * 1000}
//                                 contentScale={0.8}
//                                 className="w-full h-[25%]"
//                             />
//                             <TextLabel
//                                 className="w-[80%] h-[20%] select-none"
//                                 title="ROUND"
//                                 titleClassName="text-white font-bold w-full h-[20%]"
//                                 content={2}
//                                 contentClassName="text-white font-bold w-full h-[75%]"
//                             />
//                         </div>
//                     </div>

//                     {/* Thông tin đội xanh */}
//                     <div className="w-[42%] h-full flex flex-col justify-around items-center">
//                         <div className="w-full h-[14%] flex justify-around items-center">
//                             <AutoFitText virtualText={"A".repeat(12)} className="font-bold w-[55%] h-[30%]">TRẦN HẢI DƯƠNG</AutoFitText>
//                             <div
//                                 className="aspect-[1/1]"
//                                 style={{ height: `${minSize * 0.15}px` }}
//                             >
//                                 {redFlag && <Image src={redFlag} alt="Red Flag" className="object-contain w-full h-full" />}
//                             </div>
//                         </div>

//                         {/* Thành phần điểm */}
//                         <div className="flex justify-start gap-[5%] w-full h-[66%]">
//                             <Point
//                                 isBlue
//                                 className="w-[70%] h-full select-none"
//                             />
//                             <div className="w-[20%] h-full flex-center select-none">
//                                 <PointLogList
//                                     buttonSize={`${minSize * 0.025}px`}
//                                     buttonGap={`${minSize * 0.005}px`}
//                                     iconGap={`${minSize * 0.01}px`}
//                                     gap={`${minSize * 0.02}px`}
//                                     maxSize="90%"
//                                 />
//                             </div>
//                         </div>

//                         {/* Gam-jeom, won */}
//                         <div className="w-full h-[20%] flex justify-between items-center">
//                             <TextLabel
//                                 titleVirtualText="GAM-JEOM"
//                                 className="w-[30%] h-[70%] select-none"
//                                 title="WON"
//                                 titleClassName="text-white font-bold w-full h-[22%]"
//                                 content={0}
//                                 contentClassName="text-white font-bold w-full h-[70%]"
//                             />
//                             <TextLabel
//                                 className="w-[30%] h-[70%] select-none"
//                                 title="GAM-JEOM"
//                                 titleClassName="text-white font-bold w-full h-[22%]"
//                                 content={0}
//                                 contentClassName="text-white font-bold w-full h-[70%]"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }