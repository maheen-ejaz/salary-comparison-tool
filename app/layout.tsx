import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GCWorld Salary Comparison Tool",
  description:
    "Compare your real savings potential as an Indian doctor working abroad. See take-home pay, cost of living, and how long to recover migration costs.",
  openGraph: {
    title: "GCWorld Salary Comparison Tool",
    description: "How much can you save as an Indian doctor working abroad?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-[var(--font-inter)] antialiased bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
