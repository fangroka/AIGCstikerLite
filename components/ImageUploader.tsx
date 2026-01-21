
import React from 'react';

interface Props {
  image: string | null;
  onUpload: (image: string) => void;
}

const ImageUploader: React.FC<Props> = ({ image, onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-bold text-slate-800 heading-font">0. 上传一张照片</h3>
      <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-3xl overflow-hidden hover:border-indigo-400 transition-all aspect-square flex items-center justify-center bg-slate-50">
        {image ? (
          <img src={image} alt="User upload" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6">
            <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
              <svg className="w-8 h-8 text-slate-500 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">点击上传照片</p>
            <p className="text-xs text-slate-400 mt-1">正脸照或角色照片效果最佳</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {image && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-indigo-100">
            点击更换
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
