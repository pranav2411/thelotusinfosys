import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Lotus Infosys | IT Services & Business Software | Jaipur",
  description:
    "The Lotus Infosys is a trusted IT services and computer hardware provider in Bani Park, Jaipur since 2000. Specializing in computer repair, business management software, and tech accessories.",
  keywords: ["Lotus Infosys", "Computer Repair Jaipur", "IT Services Jaipur", "Tally Partner Jaipur", "Bani Park Computer Hardware"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 80px - 350px)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
