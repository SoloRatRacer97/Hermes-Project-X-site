import type { Metadata } from "next";
import { projectXConfig } from "./project-x-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${projectXConfig.brand.name} | Remodeling and Home Additions`,
  description:
    "Bellevue remodeling, additions, ADUs, custom homes, and whole-home renovation requests.",
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
