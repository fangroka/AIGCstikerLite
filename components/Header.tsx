
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white text-center rounded-t-[2.5rem] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold heading-font mb-2 relative z-10 animate-bounce-slow">
        AIGC-Sticker-Lite
      </h1>
      <p className="text-indigo-50 text-sm md:text-base opacity-90 font-medium relative z-10 max-w-md mx-auto">
        上传形象，瞬间生成极具个性的静态表情包
      </p>
    </div>
  );
};

export default Header;