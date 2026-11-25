import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import {
  Button,
  Footer,
  Header,
  ThemeProvider,
  ToastProvider,
} from "@/UI";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MARKET INTELLIGENCE — Live SENSEX, Gold & Silver Terminal",
  description:
    "Real-time Indian financial market intelligence dashboard for BSE SENSEX, 24K/22K/18K Gold, Silver, technical indicators, and price alerts.",
};

const NAV_ITEMS = [
  { label: "Market Terminal", href: "/" },
  { label: "Analytics Workspace", href: "/dashboard" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  const authSlot = (
    <Suspense>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="primary" size="sm">
            Sign up
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </Suspense>
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          <ThemeProvider>
            <ToastProvider>
              <Header
                brandName="MARKET INTELLIGENCE"
                navItems={NAV_ITEMS}
                authSlot={authSlot}
              />
              <main className="flex-1">{children}</main>
              <Footer brandName="MARKET INTELLIGENCE" />
            </ToastProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
