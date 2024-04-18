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
      <script
        defer
        src="https://analytics.us.umami.is/script.js"
        data-website-id="649733d0-9231-4701-80e6-b59f51783b5c"
      ></script>
    </html>
  );
}
