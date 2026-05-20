import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import "@/styles/index.scss";
import "@/styles/_reset.scss"

import localFont from 'next/font/local'
import { Footer } from "@/components/footer";

import { PopupProvider } from "@/app/context/PopupContext"

import { client } from "@/sanity/lib/client"
import { getSiteSettings } from "@/sanity/lib/getSiteSettings"
import EventButton from "@/components/EventButton/EventButton";
import { EventPopupInfo } from "@/components/EventPopup/EventPopupInfo";
import Popup from "@/components/Popup/Popup";
import { AgeGate } from "@/components/AgeGate";
import { CookieBanner } from "@/components/CookieBanner";

import YandexMetrika from "../modules/YandexMetrika";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shengenplus.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shengen+ — пивной бар в Краснодаре",
    template: "%s — Shengen+",
  },
  description:
    "Пивной бар Shengen+ в Краснодаре. 150+ сортов крафтового и импортного пива из 18 стран, кухня, уютная атмосфера. Открыты каждый день.",
  keywords: [
    "пивной бар Краснодар",
    "крафтовое пиво Краснодар",
    "импортное пиво",
    "Shengen+",
    "Шенген плюс",
    "пиво в Краснодаре",
    "бельгийское пиво",
    "немецкое пиво",
  ],
  applicationName: "Shengen+",
  authors: [{ name: "Shengen+" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Shengen+",
    title: "Shengen+ — пивной бар в Краснодаре",
    description:
      "150+ сортов крафтового и импортного пива из 18 стран. Уютный бар в Краснодаре.",
    // og-картинка генерируется динамически через app/(main)/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Shengen+ — пивной бар в Краснодаре",
    description: "150+ сортов крафтового и импортного пива из 18 стран.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#D65E12",
  width: "device-width",
  initialScale: 1,
};

const eventsQuery = `*[_type == "event" && isActive == true] | order(startDate asc) {
  _id,
  title,
  startDate,
  "imageUrl": image.asset->url,
  body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->
    }
  }
}`

const openSans = localFont({
  src: [
    { path: '../fonts/OpenSans/OpenSans-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSans-Italic.woff2',  weight: '400', style: 'italic' },
    { path: '../fonts/OpenSans/OpenSans-Light.woff2',   weight: '300', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSans-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSans-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSans-Bold.woff2',    weight: '700', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSans-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans',
  display: 'swap', adjustFontFallback: false
})

const openSansCondensed = localFont({
  src: [
    { path: '../fonts/OpenSans/OpenSansCondensed-Light.woff2',   weight: '300', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSansCondensed-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSansCondensed-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSansCondensed-SemiBold.woff2',weight: '600', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSansCondensed-Bold.woff2',    weight: '700', style: 'normal' },
    { path: '../fonts/OpenSans/OpenSansCondensed-ExtraBold.woff2',weight: '800', style: 'normal' },
  ],
  variable: '--font-open-sans-condensed',
  display: 'swap', adjustFontFallback: false
})


export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [events, settings] = await Promise.all([
    client.fetch(eventsQuery, {}, { next: { revalidate: 300 } }),
    getSiteSettings(),
  ]);

  return (
    <html lang="ru" className={`${openSans.variable} ${openSansCondensed.variable}`}>
      <body>
        <PopupProvider>

          <Header settings={settings} />
          <main>
            {children}
            <EventButton count={events.length} />
          </main>
          {events.length > 0 && (
            <Popup>
              <EventPopupInfo events={events} />
            </Popup>
          )}
          <Footer />
        </PopupProvider>
        <YandexMetrika />
        <AgeGate />
        <CookieBanner />
      </body>
    </html>
  );
}
