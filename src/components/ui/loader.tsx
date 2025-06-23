
import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-white z-50 flex items-center justify-center",
      className
    )}>
      <div className={cn(
        "border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin",
        sizeClasses[size]
      )}></div>
    </div>
  );
};

export default Loader;
