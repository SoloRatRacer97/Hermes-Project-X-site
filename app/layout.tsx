import type { Metadata } from "next";
import { projectXConfig } from "./project-x-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${projectXConfig.brand.name} | Blue-Collar Business Growth Landing Page`,
  description:
    "An industry-agnostic landing page for service businesses showcasing Hopper-Hermes speed-to-lead automation.",
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
