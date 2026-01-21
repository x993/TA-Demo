import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/providers/motion-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Credit Oversight",
  description: "Tenant credit monitoring for commercial real estate",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a2332",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <MotionProvider>
            {children}
          </MotionProvider>
        </div>
      </body>
    </html>
  );
}
