import { Moon, Sun } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/useThemeStore";

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark 
          ? "bg-slate-900 border border-slate-700" 
          : "bg-white border border-slate-200",
        className
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "transform translate-x-0 bg-slate-800" 
              : "transform translate-x-8 bg-slate-100 shadow-sm"
          )}
        >
          {isDark ? (
            <Moon 
              className="w-4 h-4 text-slate-100" 
              strokeWidth={1.5}
            />
          ) : (
            <Sun 
              className="w-4 h-4 text-amber-500" 
              strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark 
              ? "bg-transparent" 
              : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun 
              className="w-4 h-4 text-slate-500 dark:text-slate-400" 
              strokeWidth={1.5}
            />
          ) : (
            <Moon 
              className="w-4 h-4 text-slate-400" 
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </div>
  );
}
