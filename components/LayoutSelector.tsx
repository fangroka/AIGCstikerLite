
import React from 'react';
import { LAYOUTS, LayoutPosition } from '../types';

interface Props {
  selected: LayoutPosition;
  onSelect: (id: LayoutPosition) => void;
}

const LayoutSelector: React.FC<Props> = ({ selected, onSelect }) => {
  const renderIcon = (id: LayoutPosition, isSelected: boolean) => {
    const baseClass = `w-10 h-10 border-2 rounded-xl relative flex items-center justify-center transition-colors ${isSelected ? 'border-indigo-400 bg-indigo-100/50' : 'border-slate-200 bg-slate-50'}`;
    const dot = <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-400' : 'bg-slate-300'}`}></div>;
    const bar = <div className={`w-5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-400'}`}></div>;
    const verticalBar = <div className={`w-1.5 h-5 rounded-full ${isSelected ? 'bg-indigo-600' : 'bg-slate-400'}`}></div>;

    switch (id) {
      case 'none':
        return (
          <div className={`${baseClass} overflow-hidden`}>
            {dot}
            <div className="absolute w-full h-[2px] bg-red-400/50 rotate-45"></div>
          </div>
        );
      case 'top-center':
        return <div className={baseClass}>{dot}<div className="absolute top-1">{bar}</div></div>;
      case 'bottom-center':
        return <div className={baseClass}>{dot}<div className="absolute bottom-1">{bar}</div></div>;
      case 'left-center':
        return <div className={baseClass}>{dot}<div className="absolute left-1">{verticalBar}</div></div>;
      case 'right-center':
        return <div className={baseClass}>{dot}<div className="absolute right-1">{verticalBar}</div></div>;
      case 'top-left':
        return <div className={baseClass}><div className="absolute top-1 left-1 w-2.5 h-1 rounded-full bg-indigo-600"></div><div className="absolute bottom-1 right-1">{dot}</div></div>;
      case 'top-right':
        return <div className={baseClass}><div className="absolute top-1 right-1 w-2.5 h-1 rounded-full bg-indigo-600"></div><div className="absolute bottom-1 left-1">{dot}</div></div>;
      case 'around':
        return (
          <div className={baseClass}>
            {dot}
            <div className="absolute inset-0 border-2 border-indigo-500 border-dashed rounded-full scale-90 opacity-40"></div>
          </div>
        );
      default:
        return <div className={baseClass}>{dot}</div>;
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">文案排版位置</p>
      
      {/* 平铺式网格设计 */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-[1.5rem] border-2 transition-all duration-300 ${
              selected === layout.id
                ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            {renderIcon(layout.id, selected === layout.id)}
            <span className={`text-[10px] font-bold ${selected === layout.id ? 'text-indigo-700' : 'text-slate-500'}`}>
              {layout.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
