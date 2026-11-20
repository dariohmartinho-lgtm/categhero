import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { EuropeMapDefs } from "@/components/EuropeMap";
import { Header } from "@/components/Shell";
import { ServiceWorker } from "@/components/ServiceWorker";
import { S } from "@/strings";
import "./globals.css";

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: S.appName,
  description: S.tagline,
  applicationName: S.appName,
  appleWebApp: { capable: true, title: S.appName, statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F6FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1626" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <EuropeMapDefs />
        <div className="wrap">
          <Header />
          <main>{children}</main>
          <p className="foot">{S.auth.testNote}</p>
        </div>
        <ServiceWorker />
      </body>
    </html>
  );
}
