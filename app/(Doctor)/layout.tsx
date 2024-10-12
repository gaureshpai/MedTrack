import type { Metadata } from "next";
import "@/public/globals.css";

export const metadata: Metadata = {
  title: "Ayuuvikas | Doctor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='bg-black'
      >
        {children}
      </body>
    </html>
  );
}
