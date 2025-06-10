import React, { useState, useRef, useEffect } from "react";

export interface ComboBoxOption {
  value: string;
  label: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  className?: string;
  renderValue?: (value: string, option?: ComboBoxOption) => React.ReactNode;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Wybierz...",
  label,
  name,
  required = false,
  className = "",
  renderValue,
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setHighlighted(0);
      return;
    }
    if (open) {
      if (e.key === "ArrowDown") {
        setHighlighted((h) => (h + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        setHighlighted((h) => (h - 1 + options.length) % options.length);
      } else if (e.key === "Enter" && highlighted >= 0) {
        onChange(options[highlighted].value);
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block mb-1 text-cyan-400" htmlFor={name}>{label}</label>
      )}
      <button
        type="button"
        id={name}
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${name}-listbox`}
        className="w-full rounded-md border-2 border-cyan-400 bg-black text-cyan-400 p-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 text-left flex justify-between items-center"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <span>{

          value
            ? (renderValue
                ? renderValue(value, options.find((opt) => opt.value === value))
                : options.find((opt) => opt.value === value)?.label)
            : <span className="text-cyan-600">{placeholder}</span>
        }</span>
        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <ul
          id={`${name}-listbox`}
          role="listbox"
          className="absolute z-10 mt-1 min-w-[16rem] sm:min-w-[20rem] md:min-w-[24rem] max-w-[90vw] w-auto bg-black border border-cyan-400 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`cursor-pointer px-4 py-2 ${value === opt.value ? "bg-cyan-700 text-white" : "hover:bg-cyan-900 text-cyan-200"} ${highlighted === idx ? "bg-cyan-800" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlighted(idx)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { ComboBox };
