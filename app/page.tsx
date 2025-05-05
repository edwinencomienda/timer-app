"use client"
import { Timer } from "@/components/timer"
import { Card, CardContent } from "@/components/ui/card"

export default function TimerApp() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-3xl font-bold mb-8">Dual Timer App</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <Timer id="timer1" label="Timer" />
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <Timer id="timer2" label="Break" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
