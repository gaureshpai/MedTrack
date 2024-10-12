import type { Metadata } from "next";
import "@/public/globals.css";
import AdminNavbar from "@/components/(admin)/AdminNavbar";
import AdminFooter from "@/components/(admin)/AdminFooter";

export const metadata: Metadata = {
  title: "Ayuuvikas | Admin",
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
        <AdminNavbar/>
          {children}
        <AdminFooter/>
      </body>
    </html>
  );
}