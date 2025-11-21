'use client';

import React, { useState, useEffect } from 'react';
import configData from '@/data/config.json';
import { Config, Stage, Trigger, TacticalCardData, Script } from '@/types';
import SetupBar from '@/components/SetupBar';
import StageNavigator from '@/components/StageNavigator';
import TriggerMatrix from '@/components/TriggerMatrix';
import TacticalCard from '@/components/TacticalCard';
import { AlertCircle } from 'lucide-react';

// Initialize Config
const appConfig: Config = configData as unknown as Config;

export default function Home() {
  // State
  const [currentStageId, setCurrentStageId] = useState<string>(appConfig.stages[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [tacticalData, setTacticalData] = useState<TacticalCardData | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [setupConfig, setSetupConfig] = useState({
    industry: 'SaaS',
    productName: 'CRM系统',
    role: '电销'
  });

  // Load Persistence
  useEffect(() => {
    const savedConfig = localStorage.getItem('setup_config');
    if (savedConfig) {
        try { setSetupConfig(JSON.parse(savedConfig)); } catch(e) {}
    }
    const savedConvId = localStorage.getItem('combat_conversation_id');
    if (savedConvId) setConversationId(savedConvId);
  }, []);

  // Save Config on Change
  useEffect(() => {
    localStorage.setItem('setup_config', JSON.stringify(setupConfig));
  }, [setupConfig]);

  // Derived State
  const currentStage = appConfig.stages.find(s => s.id === currentStageId) || appConfig.stages[0];

  // Handlers
  const handleStageSelect = (stageId: string) => {
    setCurrentStageId(stageId);
    setTacticalData(null); // Clear previous results on stage change
  };

  const handleTriggerSelect = async (trigger: Trigger, customQuery?: string) => {
    setIsLoading(true);
    setTacticalData(null);

    try {
      // Real API Call
      const response = await fetch('/api/combat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              ...setupConfig,
              stage: currentStage.id,
              triggerValue: trigger.value,
              problemType: trigger.problem_type,
              query: customQuery,
              conversationId: conversationId
          })
      });

      if (!response.ok) throw new Error("API Request Failed");
      
      const { data, conversation_id } = await response.json();
      
      setTacticalData(data);
      
      // Update and Persist Conversation ID
      if (conversation_id && conversation_id !== conversationId) {
          setConversationId(conversation_id);
          localStorage.setItem('combat_conversation_id', conversation_id);
      }

    } catch (error) {
      console.error("Error fetching tactics:", error);
      
      // Fallback Mode (Offline or API Fail)
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockResponse: TacticalCardData = {
        diagnosis: customQuery 
          ? `(离线模式) 客户反馈: "${customQuery}"` 
          : `(离线模式) 客户表现出【${trigger.problem_type}】阻碍。`,
        tags: ['#OfflineFallback'],
        scripts: [
          {
            type: 'soft',
            content: trigger.default_script || "网络似乎断开了，但我建议您先表示理解..."
          }
        ],
        warning: "当前为离线兜底模式，请检查网络或 API 配置。",
        files: []
      };
      setTacticalData(mockResponse);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* 1. Global Setup */}
      <SetupBar config={setupConfig} onConfigChange={setSetupConfig} />

      {/* 2. Stage Navigator */}
      <StageNavigator 
        stages={appConfig.stages} 
        currentStageId={currentStageId} 
        onStageSelect={handleStageSelect} 
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-5xl mx-auto w-full grid md:grid-cols-12 gap-6">
        
        {/* 3. Trigger Matrix (Left/Top) */}
        <div className="md:col-span-5 space-y-4">
          <TriggerMatrix 
            stage={currentStage} 
            onTriggerSelect={handleTriggerSelect} 
            isLoading={isLoading} 
          />
          
          {/* Context Helper */}
          <div className="hidden md:block p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
            <div className="flex items-center gap-2 font-bold mb-2">
              <AlertCircle size={16} />
              <span>阶段目标: {currentStage.name}</span>
            </div>
            <p>{currentStage.goal}</p>
          </div>
        </div>

        {/* 4. Tactical HUD (Right/Bottom) */}
        <div className="md:col-span-7">
           <TacticalCard data={tacticalData} isLoading={isLoading} />
        </div>

      </div>
    </main>
  );
}
