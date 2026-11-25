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
  title: "AstraStudio — UI Astra + Next.js + Clerk",
  description:
    "Modern Next.js App Router application built with UI Astra design tokens, reusable src/UI components, and Clerk authentication.",
};

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Dashboard", href: "/dashboard" },
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
                brandName="AstraStudio"
                navItems={NAV_ITEMS}
                authSlot={authSlot}
              />
              <main className="flex-1">{children}</main>
              <Footer brandName="AstraStudio" />
            </ToastProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
