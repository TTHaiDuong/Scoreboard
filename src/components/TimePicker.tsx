import "@/styles/time-picker.css"
import { Swiper, SwiperSlide } from "swiper/react"
import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { FreeMode, Scrollbar, Mousewheel } from 'swiper/modules';

export default function TimePicker(props: {
    title?: string
    timeMs: number
    onSubmit?: (ms?: number) => void
}) {
    const [isActive, setActive] = useState<boolean>()
    const daMinuteRef = useRef<any>(null)
    const minuteRef = useRef<any>(null)
    const daSecondRef = useRef<any>(null)
    const secondRef = useRef<any>(null)
    const dSecondRef = useRef<any>(null)
    const cSecondRef = useRef<any>(null)

    useEffect(() => {
        const totalMin = Math.floor(props.timeMs / 1000 / 60)
        const daM = Math.floor(totalMin / 10)
        const uM = totalMin % 10

        const totalSec = Math.floor(props.timeMs / 1000) % 60
        const daS = Math.floor(totalSec / 10)
        const uS = totalSec % 10

        const totalCSec = props.timeMs % (60 * 1000)
        const dS = Math.floor(totalCSec / 10)
        const cS = totalCSec % 10

        daMinuteRef.current?.setValue(daM)
        minuteRef.current?.setValue(uM)
        daSecondRef.current?.setValue(daS)
        secondRef.current?.setValue(uS)
        dSecondRef.current?.setValue(dS)
        cSecondRef.current?.setValue(cS)
    }, [props.timeMs])

    function getTotalMs() {
        const daM = daMinuteRef.current ? daMinuteRef.current.getValue() : 0
        const m = minuteRef.current ? minuteRef.current.getValue() : 0
        const daS = daSecondRef.current ? daSecondRef.current.getValue() : 0
        const s = secondRef.current ? secondRef.current.getValue() : 0
        const dS = dSecondRef.current ? dSecondRef.current.getValue() : 0
        const cs = cSecondRef.current ? cSecondRef.current.getValue() : 0

        const total = (daM * 10 + m) * 60 * 1000 + (daS * 10 + s) * 1000 + dS * 100 + cs * 10
        console.log(total)
        return total
    }

    return (
        <div className="timer-picker">
            <div className="title">{props.title}</div>

            {/* Các nút chuyển swiper */}
            <div className="column-2swiper">
                <div className="btn" onClick={() => daMinuteRef.current?.prev()}>▴</div>
                <div className="btn" onClick={() => minuteRef.current?.prev()}>▴</div>
            </div>
            <div></div>
            <div className="column-2swiper">
                <div className="btn" onClick={() => daSecondRef.current?.prev()}>▴</div>
                <div className="btn" onClick={() => secondRef.current?.prev()}>▴</div>
            </div>
            <div></div>
            <div className="column-2swiper">
                <div className="btn" onClick={() => dSecondRef.current?.prev()}>▴</div>
                <div className="btn" onClick={() => cSecondRef.current?.prev()}>▴</div>
            </div>

            <div className="line"></div>

            {/* Các swiper */}
            <div className="column-2swiper">
                <NumberPicker ref={daMinuteRef} numbers={Array.from({ length: 10 }, (_, i) => i)} />
                <NumberPicker ref={minuteRef} numbers={Array.from({ length: 10 }, (_, i) => i)} />
            </div>
            <span className="unit">phút</span>
            <div className="column-2swiper">
                <NumberPicker ref={daSecondRef} numbers={Array.from({ length: 6 }, (_, i) => i)} />
                <NumberPicker ref={secondRef} numbers={Array.from({ length: 10 }, (_, i) => i)} />
            </div>
            <span className="unit">giây</span>
            <div className="column-2swiper">
                <NumberPicker ref={dSecondRef} numbers={Array.from({ length: 10 }, (_, i) => i)} />
                <NumberPicker ref={cSecondRef} numbers={Array.from({ length: 10 }, (_, i) => i)} />
            </div>

            <div className="line"></div>

            {/* Các nút chuyển swiper */}
            <div className="column-2swiper">
                <div className="btn" onClick={() => daMinuteRef.current?.next()}>▾</div>
                <div className="btn" onClick={() => minuteRef.current?.next()}>▾</div>
            </div>
            <div></div>
            <div className="column-2swiper">
                <div className="btn" onClick={() => daSecondRef.current?.next()}>▾</div>
                <div className="btn" onClick={() => secondRef.current?.next()}>▾</div>
            </div>
            <div></div>
            <div className="column-2swiper">
                <div className="btn" onClick={() => dSecondRef.current?.next()}>▾</div>
                <div className="btn" onClick={() => cSecondRef.current?.next()}>▾</div>
            </div>

            <div className="submit">
                <div className="submit-btn" onClick={() => props.onSubmit?.(getTotalMs())}>✓</div>
                <div className="line"></div>
                <div className="submit-btn" onClick={() => props.onSubmit?.()}>✕</div>
            </div>
        </div >
    )
}

