
import { useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

const RangeSlider = ({
  min,
  max,
  step,
  value,
  onChange,
  unit = ""
}: RangeSliderProps) => {
  const [isChanging, setIsChanging] = useState(false);
  
  // Calculate the percentage for the filled part of the slider
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative pt-1 pb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">
          {min} {unit}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {max} {unit}
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full h-2 bg-slate-200 rounded-full">
          <div
            style={{ width: `${percentage}%` }}
            className="absolute h-2 bg-primary rounded-full transition-all duration-150"
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsChanging(true)}
          onMouseUp={() => setIsChanging(false)}
          onTouchStart={() => setIsChanging(true)}
          onTouchEnd={() => setIsChanging(false)}
          className="range-slider absolute top-0 w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      
      <div
        className={`absolute ${
          isChanging ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200 bg-primary text-white text-xs font-medium py-1 px-2 rounded-md`}
        style={{ 
          left: `calc(${percentage}% - 14px)`,
          bottom: '10px',
          transform: 'translateX(-50%)'
        }}
      >
        {value} {unit}
      </div>
      
      <div
        className="absolute -bottom-7 transform -translate-x-1/2 text-sm font-medium text-primary"
        style={{ left: `${percentage}%` }}
      >
        {value} {unit}
      </div>
    </div>
  );
};

export default RangeSlider;
