
import React from 'react';
import { STYLE_OPTIONS } from '../types';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const StyleSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">艺术风格转换</p>
        <p className="text-[10px] text-slate-300 font-medium bg-slate-100 px-3 py-1 rounded-full">选择一种艺术风格重新定义形象</p>
      </div>
      
      {/* 平铺式网格设计 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {STYLE_OPTIONS.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`group flex flex-col items-center justify-center p-4 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden aspect-[4/5] ${
              selected === style.id
                ? 'border-indigo-500 bg-indigo-50 shadow-xl ring-2 ring-indigo-500/10 scale-105 z-10'
                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            {selected === style.id && (
              <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <span className="text-4xl md:text-5xl mb-3 transition-transform group-hover:scale-110 duration-500">{style.emoji}</span>
            <div className="text-center">
              <p className={`text-xs md:text-sm font-bold whitespace-nowrap ${selected === style.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                {style.label}
              </p>
            </div>
            
            {/* Hover Tooltip */}
            <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 pointer-events-none">
              <p className="text-white text-[10px] text-center font-bold leading-tight">
                {style.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
        <span className="text-lg">💡</span>
        <p className="text-[11px] text-slate-400 italic">
          提示：除了“原图复刻”，AI 将根据角色特征进行二次艺术创作。
        </p>
      </div>
    </div>
  );
};

export default StyleSelector;
