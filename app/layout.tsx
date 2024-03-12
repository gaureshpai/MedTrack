import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
    title: "Gajanana Stores",
    description: "This website is developed by Gauresh",
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
                <div>
                    <Navbar/>
                    {children}
                    <Footer/>
                </div>
            </body>
        </html>
    );
}
