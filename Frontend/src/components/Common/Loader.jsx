import React from 'react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-slate-500">
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-emerald-600 ${
          sizeMap[size] || sizeMap.md
        }`}
      />
      {text && <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );
};

export default Loader;
