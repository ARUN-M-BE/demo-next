"use client";

import React, { useState } from "react";
import {
  Activity,
  FolderPlus,
  KeyRound,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  Pagination,
  Select,
  Table,
  useToast,
} from "@/UI";

interface ProjectRow extends Record<string, unknown> {
  id: string;
  name: string;
  environment: "Development" | "Staging" | "Production";
  authStatus: "Protected" | "Public";
  updatedAt: string;
}

const INITIAL_PROJECTS: ProjectRow[] = [
  {
    id: "prj-1",
    name: "Astra Core Portal",
    environment: "Production",
    authStatus: "Protected",
    updatedAt: "2 mins ago",
  },
  {
    id: "prj-2",
    name: "Design Token Studio",
    environment: "Staging",
    authStatus: "Protected",
    updatedAt: "1 hour ago",
  },
  {
    id: "prj-3",
    name: "Marketing Landing",
    environment: "Development",
    authStatus: "Public",
    updatedAt: "Yesterday",
  },
  {
    id: "prj-4",
    name: "Billing & Webhooks",
    environment: "Production",
    authStatus: "Protected",
    updatedAt: "3 days ago",
  },
];

export interface DashboardClientProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function DashboardClient({
  userName,
  userEmail,
}: DashboardClientProps) {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectRow[]>(INITIAL_PROJECTS);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEnv, setNewEnv] = useState<ProjectRow["environment"]>("Development");
  const [nameError, setNameError] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const visibleProjects = projects.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setNameError("Project name is required.");
      return;
    }

    const created: ProjectRow = {
      id: `prj-${Date.now()}`,
      name: newName.trim(),
      environment: newEnv,
      authStatus: "Protected",
      updatedAt: "Just now",
    };

    setProjects((prev) => [created, ...prev]);
    setNewName("");
    setNameError("");
    setCreateOpen(false);
    setPage(1);
    toast({
      type: "success",
      title: "Project created",
      description: `${created.name} added to ${created.environment}.`,
    });
  };

  const stats = [
    {
      label: "Active Projects",
      value: String(projects.length),
      icon: <Layers className="h-4 w-4 text-primary-surface" />,
      badge: "+1 this week",
    },
    {
      label: "Auth Provider",
      value: "Clerk",
      icon: <KeyRound className="h-4 w-4 text-info-500" />,
      badge: "Connected",
    },
    {
      label: "Session Health",
      value: "99.98%",
      icon: <Activity className="h-4 w-4 text-success-500" />,
      badge: "Healthy",
    },
    {
      label: "Workspace Role",
      value: userName ? "Member" : "Guest",
      icon: <Users className="h-4 w-4 text-warning-500" />,
      badge: userEmail ?? "Sign in to sync",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-grayscale-textIcon-title sm:text-3xl">
              Workspace Dashboard
            </h1>
            <Badge variant="primary" dot>
              UI Astra + Clerk
            </Badge>
          </div>
          <p className="mt-1 text-sm text-grayscale-textIcon-body">
            {userName
              ? `Signed in as ${userName}${userEmail ? ` (${userEmail})` : ""}.`
              : "Previewing workspace. Sign in with Clerk to personalize your session."}
          </p>
        </div>

        <Button
          leftIcon={<FolderPlus className="h-4 w-4" />}
          onClick={() => setCreateOpen(true)}
        >
          New Project
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="default">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </CardDescription>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-grayscale-textIcon-title">
                {stat.value}
              </div>
              <p className="mt-1 truncate text-xs text-grayscale-textIcon-caption">
                {stat.badge}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Environments &amp; Auth Status</CardTitle>
              <CardDescription>
                Manage your Next.js + UI Astra applications protected by Clerk.
              </CardDescription>
            </div>
            <ShieldCheck className="h-5 w-5 text-primary-surface" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table
            data={visibleProjects}
            keyExtractor={(row) => row.id}
            columns={[
              { key: "name", header: "Project" },
              {
                key: "environment",
                header: "Environment",
                render: (row) => (
                  <Badge
                    variant={
                      row.environment === "Production"
                        ? "primary"
                        : row.environment === "Staging"
                        ? "info"
                        : "default"
                    }
                  >
                    {row.environment}
                  </Badge>
                ),
              },
              {
                key: "authStatus",
                header: "Clerk Auth",
                render: (row) => (
                  <Badge
                    variant={
                      row.authStatus === "Protected" ? "success" : "warning"
                    }
                    dot
                  >
                    {row.authStatus}
                  </Badge>
                ),
              },
              {
                key: "updatedAt",
                header: "Updated",
                render: (row) => (
                  <span className="text-xs text-grayscale-textIcon-caption">
                    {row.updatedAt}
                  </span>
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

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Project"
        description="Add a new environment to your AstraStudio workspace."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-project-form">
              Create Project
            </Button>
          </>
        }
      >
        <form
          id="create-project-form"
          onSubmit={handleCreateProject}
          className="flex flex-col gap-4"
        >
          <Input
            label="Project Name"
            placeholder="e.g. Customer Portal"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setNameError("");
            }}
            error={nameError}
            required
          />
          <Select
            label="Target Environment"
            value={newEnv}
            onChange={(e) =>
              setNewEnv(e.target.value as ProjectRow["environment"])
            }
            options={[
              { value: "Development", label: "Development" },
              { value: "Staging", label: "Staging" },
              { value: "Production", label: "Production" },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
}
