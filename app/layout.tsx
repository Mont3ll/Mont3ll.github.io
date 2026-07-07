import type { Metadata } from "next";
import "./globals.css";
import { PageFrame } from "@/components/layout/PageFrame";
import { fontStack } from "@/data/site";

export const metadata: Metadata = {
  title: "mont3ll | Full-Stack Developer",
  description:
    "Full-stack developer focused on clean code, performance, and great user experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`body { font-family: ${fontStack}; margin: 0; }`}</style>
      </head>
      <body>
        <PageFrame>{children}</PageFrame>
      </body>
    </html>
  );
}
