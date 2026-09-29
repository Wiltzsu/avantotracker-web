import React from 'react';

export interface OptionButtonItem {
  label: string;
  value: string;
}

interface OptionButtonsProps {
  options: OptionButtonItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  compact?: boolean;
}

const OptionButtons: React.FC<OptionButtonsProps> = ({
  options,
  value,
  onChange,
  className = '',
  compact = false,
}) => (
  <div
    className={`option-buttons ${compact ? 'compact' : ''} ${className}`.trim()}
    role="group"
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`option-btn ${value === option.value ? 'active' : ''}`}
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default OptionButtons;
