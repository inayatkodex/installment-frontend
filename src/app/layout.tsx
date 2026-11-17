import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/noto-naskh-arabic/400.css";
import "@fontsource/noto-naskh-arabic/700.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/global.scss";
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  title: "QistPro",
  description: "Dukaandaron ke liye aasaan qiston ka hisaab",
  icons: {
    icon: "/qistpro-logos/svg/favicon-32x32.svg",
    shortcut: "/qistpro-logos/favicon.ico",
    apple: "/qistpro-logos/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1565c0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
