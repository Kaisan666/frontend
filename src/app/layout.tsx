import type { Metadata } from "next";
import { Header } from "@/components/header";
import "@/styles/fonts.scss";
import "@/styles/index.scss";
import "@/styles/_reset.scss"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Header></Header>
        {children}
      </body>
    </html>
  );
}
