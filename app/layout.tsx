"use client";
import "./globals.css";
import Navbar from "./components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" md:border-green-500 border-yellow-500 lg:border-purple-500 xl:border-sky-500">
        <Navbar />
        <>{children}</>
      </body>
    </html>
  );
}
