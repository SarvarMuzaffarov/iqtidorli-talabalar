import React from 'react';

interface TktiyfLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  lightText?: boolean;
  variant?: 'full' | 'icon-only';
}

export const TktiyfLogo: React.FC<TktiyfLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lightText = true,
  variant = 'icon-only',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const imgSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Crisp Circular Seal Image from /public/tktiyf-logo.svg */}
      <div className={`relative shrink-0 rounded-full overflow-hidden shadow-md shadow-sky-950/30 ring-2 ring-sky-500/30 ${imgSize}`}>
        <img
          src="/tktiyf-logo.svg"
          alt="Toshkent kimyo-texnologiya instituti Yangiyer filiali"
          className="w-full h-full object-contain select-none"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${lightText ? 'text-sky-400' : 'text-sky-700'}`}>
            Toshkent kimyo-texnologiya instituti
          </span>
          <span className={`text-sm sm:text-base font-black tracking-tight ${lightText ? 'text-white' : 'text-slate-900'}`}>
            Yangiyer filiali
          </span>
          <span className={`text-[10px] font-semibold ${lightText ? 'text-amber-400' : 'text-amber-600'}`}>
            TalentHub — Iqtidorli talabalar platformasi
          </span>
        </div>
      )}
    </div>
  );
};
