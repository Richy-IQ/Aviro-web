import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/overlay/toast";
import { SystemThemeSync } from "@/components/settings/system-theme-sync";
import { ThemeScript } from "@/components/settings/theme-script";
import "./globals.css";

// Spec calls for weights 400 and 500 only — shipping just those keeps the
// self-hosted payload small, which matters on the mobile connections most
// Aviro farmers are on.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aviro — Run your farm by the numbers",
  description:
    "Track feed, mortality and cost per bird across every batch. Know what each cycle is really earning you.",
  applicationName: "Aviro",
  appleWebApp: { capable: true, title: "Aviro", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1419" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-density="regular"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeScript />
        <SystemThemeSync />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
