import React, { useState } from 'react';
import { User, GraduationCap } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadgeIcon?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  className = '',
  size = 'md',
  showBadgeIcon = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Generate clean initials from student/user name
  const getInitials = (fullName: string) => {
    if (!fullName) return 'TK';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0].slice(0, 2) || 'TK').toUpperCase();
  };

  const initials = getInitials(name);

  // Determine size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl sm:text-3xl',
  }[size];

  // Soft eye-friendly gradient based on first character code
  const charCode = (name || 'A').charCodeAt(0);
  const colorVariants = [
    'from-sky-700 to-indigo-800 text-sky-100 border-sky-600/40',
    'from-emerald-700 to-teal-800 text-emerald-100 border-emerald-600/40',
    'from-amber-700 to-amber-900 text-amber-100 border-amber-600/40',
    'from-slate-700 to-slate-900 text-slate-100 border-slate-600/40',
  ];
  const colorScheme = colorVariants[charCode % colorVariants.length];

  const isValidUrl = src && typeof src === 'string' && (src.startsWith('http') || src.startsWith('/'));

  if (!hasError && isValidUrl) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`object-cover select-none ${sizeClasses} ${className}`}
        loading="lazy"
      />
    );
  }

  // Graceful fallback badge with high visual polish, zero eye strain
  return (
    <div
      aria-label={name}
      className={`relative inline-flex items-center justify-center font-black tracking-wider uppercase select-none bg-gradient-to-br ${colorScheme} shadow-inner border ${sizeClasses} ${className}`}
    >
      <span>{initials}</span>
      {showBadgeIcon && (
        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900/80 text-amber-300 border border-slate-700">
          <GraduationCap className="w-3 h-3" />
        </span>
      )}
    </div>
  );
};
