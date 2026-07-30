'use client';

import { PageHeader } from "@/components/ui/page-header";

import { AIPlayground } from "./playground/ai-playground";

export function AIClient() {
  return (
    <div className="space-y-8">

      <PageHeader
        title="AI Assistant"
        description="Build, test and configure your AI assistants."
      />

      <AIPlayground />

    </div>
  );
}