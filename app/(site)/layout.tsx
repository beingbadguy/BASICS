import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
import "./globals.css";
import HeaderSection from "@/components/HeaderSection";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BASICS",
  description:
    "BASICS is your go-to e-commerce destination for affordable, high-quality essentials. Discover a wide range of products including fashion, electronics, home goods, and more — all delivered to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased custom-scrollbar`}
      >
        {/* <Header /> */}
        <HeaderSection />
        {children}
        <Footer />
      </body>
    </html>
  );
}
