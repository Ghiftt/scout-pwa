import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout",
  description: "Physical world interface for autonomous agents",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{
          maxWidth: "390px",
          margin: "0 auto",
          minHeight: "100dvh",
          position: "relative",
          background: "#F4F1EA",
          overflow: "hidden",
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}