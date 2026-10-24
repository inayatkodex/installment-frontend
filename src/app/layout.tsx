import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/noto-naskh-arabic/400.css";
import "@fontsource/noto-naskh-arabic/700.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/global.scss";
import ClientProviders from "./ClientProviders";

export const metadata: Metadata = {
  title: "Installment Pro",
  description: "Dukaandaron ke liye aasaan qiston ka hisaab",
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
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
