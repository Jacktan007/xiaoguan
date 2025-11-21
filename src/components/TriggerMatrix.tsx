import React, { useState } from 'react';
import { Trigger, Stage } from '@/types';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface TriggerMatrixProps {
  stage: Stage;
  onTriggerSelect: (trigger: Trigger, customQuery?: string) => void;
  isLoading: boolean;
}

export default function TriggerMatrix({ stage, onTriggerSelect, isLoading }: TriggerMatrixProps) {
  const [isManualInput, setIsManualInput] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    // Create a dummy trigger for manual input
    const manualTrigger: Trigger = {
      label: '手动输入',
      value: 'manual_input',
      problem_type: 'Manual',
      default_script: ''
    };
    onTriggerSelect(manualTrigger, customQuery);
    setCustomQuery('');
    setIsManualInput(false);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-blue-600">🎯 {stage.name}</span>
          </h3>
          <p className="text-sm text-gray-500">{stage.goal}</p>
        </div>
      </div>

      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        客户现在的反应?
      </h4>

      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
        {stage.triggers.map((trigger) => (
          <button
            key={trigger.value}
            disabled={isLoading}
            onClick={() => onTriggerSelect(trigger)}
            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 md:p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-gray-700 text-xs md:text-sm font-medium active:scale-95 disabled:opacity-50 min-h-[60px] md:min-h-0 text-center md:text-left"
          >
             <AlertCircle size={16} className="text-orange-500 flex-shrink-0" />
            {trigger.label}
          </button>
        ))}
      </div>

      {/* Manual Input Toggle */}
      {!isManualInput ? (
        <button
          onClick={() => setIsManualInput(true)}
          className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 flex items-center justify-center gap-1"
        >
          <MessageSquare size={14} />
          没找到? 手动输入客户原话
        </button>
      ) : (
        <form onSubmit={handleManualSubmit} className="mt-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="客户刚才说了什么..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !customQuery.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              分析
            </button>
            <button
              type="button"
              onClick={() => setIsManualInput(false)}
              className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
