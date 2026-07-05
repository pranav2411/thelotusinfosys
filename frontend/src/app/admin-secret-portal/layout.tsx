import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | The Lotus Infosys",
  description: "Admin panel to manage product listings, review client enquiries, and update repair ticket stages.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
