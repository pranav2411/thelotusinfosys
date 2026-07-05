import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | The Lotus Infosys",
  description: "Learn more about The Lotus Infosys, our 20+ years of IT expertise in Jaipur, our founders, and locate our office on the map.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
