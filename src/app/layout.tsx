import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { careEasySite } from "@/content/careeasy/site";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export const metadata: Metadata = {
  title: careEasySite.title,
  description: careEasySite.description,
  metadataBase: new URL(careEasySite.url),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: careEasySite.title,
    description: careEasySite.description,
    url: careEasySite.url,
    siteName: careEasySite.name,
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: careEasySite.title,
    description: careEasySite.description,
  },
  other: {
    "color-scheme": "only light",
    "supported-color-schemes": "light",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf4ea",
  colorScheme: "only light",
};

/**
 * CareEasy 전체 레이아웃입니다.
 * Vercel Analytics, GA4, Microsoft Clarity를 공통으로 연결합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}

        <Analytics />

        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}

        {CLARITY_ID ? (
          <Script
            id="careeasy-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
