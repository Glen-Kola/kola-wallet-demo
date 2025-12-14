import React from "react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-200 rounded-3xl h-40 animate-pulse" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-slate-200 rounded-2xl h-24 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};
