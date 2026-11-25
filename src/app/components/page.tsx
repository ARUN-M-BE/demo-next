import { Badge, PageContainer } from "@/UI";
import { ComponentShowcase } from "@/features/showcase/ComponentShowcase";

export default function ComponentsPage() {
  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl font-bold tracking-tight text-grayscale-textIcon-title">
            UI Astra Component Studio
          </h1>
          <Badge variant="primary">21 Components</Badge>
        </div>
        <p className="text-sm text-grayscale-textIcon-body">
          Interactive playground for all reusable components in{" "}
          <code className="rounded bg-grayscale-surface px-1.5 py-0.5 font-mono text-xs">
            src/UI/components/
          </code>
          .
        </p>
      </div>
      <ComponentShowcase />
    </PageContainer>
  );
}
