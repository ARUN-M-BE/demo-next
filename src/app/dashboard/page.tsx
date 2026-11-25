import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { LayoutDashboard, Layers, Home } from "lucide-react";
import { Loader, PageContainer, Sidebar } from "@/UI";
import { DashboardClient } from "@/features/dashboard/DashboardClient";

const SIDEBAR_ITEMS = [
  { label: "Overview", href: "/", icon: <Home className="h-4 w-4" /> },
  {
    label: "Components",
    href: "/components",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
];

async function DashboardWithUser() {
  let userName: string | null = null;
  let userEmail: string | null = null;

  try {
    const user = await currentUser();
    if (user) {
      userName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "Authenticated User";
      userEmail = user.emailAddresses[0]?.emailAddress ?? null;
    }
  } catch {
    // Graceful fallback when Clerk keys are not yet linked
  }

  return <DashboardClient userName={userName} userEmail={userEmail} />;
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <Sidebar
        title="Workspace"
        items={SIDEBAR_ITEMS}
        footer={
          <p className="text-xs text-grayscale-textIcon-caption">
            Protected by Clerk &bull; Styled with UI Astra
          </p>
        }
      />
      <PageContainer className="flex-1">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader size="lg" label="Loading workspace..." />
            </div>
          }
        >
          <DashboardWithUser />
        </Suspense>
      </PageContainer>
    </div>
  );
}
