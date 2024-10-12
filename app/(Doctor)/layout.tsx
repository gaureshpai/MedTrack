import type { Metadata } from "next";
import "@/public/globals.css";
import DoctorNavbar from "@/components/(Doctor)/DoctorNavbar";
import DoctorFooter from "@/components/(Doctor)/DoctorFooter";

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
      <body className='bg-black'
      >
        <DoctorNavbar/>
          {children}
        <DoctorFooter/>
      </body>
    </html>
  );
}