import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import  Console  from "./components/console";
import "@/public/styles/globals.css"

export const metadata: Metadata = {
    title: "Mini Project",
    description: "This website is developed by the mini project group 8",
    icons: {
        icon: [
            'favicon.ico?v=4',
        ],
        apple: [
            'apple-touch-icon.png?v=4',
        ],
        shortcut: [
            'apple-touch-icon.png?v'
        ]
    },
    manifest: '/site.webmanifest'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <div className="maincontainer">
                    <Navbar />
                    {children}
                    <Console />
                </div>
            </body>
        </html>
    );
}