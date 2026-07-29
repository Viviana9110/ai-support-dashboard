'use client';

import { PageHeader } from '@/components/ui/page-header';

export function KnowledgeClient() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="Create and manage articles used by your AI assistant and support team."
      />
    </div>
  );
}