import type { Metadata } from "next";
import { projectXConfig } from "./project-x-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${projectXConfig.brand.name} | Mortgage Broker in San Francisco, CA`,
  description:
    "Golden Gate Mortgage Advisors helps San Francisco buyers, homeowners, and investors with purchase, refinance, jumbo, and pre-approval scenarios.",
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
