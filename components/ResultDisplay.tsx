
import React, { useState } from 'react';
import { GeneratedAssets } from '../types';

interface Props {
  assets: GeneratedAssets;
  onReset: () => void;
}

const ResultDisplay: React.FC<Props> = ({ assets, onReset }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const downloadImage = () => {
    const a = document.createElement('a');
    a.href = assets.imageUrl;
    a.download = `AI_Sticker_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 md:p-16 flex flex-col items-center space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
           Crafted Successfully
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 heading-font">
          专属表情包已就绪! ✨
        </h2>
        <p className="text-slate-500 text-lg font-medium">角色神韵已完美捕捉，这就是你的独一无二。</p>
      </div>

      <div className="relative group max-w-md w-full">
        {/* 背景装饰：更柔和的渐变光晕 */}
        <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity rounded-full"></div>
        
        <div className="relative bg-white p-6 rounded-[3.5rem] shadow-[0_32px_96px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={assets.imageUrl} 
            alt="Generated Sticker" 
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-auto rounded-[2.5rem] transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-2xl'}`}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        <button 
          onClick={downloadImage}
          className="flex-1 bg-indigo-600 text-white py-5 px-8 rounded-3xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-95 group"
        >
          <svg className="w-7 h-7 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span className="text-xl">保存到相册</span>
        </button>
        <button 
          onClick={onReset}
          className="flex-1 bg-slate-100 text-slate-600 py-5 px-8 rounded-3xl font-bold hover:bg-slate-200 transition-all active:scale-95 border-2 border-transparent hover:border-slate-300"
        >
          重新开启创作
        </button>
      </div>
      
      <div className="bg-indigo-50/40 px-8 py-4 rounded-[2rem] border border-indigo-100/30 backdrop-blur-sm">
        <p className="text-xs text-indigo-500 font-bold flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
          💡 贴士：在微信“表情库”中点击“+”即可添加此 PNG 作为永久表情
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
