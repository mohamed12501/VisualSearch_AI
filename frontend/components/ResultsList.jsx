import React from 'react';
import { ExternalLink } from 'lucide-react';

const ResultSkeleton = () => (
  <div className="bg-surface rounded-xl p-4 border border-border animate-pulse mb-3">
    <div className="flex gap-4">
      <div className="w-5 h-5 bg-gray-100 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-50 rounded" />
      </div>
    </div>
  </div>
);

const ResultsList = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="section-label">Searching Knowledge Base...</div>
        {[1, 2, 3, 4, 5].map(i => <ResultSkeleton key={i} />)}
      </div>
    );
  }

  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="section-label">Google Research Results</div>
      <div className="space-y-3">
        {results.map((result, index) => (
          <a
            key={index}
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-surface rounded-xl p-5 border border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-100"
          >
            <div className="flex gap-4">
              <div className="mt-1">
                {result.favicon ? (
                  <img src={result.favicon} alt="" className="w-5 h-5 rounded" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-[10px] text-secondary font-bold">
                    {result.title[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-bold text-primary group-hover:text-secondary transition-colors mb-1">
                  {result.title}
                </h4>
                <p className="text-[13px] text-text-muted leading-relaxed mb-3">
                  {result.snippet}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-success text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-emerald-100 transition-colors group-hover:bg-success group-hover:text-white">
                  Visit Source <ExternalLink size={10} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
