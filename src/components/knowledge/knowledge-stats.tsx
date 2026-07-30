'use client';

import { BookOpen, FileEdit, FolderOpen } from 'lucide-react';

import { AnalyticsKpiCard } from '@/components/analytics/analytics-kpi-card';

interface Props {
  total: number;
  drafts: number;
  categories: number;
}

export function KnowledgeStats({
  total,
  drafts,
  categories,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <AnalyticsKpiCard
        title="Published Articles"
        value={total}
        subtitle="Knowledge base"
        icon={BookOpen}
      />

      <AnalyticsKpiCard
        title="Drafts"
        value={drafts}
        subtitle="Pending publication"
        icon={FileEdit}
      />

      <AnalyticsKpiCard
        title="Categories"
        value={categories}
        subtitle="Available"
        icon={FolderOpen}
      />
    </div>
  );
}