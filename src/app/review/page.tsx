'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import AnalysisDashboard, { StageScore } from '@/components/AnalysisDashboard';
import MistakeCard, { Mistake } from '@/components/MistakeCard';

interface ReviewResult {
  overallScore: number;
  stageScores: StageScore[];
  mistakes: Mistake[];
}

export default function ReviewPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          industry: 'SaaS', // Could grab from context/localStorage
          product: 'CRM',
          role: '电销'
        })
      });
      
      if (!response.ok) throw new Error("Analysis failed");
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("诊断失败，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-lg text-gray-800">复盘实验室 (Review Lab)</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6">
        
        {/* Step 1: Upload */}
        {!result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold mb-2">上传对话截图</h2>
              <p className="text-gray-500 text-sm mb-6">
                AI 将自动分析 S0-S5 全流程，找出丢单原因。
              </p>
              <ImageUploader onImageSelected={setSelectedImage} />
              
              <div className="mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      正在诊断... (约 5秒)
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      开始诊断
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Dashboard */}
            <AnalysisDashboard 
              overallScore={result.overallScore} 
              stageScores={result.stageScores} 
            />

            {/* Mistakes List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>🔍</span> 关键改进点 ({result.mistakes.length})
              </h3>
              {result.mistakes.map((mistake) => (
                <MistakeCard key={mistake.id} mistake={mistake} />
              ))}
            </div>

            {/* Action */}
            <div className="pt-8 pb-20 flex justify-center">
              <button 
                onClick={() => { setResult(null); setSelectedImage(null); }}
                className="text-gray-500 hover:text-gray-800 text-sm underline"
              >
                诊断下一张
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
