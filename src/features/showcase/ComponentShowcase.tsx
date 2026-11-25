"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  Copy,
  Layers,
  Lock,
  Mail,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Dropdown,
  Input,
  Loader,
  Modal,
  Pagination,
  RadioGroup,
  Select,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Textarea,
  Tooltip,
  useToast,
} from "@/UI";

interface TokenRow extends Record<string, unknown> {
  id: string;
  token: string;
  category: string;
  value: string;
  status: "Active" | "Preview" | "Deprecated";
}

const TOKEN_DATA: TokenRow[] = [
  { id: "1", token: "--uiastra-primary", category: "Brand", value: "hsl(166 100% 41%)", status: "Active" },
  { id: "2", token: "--uiastra-secondary", category: "Brand", value: "hsl(184 100% 61%)", status: "Active" },
  { id: "3", token: "--grayscale-surface", category: "Surface", value: "hsl(200 13% 95%)", status: "Active" },
  { id: "4", token: "--grayscale-border", category: "Border", value: "hsl(210 12% 87%)", status: "Active" },
  { id: "5", token: "--info-surface", category: "Semantic", value: "hsl(220 100% 45%)", status: "Active" },
  { id: "6", token: "--success-surface", category: "Semantic", value: "hsl(136 63% 48%)", status: "Active" },
  { id: "7", token: "--warning-surface", category: "Semantic", value: "hsl(45 100% 50%)", status: "Preview" },
  { id: "8", token: "--error-surface", category: "Semantic", value: "hsl(2 100% 60%)", status: "Active" },
];

