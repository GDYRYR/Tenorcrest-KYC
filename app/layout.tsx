import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TenorCrest — KYC Verification",
  description: "Identity verification for TenorCrest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
