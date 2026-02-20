import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salary Comparison Tool by GooCampus World",
  description:
    "Compare your real savings potential as an Indian doctor working abroad. See take-home pay, cost of living, and how long to recover migration costs.",
  openGraph: {
    title: "Salary Comparison Tool by GooCampus World",
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
    <html lang="en" className={dmSans.variable}>
      <body className="font-[var(--font-dm-sans)] antialiased bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