export function ComponentShowcase() {
  const { toast } = useToast();

  // Form state & validation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("architect");
  const [plan, setPlan] = useState("pro");
  const [bio, setBio] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; agreed?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // Interactive states
  const [modalOpen, setModalOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 4;
  const filteredTokens = TOKEN_DATA.filter(
    (row) =>
      row.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredTokens.length / pageSize));
  const paginatedTokens = filteredTokens.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; email?: string; agreed?: string } = {};

    if (!name.trim()) nextErrors.name = "Full name is required.";
    if (!email.trim() || !email.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!agreed) nextErrors.agreed = "You must accept the workspace terms.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast({
        type: "error",
        title: "Validation failed",
        description: "Please fix the highlighted form fields.",
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        type: "success",
        title: "Workspace profile saved",
        description: `Updated settings for ${name} (${role}).`,
      });
    }, 500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top interactive status bar */}
      {showAlert && (
        <Alert
          variant="info"
          title="UI Astra Design System Active"
          description="All 21 reusable components in src/UI/ are wired with Tailwind CSS v4 tokens, dark mode class strategy, and Framer Motion transitions."
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Tabs: Overview / Forms / Data & Overlays */}
      <Tabs
        items={[
          {
            id: "controls",
            label: "Controls & Overlays",
            icon: <Sparkles className="h-4 w-4" />,
            content: (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Buttons & Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Buttons, Badges &amp; Tooltips</CardTitle>
                    <CardDescription>
                      Interactive action triggers with UI Astra semantic tokens.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-2.5">
                      <Button
                        onClick={() =>
                          toast({
                            type: "success",
                            title: "Primary Action",
                            description: "Triggered primary UI Astra button.",
                          })
                        }
                        leftIcon={<Plus className="h-4 w-4" />}
                      >
                        Create Item
                      </Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="dark">Dark</Button>
                      <Button variant="danger" size="sm">
                        Delete
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary" dot>
                        UI Astra v4
                      </Badge>
                      <Badge variant="success" dot>
                        Operational
                      </Badge>
                      <Badge variant="warning">Beta</Badge>
                      <Badge variant="info">Clerk Ready</Badge>
                      <Badge variant="error">Alert</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <div className="flex items-center -space-x-2">
                        <Avatar alt="Maya Lin" status="online" />
                        <Avatar alt="Alex Rivera" status="busy" />
                        <Avatar alt="Samira Patel" status="offline" />
                      </div>
                      <Tooltip content="Open interactive modal dialog">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setModalOpen(true)}
                        >
                          Open Modal
                        </Button>
                      </Tooltip>
                      <Dropdown
                        label="Quick Actions"
                        items={[
                          {
                            id: "copy",
                            label: "Copy token config",
                            icon: <Copy className="h-4 w-4" />,
                            onClick: () =>
                              toast({
                                type: "info",
                                title: "Copied",
                                description: "Token config copied to clipboard.",
                              }),
                          },
                          {
                            id: "settings",
                            label: "Theme preferences",
                            icon: <Settings className="h-4 w-4" />,
                            onClick: () =>
                              toast({
                                type: "info",
                                title: "Theme",
                                description: "Use the header toggle to switch light/dark.",
                              }),
                          },
                          {
                            id: "delete",
                            label: "Reset demo state",
                            icon: <Trash2 className="h-4 w-4" />,
                            danger: true,
                            onClick: () => {
                              setShowAlert(true);
                              toast({
                                type: "warning",
                                title: "Reset",
                                description: "Demo alerts restored.",
                              });
                            },
                          },
                        ]}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Accordion & Loading states */}
                <Card>
                  <CardHeader>
                    <CardTitle>Accordion &amp; Loading States</CardTitle>
                    <CardDescription>
                      Expandable sections, skeleton placeholders, and spinners.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Accordion
                      defaultOpenIds={["arch"]}
                      items={[
                        {
                          id: "arch",
                          title: "Centralized src/UI/ Architecture",
                          content:
                            "Every reusable UI primitive, layout shell, theme provider, and utility lives inside src/UI/ with a clean barrel export.",
                        },
                        {
                          id: "auth",
                          title: "Clerk Authentication & Protection",
                          content:
                            "Next.js 16 proxy.ts middleware and Suspense-wrapped Clerk controls keep server and client boundaries safe.",
                        },
                        {
                          id: "tokens",
                          title: "UI Astra CSS Variables",
                          content:
                            "Light and dark mode tokens map cleanly through Tailwind CSS v4 @theme inline declarations.",
                        },
                      ]}
                    />

                    <div className="flex items-center justify-between rounded-xl border border-grayscale-border bg-grayscale-surface-subtle p-3.5">
                      <div className="flex items-center gap-3">
                        {showSkeleton ? (
                          <div className="flex items-center gap-3">
                            <Skeleton variant="circular" className="h-9 w-9" />
                            <div className="flex flex-col gap-1.5">
                              <Skeleton className="h-3.5 w-28" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        ) : (
                          <Loader size="sm" label="Live state ready" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSkeleton((s) => !s)}
                      >
                        {showSkeleton ? "Show Live" : "Preview Skeleton"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            id: "forms",
            label: "Forms & Validation",
            icon: <ShieldCheck className="h-4 w-4" />,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Validated Workspace Form</CardTitle>
                  <CardDescription>
                    Test real client-side validation across Input, Select,
                    RadioGroup, Textarea, Checkbox, and Switch.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleFormSubmit} noValidate>
                  <CardContent className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      placeholder="Ada Lovelace"
                      leftIcon={<User className="h-4 w-4" />}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Work Email"
                      type="email"
                      placeholder="ada@uiastra.dev"
                      leftIcon={<Mail className="h-4 w-4" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      required
                    />
                    <Select
                      label="Role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      options={[
                        { value: "architect", label: "Frontend Architect" },
                        { value: "engineer", label: "Senior Next.js Developer" },
                        { value: "designer", label: "UI/UX Engineer" },
                      ]}
                    />
                    <RadioGroup
                      name="plan"
                      label="Workspace Tier"
                      orientation="horizontal"
                      value={plan}
                      onChange={setPlan}
                      options={[
                        { value: "starter", label: "Starter" },
                        { value: "pro", label: "Pro" },
                        { value: "enterprise", label: "Enterprise" },
                      ]}
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        label="Project Notes"
                        placeholder="Describe your UI Astra + Clerk setup..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        helperText="Optional summary stored in local preview state."
                      />
                    </div>
                    <div className="flex flex-col gap-3 md:col-span-2">
                      <Switch
                        checked={alertsEnabled}
                        onCheckedChange={setAlertsEnabled}
                        label="Security & Auth Notifications"
                        description="Receive toast alerts for sign-in and configuration events."
                      />
                      <Checkbox
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        label="Accept workspace configuration"
                        description="Confirm all reusable components are scoped to src/UI/."
                        error={errors.agreed}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-grayscale-textIcon-caption">
                      Try submitting empty fields to verify validation.
                    </span>
                    <Button
                      type="submit"
                      isLoading={submitting}
                      leftIcon={<Check className="h-4 w-4" />}
                    >
                      Save Configuration
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ),
          },
          {
            id: "tokens",
            label: "Design Tokens Table",
            icon: <Layers className="h-4 w-4" />,
            content: (
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>UI Astra Token Registry</CardTitle>
                      <CardDescription>
                        Filterable and paginated CSS variable tokens.
                      </CardDescription>
                    </div>
                    <Input
                      placeholder="Filter tokens..."
                      leftIcon={<Search className="h-4 w-4" />}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      containerClassName="sm:w-64"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Table
                    data={paginatedTokens}
                    keyExtractor={(row) => row.id}
                    columns={[
                      {
                        key: "token",
                        header: "CSS Variable",
                        render: (row) => (
                          <code className="rounded bg-grayscale-surface px-2 py-0.5 font-mono text-xs text-grayscale-textIcon-title">
                            {row.token}
                          </code>
                        ),
                      },
                      { key: "category", header: "Category" },
                      {
                        key: "value",
                        header: "HSL Value",
                        render: (row) => (
                          <span className="font-mono text-xs text-grayscale-textIcon-body">
                            {row.value}
                          </span>
                        ),
                      },
                      {
                        key: "status",
                        header: "Status",
                        render: (row) => (
                          <Badge
                            variant={
                              row.status === "Active" ? "success" : "warning"
                            }
                            dot
                          >
                            {row.status}
                          </Badge>
                        ),
                      },
                    ]}
                  />
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </CardContent>
              </Card>
            ),
          },
        ]}
      />

      {/* Interactive Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="UI Astra Modal Dialog"
        description="Accessible dialog with backdrop blur, Escape dismissal, and Framer Motion animation."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              leftIcon={<Bell className="h-4 w-4" />}
              onClick={() => {
                setModalOpen(false);
                toast({
                  type: "success",
                  title: "Confirmed",
                  description: "Modal action completed successfully.",
                });
              }}
            >
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-xl border border-grayscale-border bg-grayscale-surface-subtle p-4 text-sm text-grayscale-textIcon-body">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary-surface" />
          <p>
            This modal is rendered from <code className="font-mono text-xs">src/UI/components/Modal.tsx</code> and respects both light and dark UI Astra color tokens.
          </p>
        </div>
      </Modal>
    </div>
  );
}
