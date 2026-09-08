import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Sun, 
  Moon, 
  BookOpen, 
  Check, 
  Type, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  X
} from 'lucide-react';
import { useEyeCare, EyeCareMode, FontScale } from '../context/EyeCareContext';

interface EyeCareControlsProps {
  variant?: 'button' | 'inline';
  className?: string;
}

export const EyeCareControls: React.FC<EyeCareControlsProps> = ({ 
  variant = 'button',
  className = '' 
}) => {
  const { 
    mode, 
    setMode, 
    fontScale, 
    setFontScale, 
    isBlueLightFilter, 
    setIsBlueLightFilter,
    resetEyeCare
  } = useEyeCare();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const modeIcons: Record<EyeCareMode, React.ReactNode> = {
    'soft-light': <Sun className="w-4 h-4 text-amber-500" />,
    'warm-sepia': <BookOpen className="w-4 h-4 text-amber-700" />,
    'calm-dark': <Moon className="w-4 h-4 text-indigo-400" />,
  };

  const modeLabels: Record<EyeCareMode, string> = {
    'soft-light': 'Yumshoq kunduzgi',
    'warm-sepia': 'Iliq qog‘oz (Kitobiy)',
    'calm-dark': 'Tungi sokinlik',
  };

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {/* Mode Buttons */}
        <div className="flex items-center rounded-xl p-1 bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700">
          <button
            onClick={() => setMode('soft-light')}
            title="Yumshoq kunduzgi rejim (Yaltiroqliksiz)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mode === 'soft-light'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Kunduzgi</span>
          </button>
          <button
            onClick={() => setMode('warm-sepia')}
            title="Iliq qog‘oz rejimi (Ko‘zni mutlaqo toliqtirmaydi)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mode === 'warm-sepia'
                ? 'bg-[#f4ede2] text-[#2d2621] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Iliq qog‘oz</span>
          </button>
          <button
            onClick={() => setMode('calm-dark')}
            title="Tungi sokin rejim (Qorong‘ida qulay)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mode === 'calm-dark'
                ? 'bg-slate-900 text-sky-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Tungi</span>
          </button>
        </div>

        {/* Font scale buttons */}
        <div className="flex items-center rounded-xl p-1 bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700">
          <button
            onClick={() => setFontScale('normal')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold ${
              fontScale === 'normal' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontScale('comfortable')}
            className={`px-2 py-1 rounded-md text-xs font-bold ${
              fontScale === 'comfortable' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            A+
          </button>
          <button
            onClick={() => setFontScale('spacious')}
            className={`px-2 py-1 rounded-md text-sm font-bold ${
              fontScale === 'spacious' ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            A++
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        id="eyecare-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold shadow-xs transition"
        title="Ko‘z himoyasi va qulay ko‘rinish sozlamalari"
      >
        <Eye className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">Ko‘z himoyasi</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-4 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Ko‘z himoyasi sozlamalari
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Uzoq vaqt o‘qish va ishlashda charchoqni kamaytiradi
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme modes */}
          <div className="mt-3.5 space-y-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Ranglar va yorug‘lik:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              
              {/* Soft Light */}
              <button
                onClick={() => setMode('soft-light')}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                  mode === 'soft-light'
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-900 dark:text-sky-200'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Yumshoq kunduzgi</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Yaltiroqliksiz marvarid foni, yumshoq kontrast
                    </div>
                  </div>
                </div>
                {mode === 'soft-light' && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
              </button>

              {/* Warm Sepia */}
              <button
                onClick={() => setMode('warm-sepia')}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                  mode === 'warm-sepia'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#faead6] text-amber-800">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Iliq qog‘oz (Kitobiy)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Moviy nurlarsiz, ko‘zga eng yoqimli qulay fon
                    </div>
                  </div>
                </div>
                {mode === 'warm-sepia' && <Check className="w-4 h-4 text-amber-700 dark:text-amber-400" />}
              </button>

              {/* Calm Dark */}
              <button
                onClick={() => setMode('calm-dark')}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition ${
                  mode === 'calm-dark'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-indigo-200'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Tungi sokinlik</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Chuqur kulrang, ko‘zni qamashtirmaydigan yorug‘lik
                    </div>
                  </div>
                </div>
                {mode === 'calm-dark' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
              </button>

            </div>
          </div>

          {/* Font Scale Adjuster */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-slate-500" />
                <span>Matn o‘lchami (Shrift):</span>
              </label>
              <span className="text-[10px] text-slate-500">
                {fontScale === 'normal' ? 'Standart' : fontScale === 'comfortable' ? '+10% Qulay' : '+20% Katta'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setFontScale('normal')}
                className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                  fontScale === 'normal'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Standart
              </button>
              <button
                onClick={() => setFontScale('comfortable')}
                className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                  fontScale === 'comfortable'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Qulay
              </button>
              <button
                onClick={() => setFontScale('spacious')}
                className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                  fontScale === 'spacious'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Katta
              </button>
            </div>
          </div>

          {/* Blue Light Relax Filter Toggle */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Moviy nurni filtrlash</span>
              </div>
              <div className="text-[10px] text-slate-500">
                To‘lqin spektrini ko‘zga qulay yumshatadi
              </div>
            </div>
            <button
              onClick={() => setIsBlueLightFilter(!isBlueLightFilter)}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                isBlueLightFilter ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isBlueLightFilter ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-2 text-center">
            <span className="text-[10px] text-slate-400">
              Ushbu parametrlar brauzeringizda avtomatik saqlanadi
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
