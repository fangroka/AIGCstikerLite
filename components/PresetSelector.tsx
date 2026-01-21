
import React from 'react';
import { PRESETS } from '../types';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const PresetSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">快捷动作与表情方案</p>
          <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">24 个方案</span>
        </div>
        <p className="text-[10px] text-slate-300 font-medium italic">提示：再次点击已选项可取消选择</p>
      </div>
      
      {/* 平铺式网格设计 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 md:gap-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            className={`group relative flex flex-col items-center justify-center aspect-square rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all duration-300 ${
              selected === preset.id
                ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-500/20 scale-105 z-10'
                : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-md'
            }`}
          >
            {selected === preset.id && (
              <div className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                 <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="text-2xl md:text-3xl mb-1 transition-transform group-hover:scale-125 duration-300">{preset.emoji}</span>
            <span className={`text-[10px] md:text-xs font-bold truncate w-full px-1 text-center ${selected === preset.id ? 'text-indigo-600' : 'text-slate-500'}`}>
              {preset.label}
            </span>
            
            {/* Hover 提示效果 */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30">
              {preset.action}
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-center gap-3">
        <span className="text-xl">💡</span>
        <p className="text-[11px] text-indigo-600 font-medium">
          若不选择预设，AI 将在生成阶段尝试根据您在下一步填写的“表情包文案”来构思最合适的角色神态。
        </p>
      </div>
    </div>
  );
};

export default PresetSelector;
