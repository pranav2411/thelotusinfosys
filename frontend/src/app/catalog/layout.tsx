import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Catalog | The Lotus Infosys",
  description: "Explore our inventory of genuine computer hardware, IT systems, cables, accounting software, and peripheral accessories in Jaipur.",
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
