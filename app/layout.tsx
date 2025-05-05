import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "Timer App",
    description: "Timer App",
    generator: "Edwin Encomienda",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
