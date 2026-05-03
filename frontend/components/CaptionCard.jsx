import React from 'react';
import { Sparkles } from 'lucide-react';

const CaptionCard = ({ caption, searchQuery, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl p-6 border border-border animate-pulse">
        <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-50 rounded" />
          <div className="h-4 w-3/4 bg-gray-50 rounded" />
        </div>
        <div className="mt-4 h-6 w-32 bg-violet-50 rounded-full" />
      </div>
    );
  }

  if (!caption) return null;

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-secondary" />
        <div className="section-label !text-secondary !mb-0">AI Vision Description</div>
      </div>
      <p className="text-[15px] leading-relaxed text-primary mb-5">
        {caption}
      </p>
      <div className="flex flex-col gap-2">
        <div className="section-label">Optimized Query</div>
        <div className="inline-flex">
          <span className="bg-violet-50 text-secondary text-[11px] font-mono px-3 py-1.5 rounded-full border border-violet-100 font-semibold tracking-tight">
            {searchQuery}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;
