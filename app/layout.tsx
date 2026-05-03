import type { Metadata } from "next";
import { projectXConfig } from "./project-x-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${projectXConfig.brand.name} | AI Follow-Up Comparison`,
  description:
    "A side-by-side landing page comparing ChatSales and Hermes for speed-to-lead, qualification, handoff, and service-business sales follow-up.",
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
