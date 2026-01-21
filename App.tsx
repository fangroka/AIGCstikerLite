
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  AppState, 
  PRESETS, 
  LAYOUTS, 
  STYLE_OPTIONS,
  FOCUS_OPTIONS, 
  RESOLUTION_OPTIONS, 
  LayoutPosition, 
  FocusArea, 
  ResolutionValue, 
  GeneratedAssets 
} from './types';

// Components
import Header from './components/Header';
import PresetSelector from './components/PresetSelector';
import StyleSelector from './components/StyleSelector';
import LayoutSelector from './components/LayoutSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingOverlay from './components/LoadingOverlay';
import SelectionGrid from './components/SelectionGrid';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(''); // 初始值为空，不默认选择
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLE_OPTIONS[0].id);
  const [selectedLayout, setSelectedLayout] = useState<LayoutPosition>('bottom-center');
  const [selectedFocus, setSelectedFocus] = useState<FocusArea>('upper');
  const [selectedResolution, setSelectedResolution] = useState<ResolutionValue>(640);
  const [customText, setCustomText] = useState<string>('');
  const [customAction, setCustomAction] = useState<string>('');
  const [results, setResults] = useState<GeneratedAssets | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string>('');

  const reset = () => {
    setAppState(AppState.IDLE);
    setUserImage(null);
    setResults(null);
    setErrorMsg(null);
    setCustomText('');
    setCustomAction('');
    setSelectedPreset('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = (base64Source: string, text: string, layout: LayoutPosition, outputSize: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("无法创建绘图上下文");

        canvas.width = outputSize;
        canvas.height = outputSize;
        
        ctx.clearRect(0, 0, outputSize, outputSize);
        
        const padding = Math.floor(outputSize * 0.05);
        const drawSize = outputSize - padding * 2;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, padding, padding, drawSize, drawSize);

        if (layout !== 'none' && text) {
          const fontSize = Math.floor(outputSize * 0.12);
          ctx.font = `bold ${fontSize}px "Microsoft YaHei", "PingFang SC", "Heiti SC", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          let posX = outputSize / 2;
          let posY = outputSize / 2;
          const textMargin = padding;

          switch (layout) {
            case 'top-center': posY = textMargin + fontSize/2; break;
            case 'bottom-center': posY = outputSize - textMargin - fontSize/2; break;
            case 'left-center': ctx.textAlign = 'left'; posX = textMargin; break;
            case 'right-center': ctx.textAlign = 'right'; posX = outputSize - textMargin; break;
            case 'top-left': ctx.textAlign = 'left'; posX = textMargin; posY = textMargin + fontSize/2; break;
            case 'top-right': ctx.textAlign = 'right'; posX = outputSize - textMargin; posY = textMargin + fontSize/2; break;
            case 'around': posY = textMargin + fontSize/2; break;
          }

          ctx.strokeStyle = 'white';
          ctx.lineWidth = Math.max(6, Math.floor(outputSize * 0.04));
          ctx.strokeText(text, posX, posY);
          ctx.fillStyle = '#FF4D4D'; 
          ctx.fillText(text, posX, posY);
        }
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      img.onerror = () => reject("图像处理失败，请重试");
      img.src = base64Source;
    });
  };

  const generateMeme = async () => {
    if (!userImage) return;
    setAppState(AppState.ANALYZING);
    setLoadingMsg('正在分析角色特征...');
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const base64Data = userImage.split(',')[1];
      const mimeType = userImage.split(';')[0].split(':')[1];
      
      const analysisResp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ inlineData: { data: base64Data, mimeType } }, { text: "Describe the character in this image for recreation. Focus on unique features and clothing." }] }]
      });

      const charDesc = analysisResp.text || "character";
      const preset = PRESETS.find(p => p.id === selectedPreset);
      const style = STYLE_OPTIONS.find(s => s.id === selectedStyle);
      
      // 优先级：手动描述 > 预设动作 > 表情包文案 > 默认表情
      const action = customAction || preset?.action || (customText ? `acting out the expression of "${customText}"` : "smiling naturally");

      setAppState(AppState.GENERATING);
      setLoadingMsg(`并发生成 4 个创意方案中...`);

      let focusPrompt = "full body";
      if (selectedFocus === 'face') focusPrompt = "close-up portrait";
      if (selectedFocus === 'upper') focusPrompt = "waist-up pose";

      let styleInstruction = "";
      if (selectedStyle === 'original') {
        styleInstruction = "Keep original style perfectly.";
      } else if (selectedStyle === 'sticker-cutout') {
        styleInstruction = "Die-cut sticker style, thick bold white outline border around the character, bright clean colors.";
      } else {
        styleInstruction = `Style: ${style?.label}. ${style?.description}.`;
      }

      const generatePromises = Array.from({ length: 4 }).map((_, i) => 
        ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ 
              inlineData: { data: base64Data, mimeType } 
            }, { 
              text: `High quality sticker design. 
              CHARACTER: ${charDesc}. 
              POSE: ${action}. 
              VIEW: ${focusPrompt}. 
              STYLE: ${styleInstruction}
              - SOLID clean #FFFFFF WHITE background.
              - NO text in image.
              - Perfectly centered.` 
            }]
          },
          config: { imageConfig: { aspectRatio: "1:1" } }
        })
      );

      const responses = await Promise.all(generatePromises);
      const candidateUrls: string[] = [];

      responses.forEach(resp => {
        for (const part of resp.candidates[0].content.parts) {
          if (part.inlineData) {
            candidateUrls.push(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      });

      if (candidateUrls.length === 0) throw new Error("生成失败，请重试。");

      setResults({ imageUrl: '', candidates: candidateUrls });
      setAppState(AppState.SELECTING);
    } catch (err: any) {
      setErrorMsg(err.message || "生成过程出现未知错误");
      setAppState(AppState.ERROR);
    }
  };

  const handleSelectCandidate = async (url: string) => {
    setAppState(AppState.GENERATING);
    setLoadingMsg('正在后期处理并渲染文字...');
    try {
      const finalMemeText = customText || (customAction ? "" : PRESETS.find(p => p.id === selectedPreset)?.label) || "";
      const finalImg = await processImage(
        url, 
        finalMemeText, 
        selectedLayout, 
        selectedResolution
      );
      setResults({ imageUrl: finalImg });
      setAppState(AppState.COMPLETED);
    } catch (err: any) {
      setErrorMsg("后期渲染失败");
      setAppState(AppState.ERROR);
    }
  };

  const SectionStep = ({ num, color = "indigo" }: { num: number, color?: string }) => {
    const colorClasses: Record<string, string> = {
      indigo: "bg-indigo-600 shadow-indigo-100",
      purple: "bg-purple-600 shadow-purple-100",
      pink: "bg-pink-600 shadow-pink-100",
      blue: "bg-blue-600 shadow-blue-100"
    };
    return (
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${colorClasses[color]} text-white flex items-center justify-center font-bold text-2xl md:text-3xl shrink-0 shadow-xl`}>
        {num}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-start justify-center p-4 md:p-12">
      <div className="w-full max-w-6xl bg-white rounded-[3.5rem] shadow-[0_32px_128px_rgba(15,23,42,0.12)] border border-slate-200/60 overflow-hidden animate-zoom-in">
        {appState === AppState.COMPLETED ? (
          <ResultDisplay assets={results!} onReset={reset} />
        ) : (appState === AppState.ANALYZING || appState === AppState.GENERATING) ? (
          <LoadingOverlay message={loadingMsg} sourceImage={userImage} />
        ) : appState === AppState.SELECTING ? (
          <SelectionGrid candidates={results?.candidates || []} onSelect={handleSelectCandidate} onBack={reset} />
        ) : (
          <div className="flex flex-col">
            <Header />
            <div className="p-8 md:p-16 space-y-20">
              
              {/* 1. 形象与风格 */}
              <section className="space-y-12 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-8 rounded-[3rem] border border-slate-200/60 shadow-inner">
                  <SectionStep num={1} color="indigo" />
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">角色形象与艺术风格</h2>
                    <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">提供一张角色照片，并选择您心仪的艺术渲染风格</p>
                  </div>
                  <label className="cursor-pointer group">
                    <div className="bg-white border-2 border-indigo-600 text-indigo-600 px-10 py-5 rounded-[2rem] text-lg font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md active:scale-95">
                      {userImage ? '更换角色照片' : '上传形象照片'}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>

                {userImage && (
                  <div className="animate-zoom-in w-full">
                    <div className="bg-white p-6 rounded-[3rem] border border-slate-200/60 shadow-sm relative overflow-hidden group/preview">
                      <div className="absolute top-4 left-6 z-10">
                        <span className="bg-indigo-600/90 backdrop-blur text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg">当前参考形象</span>
                      </div>
                      <button 
                        onClick={() => setUserImage(null)}
                        className="absolute top-4 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors active:scale-90"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                      <div className="flex justify-center bg-slate-50/50 rounded-[2rem] overflow-hidden border border-slate-100">
                         <img 
                          src={userImage} 
                          alt="Uploaded character" 
                          className="max-h-[350px] object-contain transition-transform duration-700 group-hover/preview:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {userImage && (
                  <div className="animate-fade-in pt-4">
                    <StyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />
                  </div>
                )}
              </section>

              {/* 2. 动作方案 - 增加可选性说明 */}
              <section className="space-y-10 animate-fade-in border-t border-slate-100 pt-16">
                <div className="flex items-center gap-6">
                  <SectionStep num={2} color="purple" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-800">表情动作方案</h2>
                      <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest">可选</span>
                    </div>
                    <p className="text-sm text-slate-400">选择预设动作，或在下一步直接输入文案让 AI 自动生成神态</p>
                  </div>
                </div>
                <PresetSelector 
                  selected={selectedPreset} 
                  onSelect={(id) => { 
                    // 允许取消选择
                    setSelectedPreset(prev => prev === id ? '' : id); 
                    setCustomAction(""); 
                  }} 
                />
              </section>

              {/* 3. 文字定制 */}
              <section className="space-y-10 animate-fade-in border-t border-slate-100 pt-16">
                <div className="flex items-center gap-6">
                  <SectionStep num={3} color="pink" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">个性化定制</h2>
                    <p className="text-sm text-slate-400">设置专属文案（AI 将根据文案内容自动构思角色神态）</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">表情包文案内容</p>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="如: 收到、赞、太离谱了"
                        className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-100/30 text-lg font-bold placeholder:font-normal placeholder:text-slate-300 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">细节动作微调 (可选)</p>
                      <input
                        type="text"
                        value={customAction}
                        onChange={(e) => setCustomAction(e.target.value)}
                        placeholder="如: 背景有烟花、戴着墨镜"
                        className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-100/30 text-lg font-bold placeholder:font-normal placeholder:text-slate-300 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <LayoutSelector selected={selectedLayout} onSelect={setSelectedLayout} />
                </div>
              </section>

              {/* 4. 输出设置 */}
              <section className="animate-fade-in border-t border-slate-100 pt-16">
                <div className="flex items-center gap-6 mb-10">
                  <SectionStep num={4} color="blue" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">输出渲染偏好</h2>
                    <p className="text-sm text-slate-400">配置最终生成的图像属性</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-10 bg-slate-50 rounded-[3.5rem] border border-slate-200/50 shadow-inner">
                  <div className="space-y-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">取景深度</p>
                    <div className="flex p-2 bg-slate-200/50 rounded-[2rem] gap-2">
                      {FOCUS_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedFocus(opt.id)}
                          className={`flex-1 py-5 px-4 rounded-[1.5rem] text-sm font-bold transition-all ${
                            selectedFocus === opt.id 
                            ? 'bg-white text-indigo-600 shadow-xl ring-1 ring-slate-200/50 scale-105' 
                            : 'text-slate-500 hover:bg-slate-200/70'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">输出分辨率</p>
                    <div className="flex p-2 bg-slate-200/50 rounded-[2rem] gap-2">
                      {RESOLUTION_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedResolution(opt.id as ResolutionValue)}
                          className={`flex-1 py-5 px-4 rounded-[1.5rem] text-sm font-bold transition-all ${
                            selectedResolution === opt.id 
                            ? 'bg-white text-indigo-600 shadow-xl ring-1 ring-slate-200/50 scale-105' 
                            : 'text-slate-500 hover:bg-slate-200/70'
                          }`}
                        >
                          {opt.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 生成按钮 */}
              <div className="flex flex-col items-center space-y-6 pt-10">
                <button
                  onClick={generateMeme}
                  disabled={!userImage}
                  className={`w-full max-w-3xl py-10 rounded-[3.5rem] font-bold text-4xl shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-8 ${
                    userImage 
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-indigo-300 hover:-translate-y-2' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span className="text-5xl animate-pulse">🎨</span>
                  {userImage ? '开始并发生成 4 款表情' : '上传形象以开始'}
                </button>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold tracking-[0.2em] uppercase bg-slate-50 px-8 py-3 rounded-full border border-slate-100">
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  Multi-Modal AI Engine Online
                </div>
              </div>

              {errorMsg && (
                <div className="p-8 bg-red-50 text-red-600 rounded-[2.5rem] text-base font-bold text-center animate-shake flex items-center justify-center gap-4 border border-red-100 shadow-sm">
                  <span className="text-2xl">⚠️</span> {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
