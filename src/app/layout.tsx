import type { Metadata } from "next";
import { Header } from "@/components/header";
import "@/styles/index.scss";
import "@/styles/_reset.scss"

import localFont from 'next/font/local'

const openSans = localFont({
  src: [
    { path: './fonts/openSans/OpenSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/openSans/OpenSans-Italic.woff2',  weight: '400', style: 'italic' },
    { path: './fonts/openSans/OpenSans-Light.woff2',   weight: '300', style: 'normal' },
    { path: './fonts/openSans/OpenSans-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './fonts/openSans/OpenSans-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: './fonts/openSans/OpenSans-Bold.woff2',    weight: '700', style: 'normal' },
    { path: './fonts/openSans/OpenSans-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans',
})

const openSansCondensed = localFont({
  src: [
    { path: './fonts/openSans/OpenSansCondensed-Light.woff2',   weight: '300', style: 'normal' },
    { path: './fonts/openSans/OpenSansCondensed-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/openSans/OpenSansCondensed-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './fonts/openSans/OpenSansCondensed-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: './fonts/openSans/OpenSansCondensed-Bold.woff2',    weight: '700', style: 'normal' },
    { path: './fonts/openSans/OpenSansCondensed-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans-condensed',
})

const openSansSemiCondensed = localFont({
  src: [
    { path: './fonts/openSans/OpenSansSemiCondensed-Light.woff2',   weight: '300', style: 'normal' },
    { path: './fonts/openSans/OpenSansSemiCondensed-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/openSans/OpenSansSemiCondensed-Medium.woff2',  weight: '500', style: 'normal' },
    { path: './fonts/openSans/OpenSansSemiCondensed-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: './fonts/openSans/OpenSansSemiCondensed-Bold.woff2',    weight: '700', style: 'normal' },
    { path: './fonts/openSans/OpenSansSemiCondensed-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans-semi-condensed',
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
      </body>
    </html>
  );
}
