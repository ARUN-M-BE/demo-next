import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  LayoutDashboard,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageContainer,
} from "@/UI";

const HIGHLIGHTS = [
  {
    title: "UI Astra Token System",
    description:
      "Full Tailwind CSS v4 @theme inline configuration with light/dark mode CSS variables, elevation shadows, and semantic scales.",
    icon: <Palette className="h-5 w-5 text-primary-surface" />,
  },
  {
    title: "Centralized src/UI/ Library",
    description:
      "21 accessible, reusable components, responsive layout shells, and theme utilities exported cleanly from src/UI/index.ts.",
    icon: <Layers className="h-5 w-5 text-info-500" />,
  },
  {
    title: "Clerk Auth Integration",
    description:
      "Configured with Next.js 16 proxy.ts middleware, Suspense-wrapped auth controls, and dedicated sign-in / sign-up routes.",
    icon: <ShieldCheck className="h-5 w-5 text-success-500" />,
  },
];

export default function HomePage() {
  return (
    <div className="bg-uiastra-radial">
      <PageContainer className="py-14 sm:py-20">
        <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="primary" dot className="mb-5">
            Next.js 16 &bull; UI Astra &bull; Clerk Auth
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-grayscale-textIcon-title sm:text-5xl lg:text-6xl">
            Build faster with{" "}
            <span className="text-primary-textIcon-link-label">UI Astra</span>{" "}
            &amp; Next.js
          </h1>
          <p className="mt-5 max-w-2xl text-base text-grayscale-textIcon-body sm:text-lg">
            A production-ready TypeScript architecture featuring a complete{" "}
            <code className="rounded bg-grayscale-surface px-1.5 py-0.5 font-mono text-sm">
              src/UI/
            </code>{" "}
            component system, class-based dark mode, and Clerk authentication.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/components">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Explore Components
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<LayoutDashboard className="h-4 w-4" />}
              >
                Open Dashboard
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <Card key={item.title} variant="default" className="h-full">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-grayscale-border bg-grayscale-surface-subtle">
                  {item.icon}
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs font-medium text-grayscale-textIcon-subtitle">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
                  <span>Verified &amp; TypeScript-checked</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12">
          <Card variant="subtle" className="p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-neutral-1150">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-grayscale-textIcon-title">
                    Interactive Component Studio &amp; Live Dashboard
                  </h2>
                  <p className="mt-1 text-sm text-grayscale-textIcon-body">
                    Test form validation, modals, dropdowns, tabs, accordions,
                    paginated tables, toast notifications, and theme switching.
                  </p>
                </div>
              </div>
              <Link href="/components">
                <Button variant="dark" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Launch Studio
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </PageContainer>
    </div>
  );
}
