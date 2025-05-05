"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pause, Play, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface TimerProps {
    id: string
    label: string
}

export function Timer({ id, label }: TimerProps) {
    const [hours, setHours] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)

    const preloadAudio = () => {
        if (audioRef.current) {
            audioRef.current.load()
        }
    }

    // Initialize audio element
    useEffect(() => {
        // Create audio element with proper error handling
        const audio = new Audio()
        audio.src = "/notify.mp3"
        audio.loop = true

        // Add error handling
        audio.addEventListener("error", (e) => {
            console.error("Audio error:", e)
            console.error("Audio error code:", audio.error?.code)
            console.error("Audio error message:", audio.error?.message)
        })

        // Add load handling to verify the audio is loaded
        audio.addEventListener("canplaythrough", () => {
            console.log("Audio loaded successfully")
        })

        // Store the audio element in the ref
        audioRef.current = audio

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.src = ""
                audioRef.current = null
            }
        }
    }, [])

    // Set initial time when hours, minutes, or seconds change
    useEffect(() => {
        if (!isRunning) {
            const totalSeconds = hours * 3600 + minutes * 60 + seconds
            setTimeLeft(totalSeconds)
        }

        if (hours) {
            localStorage.setItem(`${id}-hours`, hours.toString())
        }
        if (minutes) {
            localStorage.setItem(`${id}-minutes`, minutes.toString())
        }
        if (seconds) {
            localStorage.setItem(`${id}-seconds`, seconds.toString())
        }
    }, [hours, minutes, seconds, isRunning])

    useEffect(() => {
        const storedHours = localStorage.getItem(`${id}-hours`)
        const storedMinutes = localStorage.getItem(`${id}-minutes`)
        const storedSeconds = localStorage.getItem(`${id}-seconds`)
        console.log(storedMinutes, `${id}-minutes`)

        if (storedHours) {
            setHours(Number(storedHours))
        }
        if (storedMinutes) {
            setMinutes(Number(storedMinutes))
        }
        if (storedSeconds) {
            setSeconds(Number(storedSeconds))
        }
    }, [])

    // Timer countdown logic
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        if (interval) clearInterval(interval)
                        setIsRunning(false)
                        // Play sound when timer reaches zero
                        if (audioRef.current) {
                            try {
                                audioRef.current.currentTime = 0
                                const playPromise = audioRef.current.play()

                                if (playPromise !== undefined) {
                                    playPromise
                                        .then(() => {
                                            console.log(
                                                "Audio playing successfully"
                                            )
                                            setShowModal(true)
                                        })
                                        .catch((e) => {
                                            console.error(
                                                "Error playing sound:",
                                                e
                                            )
                                            // Still show the modal even if sound fails
                                            setShowModal(true)
                                        })
                                } else {
                                    setShowModal(true)
                                }
                            } catch (e) {
                                console.error("Exception playing sound:", e)
                                setShowModal(true)
                            }
                        }
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        } else if (timeLeft === 0) {
            setIsRunning(false)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, timeLeft])

    // Format time for display
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60

        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    // Handle input changes
    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value) || 0
        setHours(Math.max(0, Math.min(99, value)))
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value) || 0
        setMinutes(Math.max(0, Math.min(59, value)))
    }

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value) || 0
        setSeconds(Math.max(0, Math.min(59, value)))
    }

    // Timer controls
    const startTimer = () => {
        if (timeLeft > 0) {
            setIsRunning(true)
        }
    }

    const pauseTimer = () => {
        setIsRunning(false)
    }

    const resetTimer = () => {
        setIsRunning(false)
        setTimeLeft(hours * 3600 + minutes * 60 + seconds)
    }

    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
        setShowModal(false)
    }

    useEffect(() => {
        preloadAudio()
    }, [])

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">{label}</h2>

            {/* Timer Display */}
            <div className="text-6xl font-bold mb-6 font-mono tabular-nums">
                {formatTime(timeLeft)}
            </div>

            {/* Time Input */}
            <div className="grid grid-cols-3 gap-2 mb-6 w-full">
                <div>
                    <Label htmlFor={`${id}-hours`}>Hours</Label>
                    <Input
                        id={`${id}-hours`}
                        type="number"
                        min="0"
                        max="99"
                        value={hours}
                        onChange={handleHoursChange}
                        disabled={isRunning}
                        className="text-center"
                    />
                </div>
                <div>
                    <Label htmlFor={`${id}-minutes`}>Minutes</Label>
                    <Input
                        id={`${id}-minutes`}
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={handleMinutesChange}
                        disabled={isRunning}
                        className="text-center"
                    />
                </div>
                <div>
                    <Label htmlFor={`${id}-seconds`}>Seconds</Label>
                    <Input
                        id={`${id}-seconds`}
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        onChange={handleSecondsChange}
                        disabled={isRunning}
                        className="text-center"
                    />
                </div>
            </div>

            {/* Timer Controls */}
            <div className="flex space-x-2">
                {!isRunning ? (
                    <Button onClick={startTimer} disabled={timeLeft === 0}>
                        <Play className="mr-2 h-4 w-4" />
                        Start
                    </Button>
                ) : (
                    <Button onClick={pauseTimer} variant="outline">
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                    </Button>
                )}
                <Button onClick={resetTimer} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>
            {/* Alarm Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Time's Up!</h2>
                        <p className="mb-6">{label} has finished.</p>
                        <div className="flex justify-end">
                            <Button onClick={stopAlarm} variant="destructive">
                                Stop Alarm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
