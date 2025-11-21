import React, { useState } from 'react';
import { TacticalCardData, Script } from '@/types';
import { Copy, Check, AlertTriangle, Brain, FileText, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { clsx } from 'clsx';

interface TacticalCardProps {
  data: TacticalCardData | null;
  isLoading: boolean;
}

export default function TacticalCard({ data, isLoading }: TacticalCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-20 bg-gray-100 rounded mb-4"></div>
        <div className="h-20 bg-gray-100 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-xl">
        <Brain size={48} className="mb-4 opacity-20" />
        <p>等待战术指令...</p>
        <p className="text-sm">请在上点击客户反应</p>
      </div>
    );
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      {/* Header: Diagnosis */}
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <div className="flex items-start gap-3">
          <Brain className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-blue-900 font-medium text-sm leading-relaxed">
              {data.diagnosis}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scripts */}
      <div className="p-4 space-y-4">
        {data.scripts.map((script, idx) => (
          <div 
            key={idx} 
            onClick={() => handleCopy(script.content, idx)}
            className="group relative p-4 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className={clsx(
                "text-xs font-bold uppercase px-2 py-0.5 rounded",
                script.type === 'soft' ? 'bg-green-100 text-green-700' :
                script.type === 'challenger' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              )}>
                {script.type === 'soft' ? '温和共情' : script.type === 'challenger' ? '挑战现状' : '直接收尾'}
              </span>
              <span className="text-gray-400 text-xs flex items-center gap-1 group-hover:text-blue-600">
                {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                {copiedIndex === idx ? '已复制' : '点击复制'}
              </span>
            </div>
            <p className="text-gray-800 text-lg leading-snug font-medium">
              {script.content}
            </p>
          </div>
        ))}
      </div>

      {/* Warning */}
      {data.warning && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium">{data.warning}</p>
        </div>
      )}

      {/* Files */}
      {data.files && data.files.length > 0 && (
        <div className="mx-4 mb-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">推荐资料</p>
          <div className="flex flex-wrap gap-2">
            {data.files.map((file, i) => (
              <a 
                key={i}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FileText size={16} />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      <div className="bg-gray-50 p-3 flex justify-between items-center border-t border-gray-100">
        <div className="flex gap-1">
          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-full transition-colors"><ThumbsUp size={18} /></button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"><Meh size={18} /></button>
          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-full transition-colors"><ThumbsDown size={18} /></button>
        </div>
        <button className="text-xs text-gray-500 font-medium hover:text-blue-600 underline decoration-dashed underline-offset-4">
          我有更好的说法
        </button>
      </div>
    </div>
  );
}
