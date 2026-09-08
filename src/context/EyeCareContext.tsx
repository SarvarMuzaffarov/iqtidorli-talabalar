import React, { createContext, useContext, useState, useEffect } from 'react';

export type EyeCareMode = 'soft-light' | 'warm-sepia' | 'calm-dark';
export type FontScale = 'normal' | 'comfortable' | 'spacious';

interface EyeCareContextType {
  mode: EyeCareMode;
  setMode: (mode: EyeCareMode) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  isBlueLightFilter: boolean;
  setIsBlueLightFilter: (active: boolean) => void;
  resetEyeCare: () => void;
}

const STORAGE_KEY_MODE = 'talenthub_eyecare_mode_v2';
const STORAGE_KEY_SCALE = 'talenthub_eyecare_scale_v2';
const STORAGE_KEY_FILTER = 'talenthub_eyecare_filter_v2';

const EyeCareContext = createContext<EyeCareContextType | undefined>(undefined);

export const EyeCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<EyeCareMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODE);
      if (saved === 'warm-sepia' || saved === 'calm-dark' || saved === 'soft-light') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'soft-light';
  });

  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCALE);
      if (saved === 'comfortable' || saved === 'spacious' || saved === 'normal') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'normal';
  });

  const [isBlueLightFilter, setIsBlueLightFilterState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILTER);
      return saved !== null ? JSON.parse(saved) : true; // default enabled for eye comfort
    } catch {
      return true;
    }
  });

  const setMode = (newMode: EyeCareMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY_MODE, newMode);
    } catch (e) {
      console.error(e);
    }
  };

  const setFontScale = (newScale: FontScale) => {
    setFontScaleState(newScale);
    try {
      localStorage.setItem(STORAGE_KEY_SCALE, newScale);
    } catch (e) {
      console.error(e);
    }
  };

  const setIsBlueLightFilter = (active: boolean) => {
    setIsBlueLightFilterState(active);
    try {
      localStorage.setItem(STORAGE_KEY_FILTER, JSON.stringify(active));
    } catch (e) {
      console.error(e);
    }
  };

  const resetEyeCare = () => {
    setMode('soft-light');
    setFontScale('normal');
    setIsBlueLightFilter(true);
  };

  // Sync to documentElement classes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-soft-light', 'theme-warm-sepia', 'theme-calm-dark');
    root.classList.add(`theme-${mode}`);

    root.classList.remove('font-scale-normal', 'font-scale-comfortable', 'font-scale-spacious');
    root.classList.add(`font-scale-${fontScale}`);

    if (isBlueLightFilter && mode !== 'calm-dark') {
      root.classList.add('eye-care-filter');
    } else {
      root.classList.remove('eye-care-filter');
    }
  }, [mode, fontScale, isBlueLightFilter]);

  return (
    <EyeCareContext.Provider
      value={{
        mode,
        setMode,
        fontScale,
        setFontScale,
        isBlueLightFilter,
        setIsBlueLightFilter,
        resetEyeCare,
      }}
    >
      {children}
    </EyeCareContext.Provider>
  );
};

export const useEyeCare = (): EyeCareContextType => {
  const context = useContext(EyeCareContext);
  if (!context) {
    throw new Error('useEyeCare must be used within an EyeCareProvider');
  }
  return context;
};
