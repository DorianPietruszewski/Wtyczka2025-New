"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  disabled?: boolean;
  className?: string;
  classNames?: Record<string, string>;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const weekDays = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];

export function Calendar({
  selected,
  onSelect,
  month: monthProp,
  onMonthChange,
  disabled,
  className,
  classNames = {},
}: CalendarProps) {
  const today = new Date();
  const [month, setMonth] = React.useState<Date>(monthProp || new Date());
  React.useEffect(() => {
    if (monthProp) setMonth(monthProp);
  }, [monthProp]);

  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const daysInMonth = getDaysInMonth(year, monthIdx);
  const firstDay = getFirstDayOfWeek(year, monthIdx);

  const handlePrevMonth = () => {
    const prev = new Date(year, monthIdx - 1, 1);
    setMonth(prev);
    onMonthChange?.(prev);
  };
  const handleNextMonth = () => {
    const next = new Date(year, monthIdx + 1, 1);
    setMonth(next);
    onMonthChange?.(next);
  };

  const handleSelect = (day: number) => {
    if (disabled) return;
    const date = new Date(year, monthIdx, day);
    onSelect?.(date);
  };

  // Dropdown state for month/year
  const [monthDropdown, setMonthDropdown] = React.useState(false);
  const [yearDropdown, setYearDropdown] = React.useState(false);
  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  const minYear = 1980;
  const maxYear = today.getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  // Handlers for dropdowns
  const handleMonthClick = () => {
    setMonthDropdown((v) => !v);
    setYearDropdown(false);
  };
  const handleYearClick = () => {
    setYearDropdown((v) => !v);
    setMonthDropdown(false);
  };
  const handleMonthSelect = (idx: number) => {
    setMonth(new Date(year, idx, 1));
    onMonthChange?.(new Date(year, idx, 1));
    setMonthDropdown(false);
  };
  const handleYearSelect = (y: number) => {
    setMonth(new Date(y, monthIdx, 1));
    onMonthChange?.(new Date(y, monthIdx, 1));
    setYearDropdown(false);
  };

  // Generate days grid
  const days: (number | null)[] = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (days.length % 7 !== 0) days.push(null);

  return (
    <div className={cn("p-3", className)}>
      <div
        className={cn(
          "flex justify-center pt-1 relative items-center w-full",
          classNames.caption
        )}
      >
        <div className="flex gap-1 items-center relative mb-6">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
            tabIndex={-1}
            style={{ alignSelf: 'center' }}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            className={cn("text-sm font-medium px-2 py-1 rounded hover:bg-cyan-800/60 focus:bg-cyan-700/80 transition", monthDropdown && "bg-cyan-900/80")}
            onClick={handleMonthClick}
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={monthDropdown}
          >
            {monthNames[monthIdx]}
          </button>
          <button
            type="button"
            className={cn("text-sm font-medium px-2 py-1 rounded hover:bg-cyan-800/60 focus:bg-cyan-700/80 transition", yearDropdown && "bg-cyan-900/80")}
            onClick={handleYearClick}
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={yearDropdown}
          >
            {year}
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
            tabIndex={-1}
            style={{ alignSelf: 'center' }}
          >
            <ChevronRight className="size-4" />
          </button>
          {monthDropdown && (
            <ul className="absolute top-full left-0 z-20 mt-1 w-32 max-h-60 overflow-y-auto bg-black/90 border border-cyan-400 rounded-md shadow-lg">
              {monthNames.map((name, idx) => (
                <li key={name}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-cyan-700/80 focus:bg-cyan-600/80 transition text-cyan-200",
                      idx === monthIdx && "bg-cyan-900/80 font-bold"
                    )}
                    onClick={() => handleMonthSelect(idx)}
                    tabIndex={0}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {yearDropdown && (
            <ul className="absolute top-full left-32 z-20 mt-1 w-24 max-h-60 overflow-y-auto bg-black/90 border border-cyan-400 rounded-md shadow-lg">
              {years.map((y) => (
                <li key={y}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-cyan-700/80 focus:bg-cyan-600/80 transition text-cyan-200",
                      y === year && "bg-cyan-900/80 font-bold"
                    )}
                    onClick={() => handleYearSelect(y)}
                    tabIndex={0}
                  >
                    {y}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="w-full border-collapse space-x-1">
        <div className={cn("flex")}>
          {weekDays.map((d, i) => (
            <div
              key={i}
              className={cn(
                "text-cyan-300 rounded-md w-9 font-normal text-[0.8rem]",
                classNames.head_cell
              )}
            >
              {d}
            </div>
          ))}
        </div>
        {Array.from({ length: days.length / 7 }, (_, rowIdx) => (
          <div key={rowIdx} className={cn("flex w-full mt-2", classNames.row)}>
            {days
              .slice(rowIdx * 7, rowIdx * 7 + 7)
              .map((day, colIdx) => {
                const isToday =
                  day &&
                  today.getDate() === day &&
                  today.getMonth() === monthIdx &&
                  today.getFullYear() === year;
                const isSelected =
                  day &&
                  selected &&
                  selected.getDate() === day &&
                  selected.getMonth() === monthIdx &&
                  selected.getFullYear() === year;
                return (
                  <button
                    key={colIdx}
                    type="button"
                    className={cn(
                      "h-9 w-9 p-0 font-normal text-cyan-200 hover:bg-cyan-400 hover:text-black rounded-md",
                      isToday && "bg-cyan-900 text-cyan-200",
                      isSelected &&
                        "bg-cyan-400 text-black hover:bg-cyan-300 hover:text-black focus:bg-cyan-400 focus:text-black",
                      !day && "invisible"
                    )}
                    disabled={!day || disabled}
                    onClick={() => day && handleSelect(day)}
                    tabIndex={day ? 0 : -1}
                  >
                    {day}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
