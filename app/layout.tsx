import type { Metadata } from "next";
import { projectXConfig } from "./project-x-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${projectXConfig.brand.name} | HVAC Service in St. Louis & Metro East`,
  description:
    "Heating, cooling, insulation, ductwork, and home comfort service for St. Louis and Metro East homeowners, landlords, and property managers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
