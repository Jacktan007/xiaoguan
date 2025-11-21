import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

export interface StageScore {
  id: string;
  name: string;
  score: number; // 0-100
  status: 'success' | 'warning' | 'error';
}

interface AnalysisDashboardProps {
  overallScore: number;
  stageScores: StageScore[];
}

export default function AnalysisDashboard({ overallScore, stageScores }: AnalysisDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  // Simple Circular Progress using SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Overall Score */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
            <circle
              className={getProgressColor(overallScore)}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
            <span className="text-xs text-gray-400 uppercase font-semibold">总分</span>
          </div>
        </div>

        {/* Timeline / Stage Details */}
        <div className="flex-1 w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4">阶段表现诊断</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {stageScores.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="mb-2">
                  {stage.status === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                  {stage.status === 'warning' && <AlertCircle size={20} className="text-orange-500" />}
                  {stage.status === 'error' && <XCircle size={20} className="text-red-500" />}
                </div>
                <span className="text-xs font-bold text-gray-700">{stage.id}</span>
                <span className="text-[10px] text-gray-400 text-center line-clamp-1">{stage.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
