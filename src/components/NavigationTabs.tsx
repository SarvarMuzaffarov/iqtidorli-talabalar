import React from 'react';
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
  User
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
  // Define tabs dynamically based on user role to guarantee role-specific views
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
          label: 'Institut Tadbirlari',
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
          label: 'E\'lonlar & Xabarlar',
          icon: Megaphone,
          badge: counts.announcements,
        },
      ];
    }

    if (currentRole === 'faculty' || currentRole === 'teacher') {
      return [
        {
          id: 'teacher_portal' as ActiveTab,
          label: 'Biriktirilgan Talabalar',
          icon: GraduationCap,
          badge: 'Ilmiy faoliyat',
        },
        {
          id: 'students' as ActiveTab,
          label: 'Barcha Talabalar',
          icon: Users,
          badge: counts.students,
        },
        {
          id: 'projects' as ActiveTab,
          label: 'Loyihalar Moduli',
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
          id: 'rating' as ActiveTab,
          label: 'Reyting Tizimi',
          icon: Trophy,
          badge: 'Top 100',
        },
        {
          id: 'faculty' as ActiveTab,
          label: 'Arizalarni Tasdiqlash',
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
      // Admin: "ozgina qisqartirilgan"
      return [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Boshqaruv Paneli',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'students' as ActiveTab,
          label: 'Iqtidorli Talabalar',
          icon: Users,
          badge: counts.students,
        },
        {
          id: 'projects' as ActiveTab,
          label: 'Loyihalar Moduli',
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
          label: 'Sertifikat & QR',
          icon: Award,
          badge: counts.certificates,
        },
        {
          id: 'announcements' as ActiveTab,
          label: 'E\'lonlar & Telegram',
          icon: Megaphone,
          badge: counts.announcements,
        },
        {
          id: 'rating' as ActiveTab,
          label: 'Reyting Tizimi',
          icon: Trophy,
          badge: 'Top 100',
        },
        {
          id: 'faculty' as ActiveTab,
          label: 'Arizalarni Tasdiqlash',
          icon: CheckCheck,
          badge: counts.pendingApprovals > 0 ? `${counts.pendingApprovals} ta` : null,
        },
      ];
    }

    // Super Admin: "super adminda hamma kerakli boshqaruv funksiyalari"
    return [
      {
        id: 'dashboard' as ActiveTab,
        label: 'Rektorat Paneli',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        id: 'superadmin_control' as ActiveTab,
        label: 'Tizim Sozlamalari & Nazorat',
        icon: ShieldCheck,
        badge: 'Rektorat',
      },
      {
        id: 'students' as ActiveTab,
        label: 'Talabalar Bazasi',
        icon: Users,
        badge: counts.students,
      },
      {
        id: 'projects' as ActiveTab,
        label: 'Loyihalar Moduli',
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
        label: 'Sertifikat & QR Markazi',
        icon: Award,
        badge: counts.certificates,
      },
      {
        id: 'announcements' as ActiveTab,
        label: 'E\'lonlar & Telegram',
        icon: Megaphone,
        badge: counts.announcements,
      },
      {
        id: 'rating' as ActiveTab,
        label: 'Reyting Tizimi',
        icon: Trophy,
        badge: 'Top 100',
      },
      {
        id: 'faculty' as ActiveTab,
        label: 'Dekanat & Tasdiqlash',
        icon: CheckCheck,
        badge: counts.pendingApprovals > 0 ? `${counts.pendingApprovals} ta` : null,
      },
      {
        id: 'analytics' as ActiveTab,
        label: 'Rektorat Analitikasi',
        icon: BarChart3,
        badge: null,
      },
    ];
  };

  const tabs = getTabs();
  const { mode } = useEyeCare();

  const navClass = mode === 'warm-sepia'
    ? 'bg-[#fffdf9]/95 border-[#e8e0d5] text-[#2d2621]'
    : mode === 'calm-dark'
    ? 'bg-[#1a2232]/95 border-[#2a364d] text-slate-200'
    : 'bg-white/95 border-slate-200/90 text-slate-700';

  return (
    <nav className={`${navClass} border-b sticky top-16 z-20 shadow-xs overflow-x-auto scrollbar-none transition-colors duration-150`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 py-2">
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (mode === 'calm-dark' ? 'text-sky-200' : 'text-amber-400') : 'opacity-70'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
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
      </div>
    </nav>
  );
};
