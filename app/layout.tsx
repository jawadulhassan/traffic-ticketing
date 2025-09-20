import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Traffic Ticketing Annotation Tool",
  description:
    "Professional traffic violation annotation system for law enforcement",
  keywords: [
    "traffic",
    "ticketing",
    "annotation",
    "violations",
    "law enforcement",
  ],
  authors: [{ name: "Traffic Ticketing System" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
