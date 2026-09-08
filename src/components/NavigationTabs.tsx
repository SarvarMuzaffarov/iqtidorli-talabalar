import React, { useRef, useState, useEffect } from 'react';
import { useEyeCare } from '../context/EyeCareContext';
import { 
  LayoutDashboard, 
  Users, 
  Lightbulb, 
  CalendarDays, 
  Award, 
  Megaphone, 
  Trophy, 
  CheckCheck,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab = 
  | 'dashboard'
  | 'student_portal'
  | 'teacher_portal'
  | 'superadmin_control'
  | 'students'
  | 'projects'
  | 'events'
  | 'certificates'
  | 'announcements'
  | 'rating'
  | 'faculty'
  | 'analytics';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentRole: UserRole;
  counts: {
    students: number;
    projects: number;
    events: number;
    certificates: number;
    announcements: number;
    pendingApprovals: number;
  };
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  counts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll positions
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
        checkScroll();
      }
    }
  };

  // Define tabs dynamically based on user role
  const getTabs = () => {
    if (currentRole === 'student') {
      return [
        {
          id: 'student_portal' as ActiveTab,
          label: 'Shaxsiy Kabinet & Portfolio',
          icon: User,
          badge: 'Mening profilim',
        },
        {
          id: 'events' as ActiveTab,
          label: 'Tadbirlar',
          icon: CalendarDays,
          badge: counts.events,
        },
        {
          id: 'rating' as ActiveTab,
          label: 'TKTI Reytingi',
          icon: Trophy,
          badge: 'Top 100',
        },
        {
          id: 'announcements' as ActiveTab,
          label: 'E\'lonlar',
          icon: Megaphone,
          badge: counts.announcements,
        },
      ];
    }

    if (currentRole === 'faculty' || currentRole === 'teacher') {
      return [
        {
          id: 'teacher_portal' as ActiveTab,
          label: 'Biriktirilgan Talabalarim',
          icon: GraduationCap,
          badge: counts.pendingApprovals > 0 ? `${counts.pendingApprovals} ta kutilmoqda` : 'Kabinet',
        },
        {
          id: 'projects' as ActiveTab,
          label: 'Loyihalar & Startaplar',
          icon: Lightbulb,
          badge: counts.projects,
        },
        {
          id: 'events' as ActiveTab,
          label: 'Tadbirlar & Tanlovlar',
          icon: CalendarDays,
          badge: counts.events,
        },
        {
          id: 'rating' as ActiveTab,
          label: 'Reyting',
          icon: Trophy,
          badge: 'Top 100',
        },
        {
          id: 'faculty' as ActiveTab,
          label: 'Yutuqlarni Tasdiqlash',
          icon: CheckCheck,
          badge: counts.pendingApprovals > 0 ? `${counts.pendingApprovals} ta` : null,
        },
        {
          id: 'announcements' as ActiveTab,
          label: 'E\'lonlar',
          icon: Megaphone,
          badge: counts.announcements,
        },
      ];
    }

    if (currentRole === 'admin') {
      // Admin: now has full access to accounts control and adding teachers!
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Boshqaruv Paneli',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'superadmin_control' as ActiveTab,
          label: 'Akkountlar & Nazorat',
          icon: ShieldCheck,
          badge: 'Nazorat',
        },
        {
          id: 'students' as ActiveTab,
          label: 'Talabalar',
          icon: Users,
          badge: counts.students,
        },
        {
          id: 'projects' as ActiveTab,
          label: 'Loyihalar',
          icon: Lightbulb,
          badge: counts.projects,
        },
        {
          id: 'events' as ActiveTab,
          label: 'Tadbirlar',
          icon: CalendarDays,
          badge: counts.events,
        },
        {
          id: 'certificates' as ActiveTab,
          label: 'Sertifikatlar',
          icon: Award,
          badge: counts.certificates,
        },
        {
          id: 'announcements' as ActiveTab,
          label: 'E\'lonlar',
          icon: Megaphone,
          badge: counts.announcements,
        },
        {
          id: 'rating' as ActiveTab,
          label: 'Reyting',
          icon: Trophy,
          badge: 'Top 100',
        },
        {
          id: 'faculty' as ActiveTab,
          label: 'Tasdiqlash',
          icon: CheckCheck,
          badge: counts.pendingApprovals > 0 ? `${counts.pendingApprovals} ta` : null,
        },
      ];
    }

    // Super Admin
    return [
      {
        id: 'dashboard' as ActiveTab,
        label: 'Rektorat',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        id: 'superadmin_control' as ActiveTab,
        label: 'Akkountlar & Nazorat',
        icon: ShieldCheck,
        badge: 'Rektorat',
      },
      {
        id: 'students' as ActiveTab,
        label: 'Talabalar',
        icon: Users,
        badge: counts.students,
      },
      {
        id: 'projects' as ActiveTab,
        label: 'Loyihalar',
        icon: Lightbulb,
        badge: counts.projects,
      },
      {
        id: 'events' as ActiveTab,
        label: 'Tadbirlar',
        icon: CalendarDays,
        badge: counts.events,
      },
      {
        id: 'certificates' as ActiveTab,
        label: 'Sertifikatlar',
        icon: Award,
        badge: counts.certificates,
      },
      {
        id: 'announcements' as ActiveTab,
        label: 'E\'lonlar',
        icon: Megaphone,
        badge: counts.announcements,
      },
      {
        id: 'rating' as ActiveTab,
        label: 'Reyting',
        icon: Trophy,
        badge: 'Top 100',
      },
      {
        id: 'faculty' as ActiveTab,
        label: 'Tasdiqlash',
        icon: CheckCheck,
        badge: counts.pendingApprovals > 0 ? `${counts.pendingApprovals} ta` : null,
      },
      {
        id: 'analytics' as ActiveTab,
        label: 'Analitika',
        icon: BarChart3,
        badge: null,
      },
    ];
  };

  const tabs = getTabs();
  const { mode } = useEyeCare();

  const navClass = mode === 'warm-sepia'
    ? 'bg-[#fffdf9]/98 border-[#e8e0d5] text-[#2d2621]'
    : mode === 'calm-dark'
    ? 'bg-[#1a2232]/98 border-[#2a364d] text-slate-200'
    : 'bg-white/98 border-slate-200/90 text-slate-700';

  return (
    <nav className={`${navClass} border-b sticky top-16 z-20 shadow-xs w-full max-w-full relative transition-colors duration-150`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative flex items-center">
        
        {/* Left scroll chevron */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Chapga varaqlash"
            className="absolute left-1 z-10 p-1 rounded-full bg-slate-900/80 text-white shadow-md hover:bg-slate-900 transition flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable tabs container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onWheel={handleWheel}
          className="flex items-center gap-1 sm:gap-1.5 py-2 overflow-x-auto scrollbar-none scroll-smooth w-full"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            let activeClass = '';
            let inactiveClass = '';

            if (mode === 'warm-sepia') {
              activeClass = 'bg-[#45382e] text-[#faf6ef] shadow-xs';
              inactiveClass = 'text-[#63564c] hover:text-[#2d2621] hover:bg-[#f4ede2]';
            } else if (mode === 'calm-dark') {
              activeClass = 'bg-sky-600 text-white shadow-xs';
              inactiveClass = 'text-slate-400 hover:text-slate-200 hover:bg-[#242e42]';
            } else {
              activeClass = 'bg-sky-700 text-white shadow-xs';
              inactiveClass = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
            }

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? (mode === 'calm-dark' ? 'text-sky-200' : 'text-amber-400') : 'opacity-70'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? (mode === 'warm-sepia' ? 'bg-[#312720] text-amber-200' : 'bg-slate-800 text-amber-300')
                        : (mode === 'warm-sepia' ? 'bg-[#f0e7dc] text-[#554940]' : mode === 'calm-dark' ? 'bg-[#242e42] text-slate-300' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right scroll chevron */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="O‘ngga varaqlash"
            className="absolute right-1 z-10 p-1 rounded-full bg-slate-900/80 text-white shadow-md hover:bg-slate-900 transition flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </nav>
  );
};
