import type { Metadata } from "next";
import "@/public/globals.css";
import GovtNavbar from "@/components/(Govt)/GovtNavbar";
import GovtFooter from "@/components/(Govt)/GovtFooter";

export const metadata: Metadata = {
  title: "Ayuuvikas | Government",
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
        <GovtNavbar/>
          {children}
        <GovtFooter/>
      </body>
    </html>
  );
}