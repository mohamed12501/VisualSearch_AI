import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const steps = [
  { id: 'upload', label: 'Upload' },
  { id: 'caption', label: 'Caption' },
  { id: 'search', label: 'Search' },
  { id: 'summarize', label: 'Summarize' },
];

const PipelineStatus = ({ currentStep, status }) => {
  return (
    <div className="py-8">
      <div className="section-label mb-6">Pipeline Progress</div>
      <div className="relative flex justify-between">
        {/* Connecting Line */}
        <div className="absolute top-[15px] left-0 right-0 h-[2px] bg-[#E8E6E0] -z-10 mx-4" />
        
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isDone = status[step.id] === 'done';
          const isPending = status[step.id] === 'pending' || (!isActive && !isDone);

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className="relative">
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full bg-violet-100 -z-10"
                  />
                )}
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-surface",
                    isDone ? "border-success bg-success text-white" : 
                    isActive ? "border-secondary text-secondary" : 
                    "border-[#D3D1C7] text-text-muted"
                  )}
                >
                  {isDone ? <Check size={16} /> : 
                   isActive ? <Loader2 size={16} className="animate-spin" /> : 
                   <span className="text-[10px] font-bold">{index + 1}</span>}
                </div>
              </div>
              <span className={clsx(
                "text-[10px] font-semibold uppercase tracking-wider",
                isDone ? "text-success" : isActive ? "text-secondary" : "text-text-muted"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineStatus;
