import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { PortfolioLoader } from "@/components/loader/portfolio-loader";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parul Kumari — UI/UX Designer & Digital Visual Artist",
  description:
    "Portfolio of Parul Kumari, a UI/UX designer and digital visual artist crafting user-centered interfaces and visual identities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        inter.variable,
        montserrat.variable,
        fraunces.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PortfolioLoader>{children}</PortfolioLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
