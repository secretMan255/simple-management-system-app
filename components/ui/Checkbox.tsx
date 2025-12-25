import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked, 
  onCheckedChange, 
  className, 
  disabled,
  ...props 
}) => {
  return (
    <div className={clsx("relative flex items-center", className)}>
      <input
        type="checkbox"
        className="peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
      <Check 
        className={clsx(
          "absolute top-0 left-0 w-4 h-4 text-white pointer-events-none opacity-0 transition-opacity",
          checked && "opacity-100"
        )} 
        strokeWidth={3}
      />
    </div>
  );
};
