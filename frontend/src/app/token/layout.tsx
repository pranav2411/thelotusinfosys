import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Repair Token | The Lotus Infosys",
  description: "Track the real-time diagnosis and repair progress of your laptop, computer, or hardware device with your service token.",
};

export default function TokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
