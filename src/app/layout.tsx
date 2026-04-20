import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Spam Detector AI - Enterprise Cybersecurity Platform",
  description: "AI-powered spam, phishing, and fraud detection platform for global enterprises. Real-time threat intelligence, advanced analytics, and explainable AI.",
  keywords: "cybersecurity, AI, phishing detection, spam detection, fraud detection, threat intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
