import type { Metadata } from "next";
import { Header } from "@/components/header";
import "@/styles/index.scss";
import "@/styles/_reset.scss"

import localFont from 'next/font/local'
import { Footer } from "@/components/footer";

const openSans = localFont({
  src: [
    { path: './fonts/OpenSans/OpenSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/OpenSans/OpenSans-Italic.woff2',  weight: '400', style: 'italic' },
    { path: './fonts/OpenSans/OpenSans-Light.woff2',   weight: '300', style: 'normal' },
    { path: './fonts/OpenSans/OpenSans-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './fonts/OpenSans/OpenSans-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: './fonts/OpenSans/OpenSans-Bold.woff2',    weight: '700', style: 'normal' },
    { path: './fonts/OpenSans/OpenSans-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans',
  display: 'swap', adjustFontFallback: false
})

const openSansCondensed = localFont({
  src: [
    { path: './fonts/OpenSans/OpenSansCondensed-Light.woff2',   weight: '300', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansCondensed-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansCondensed-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansCondensed-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansCondensed-Bold.woff2',    weight: '700', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansCondensed-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans-condensed',
  display: 'swap', adjustFontFallback: false
})

const openSansSemiCondensed = localFont({
  src: [
    { path: './fonts/OpenSans/OpenSansSemiCondensed-Light.woff2',   weight: '300', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansSemiCondensed-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansSemiCondensed-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansSemiCondensed-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansSemiCondensed-Bold.woff2',    weight: '700', style: 'normal' },
    { path: './fonts/OpenSans/OpenSansSemiCondensed-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans-semi-condensed',
  display: 'swap', adjustFontFallback: false
})





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${openSansCondensed.variable}`}>
      <body>
      <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
