import React, { useState, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp, Database, User, Briefcase, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

interface SetupConfig {
  industry: string;
  productName: string;
  role: string;
}

interface SetupBarProps {
  config: SetupConfig;
  onConfigChange: (newConfig: SetupConfig) => void;
}

export default function SetupBar({ config, onConfigChange }: SetupBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (key: keyof SetupConfig, value: string) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
  };

  const handleSave = () => {
    onConfigChange(localConfig);
    setIsOpen(false);
  };

  return (
    <div className="bg-slate-900 text-white shadow-lg z-50">
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Settings size={18} className="text-white" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <h1 className="font-bold text-lg tracking-tight">Sales Guard</h1>
            {!isOpen && (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="bg-slate-800 px-2 py-0.5 rounded">{localConfig.industry}</span>
                <span className="hidden md:inline text-slate-600">/</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">{localConfig.productName}</span>
              </div>
            )}
            <Link href="/review" className="text-sm text-slate-300 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              <FolderOpen size={16} /> 复盘模式
            </Link>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Dropdown Content */}
      <div className={clsx(
        "overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-800",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 space-y-4 md:flex md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold uppercase mb-1 flex items-center gap-1">
              <Briefcase size={12} /> 行业
            </label>
            <select 
              value={localConfig.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="SaaS">SaaS 软件</option>
              <option value="医美">医美</option>
              <option value="教培">教育培训</option>
              <option value="金融">金融理财</option>
              <option value="房地产">房地产</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold uppercase mb-1 flex items-center gap-1">
              <Database size={12} /> 产品名称
            </label>
            <input 
              type="text" 
              value={localConfig.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="例如：热玛吉"
            />
          </div>

          <div className="flex-1">
            <label className="text-xs text-slate-400 font-semibold uppercase mb-1 flex items-center gap-1">
              <User size={12} /> 销售角色
            </label>
            <select 
              value={localConfig.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="电销">电话销售 (SDR)</option>
              <option value="面销">大客户销售 (AE)</option>
              <option value="售前">售前工程师</option>
              <option value="客服">售后客服</option>
            </select>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            应用配置
          </button>
        </div>
      </div>
    </div>
  );
}
