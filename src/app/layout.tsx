import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Button,
  Footer,
  Header,
  ThemeProvider,
  ToastProvider,
} from "@/UI";
import "./globals.css";

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
  const hasClerkKey = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  );

  const authSlot = hasClerkKey ? (
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
  ) : null;

  const content = (
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
  );

  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {hasClerkKey ? <ClerkProvider>{content}</ClerkProvider> : content}
      </body>
    </html>
  );
}