function createWheelData(base: number[], repeat = 20) {
    return Array.from({ length: repeat }, () => base).flat()
}

const NumberPicker = forwardRef(function NumberPicker(props: {
    numbers: number[]
    onChange?: (value: number) => void
}, ref) {
    const base = props.numbers
    const data = createWheelData(base, 20)
    const swiperRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
        next() {
            swiperRef.current?.slideTo(
                swiperRef.current.activeIndex + 1,
                120
            )
        },
        prev() {
            swiperRef.current?.slideTo(
                swiperRef.current.activeIndex - 1,
                120
            )
        },
        setValue(value: number, speed = 0) {
            if (!swiperRef.current) return

            const len = props.numbers.length
            const baseIndex = props.numbers.indexOf(value)
            if (baseIndex === -1) return

            const center = Math.floor(data.length / 2)
            const targetIndex = center + baseIndex

            swiperRef.current.slideTo(targetIndex, speed)
        },
        getValue() {
            if (!swiperRef.current) return null

            const len = props.numbers.length
            const index = swiperRef.current.activeIndex
            return props.numbers[
                ((index % len) + len) % len
            ]
        }
    }), [props.numbers, data.length])

    function handleMouseDown() {
        if (!swiperRef.current) return
        swiperRef.current.mousewheel = {
            forceToAxis: true,
            sensitivity: 1,
            thresholdDelta: 1,
            thresholdTime: 0,
        }
    }

    function handleMouseUp() {

    }

    return (
        <Swiper
            onSwiper={(swiper) => {
                swiperRef.current = swiper
            }}
            direction="vertical"
            slidesPerView={3}
            centeredSlides
            spaceBetween={10}
            freeMode={{
                enabled: true,
                momentum: true,
                // momentumRatio: 0.25,
                momentumVelocityRatio: 0.25,
                // momentumBounce: false,
                sticky: true
            }}
            pagination={{
                clickable: true,
            }}
            mousewheel={{
                releaseOnEdges: false,
                sensitivity: 0.5,
            }}
            loop
            resistance={false}
            initialSlide={Math.floor(data.length / 2)}

            preventClicks={false}
            preventClicksPropagation={false}

            modules={[FreeMode, Mousewheel]}
            className="number-picker"

            onTransitionEnd={(swiper) => {
                const len = props.numbers.length
                const total = swiper.slides.length
                const index = swiper.activeIndex

                // nếu lệch quá xa trung tâm → reset không animation
                if (index < len || index > total - len) {
                    const normalized = Math.floor(data.length / 2) + (index % len)
                    swiper.slideTo(normalized, 0) // 0ms, user không nhận ra
                }
            }}

            onSlideChange={(swiper) => {
                const len = props.numbers.length
                const value = props.numbers[
                    ((swiper.activeIndex % len) + len) % len
                ]
                props.onChange?.(value)
            }}
        >
            {data.map((n, idx) => (
                <SwiperSlide key={idx}>
                    <div className="picker-item">
                        {n}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
})