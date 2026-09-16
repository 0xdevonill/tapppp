import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Syne } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: {
    default: "Twins — One coin. Two chains. One price.",
    template: "%s — Twins",
  },
  description:
    "Launch once and your coin goes live on Robinhood Chain and Solana in the same minute. Backers sit inside the first buy. A fee-funded bot keeps both prices within 4%.",
  metadataBase: new URL("https://twins.trade"),
  openGraph: {
    title: "Twins — One coin. Two chains. One price.",
    description:
      "The twin-chain launchpad. Robinhood Chain via PONS. Solana via pump.fun. Nobody gets in before you.",
    images: ["/brand/banner.png"],
  },
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${syne.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
