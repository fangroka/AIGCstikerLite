
import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  sourceImage: string | null;
}

const LoadingOverlay: React.FC<Props> = ({ message, sourceImage }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center min-h-[550px] animate-fade-in">
      <div className="relative mb-12 flex flex-col items-center">
        {/* 源图预览 - 增加连续感，使用标准动画类 */}
        {sourceImage && (
          <div className="relative z-20 mb-[-40px] w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden animate-zoom-in">
            <img src={sourceImage} className="w-full h-full object-cover" alt="Source" />
          </div>
        )}
        
        {/* 使用 SVG 替换 Emoji 以确保跨平台显示的稳定性 */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
          <div className="relative w-36 h-36 flex items-center justify-center animate-bounce-slow">
            <svg className="w-24 h-24 text-indigo-600 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 4V2"/>
                <path d="M15 16v-2"/>
                <path d="M8 9h2"/>
                <path d="M20 9h2"/>
                <path d="M17.8 11.8 19 13"/>
                <path d="M15 9h0"/>
                <path d="M17.8 6.2 19 5"/>
                <path d="m3 21 9-9"/>
                <path d="M12.2 6.2 11 5"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 heading-font">
            正在生成{dots}
        </h2>
        
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-indigo-600 text-sm font-bold leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner relative">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[loading_5s_ease-out_forwards]"></div>
        </div>
        
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
          AI 正在分析并绘制您的专属角色
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
