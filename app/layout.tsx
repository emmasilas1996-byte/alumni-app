import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NEMSS Alumni Association",
  description: "Members, contributions, dues, constitution, and gallery",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <Navbar />
        <main className="max-w-5xl mx-auto px-7 py-10">{children}</main>
      </body>
    </html>
  );
}
