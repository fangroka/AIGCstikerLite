
import React from 'react';

interface Props {
  candidates: string[];
  onSelect: (url: string) => void;
  onBack: () => void;
}

const SelectionGrid: React.FC<Props> = ({ candidates, onSelect, onBack }) => {
  return (
    <div className="p-10 md:p-16 flex flex-col items-center space-y-12 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
           Step 3: Pick Your Favorite
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 heading-font">
          选出你最心仪的神韵 ✨
        </h2>
        <p className="text-slate-500 text-base font-medium max-w-md mx-auto">
          AI 为你准备了 4 个视角和神态各异的候选方案，点击一个继续后期文字处理。
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {candidates.map((url, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(url)}
            className="relative group aspect-square rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-lg transition-all hover:scale-105 hover:shadow-2xl hover:border-indigo-400 active:scale-95 bg-slate-50"
          >
            <img src={url} alt={`Candidate ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-all flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              方案 {idx + 1}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 pt-4">
        <button
          onClick={onBack}
          className="bg-white border-2 border-slate-200 text-slate-500 px-8 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50 hover:text-slate-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          回退到设置页面
        </button>
        <p className="text-[11px] text-slate-400">提示：点击图片后，系统将应用你刚才设置的文字内容与排版</p>
      </div>
    </div>
  );
};

export default SelectionGrid;
