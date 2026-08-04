import React from 'react';
import { Leaf } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-5">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-4 border-sage-100 animate-spin border-t-sage-400" />
      <div className="absolute inset-3 rounded-full bg-sage-50 flex items-center justify-center">
        <Leaf className="w-4 h-4 text-sage-400 animate-sway" />
      </div>
    </div>
    {label && <p className="text-sm text-sage-500 font-medium animate-pulse">{label}</p>}
  </div>
);

export default LoadingSpinner;
