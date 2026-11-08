'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useCase, CaseDetailView } from '../../../src/features/cases';
import { Spinner, ErrorState } from '../../../src/features/common/components';

interface CaseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { caseData, isLoading, error, isNotFound, refetch } = useCase(params.id);

  if (isNotFound) {
    notFound();
  }

  return (
    <div className="max-w-5xl w-full mx-auto p-4 sm:p-6">
      {isLoading ? (
        <div className="p-16 border border-grafito-light bg-grafito text-center">
          <Spinner className="w-10 h-10 mx-auto" />
          <p className="font-mono text-xs text-papel-muted mt-3 tracking-widest uppercase">
            DESCLASIFICANDO EXPEDIENTE FORENSE...
          </p>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : caseData ? (
        <CaseDetailView caseData={caseData} />
      ) : null}
    </div>
  );
}
