import React from 'react';
import { Stage } from '@/types';
import { clsx } from 'clsx';

interface StageNavigatorProps {
  stages: Stage[];
  currentStageId: string;
  onStageSelect: (stageId: string) => void;
}

export default function StageNavigator({ stages, currentStageId, onStageSelect }: StageNavigatorProps) {
  return (
    <div className="w-full overflow-x-auto bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 no-scrollbar">
      <div className="flex space-x-2 p-3 md:p-4 min-w-max">
        {stages.map((stage) => {
          const isActive = stage.id === currentStageId;
          return (
            <button
              key={stage.id}
              onClick={() => onStageSelect(stage.id)}
              className={clsx(
                "px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 flex items-center",
                isActive
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
              )}
            >
              <span className="font-bold mr-1 opacity-80">{stage.id}</span>
              {stage.name}
            </button>
          );
        })}
      </div>
      {/* Progress Indicator Line (Optional) */}
      <div className="h-1 bg-gray-100 w-full">
         {/* Dynamic width based on stage index could go here */}
      </div>
    </div>
  );
}
