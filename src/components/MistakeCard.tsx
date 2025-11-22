import React from 'react';
import { ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

export interface Mistake {
  id: string;
  stage: string;
  original: string;
  reason: string;
  better_script: string;
}

interface MistakeCardProps {
  mistake: Mistake;
}

export default function MistakeCard({ mistake }: MistakeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
      <div className="bg-red-50/50 px-4 py-2 border-b border-red-100 flex justify-between items-center">
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          ⚠️ 发现问题 - {mistake.stage}
        </span>
      </div>
      
      <div className="p-4 grid md:grid-cols-2 gap-6 relative">
        {/* Original (Bad) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600 font-medium text-sm mb-1">
            <XCircle size={16} />
            <span>你说：</span>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-gray-700 text-sm leading-relaxed border border-red-100">
            &ldquo;{mistake.original}&rdquo;
          </div>
          <p className="text-xs text-red-400 mt-2">
            <span className="font-bold">问题诊断:</span> {mistake.reason}
          </p>
        </div>

        {/* Arrow (Desktop only) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-gray-100 shadow-sm z-10">
           <ArrowRight size={20} className="text-gray-400" />
        </div>

        {/* Better (Good) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-1">
            <CheckCircle2 size={16} />
            <span>冠军建议：</span>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-gray-800 text-sm leading-relaxed border border-green-100 font-medium shadow-sm">
            &ldquo;{mistake.better_script}&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}
