import React from 'react';
import { Quote } from 'lucide-react';

const SummaryCard = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-violet-50/30 rounded-2xl p-6 border-l-[3px] border-secondary animate-pulse">
        <div className="h-4 w-20 bg-violet-100 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-violet-50 rounded" />
          <div className="h-4 w-full bg-violet-50 rounded" />
          <div className="h-4 w-2/3 bg-violet-50 rounded" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="bg-[#F5F3FF] rounded-2xl p-6 border-l-[3px] border-secondary relative overflow-hidden">
      <div className="absolute top-[-20px] right-[-10px] text-violet-100/50 -rotate-12">
        <Quote size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="section-label !text-secondary !mb-4 tracking-[0.08em]">AI Summary</div>
        <p className="text-[16px] leading-[1.7] text-primary font-medium italic">
          {summary}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
