import type { Metadata } from "next";
import "@/public/globals.css";
import Navbar from "@/components/(common)/Navbar";
import Footer from "@/components/(common)/Footer";

export const metadata: Metadata = {
  title: "Ayuuvikas | User",
  description: "Miniproject - Major project by Jnanesh, Gauresh, Milan and himanshu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='bg-black'
      >
        <Navbar/>
          {children}
        <Footer/>
      </body>
    </html>
  );
}