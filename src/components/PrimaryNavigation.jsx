import React from 'react';
import { FileUp, Files, TrendingUp, GitCompare, MessageCircle } from 'lucide-react';

const items = [
  { id: 'upload', labelKey: 'navUpload', icon: FileUp },
  { id: 'records', labelKey: 'navRecords', icon: Files },
  { id: 'timeline', labelKey: 'navTimeline', icon: TrendingUp },
  { id: 'medcheck', labelKey: 'navMedCheck', icon: GitCompare },
  { id: 'chat', labelKey: 'navChat', icon: MessageCircle }
];

export default function PrimaryNavigation({ activeSection, onNavigate, t, mobile = false }) {
  return (
    <nav
      aria-label={t.navLabel}
      className={mobile
        ? 'mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-slate-300 bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(23,51,58,0.08)] backdrop-blur sm:hidden'
        : 'sticky top-[6.5rem] z-30 hidden border-y border-slate-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur sm:block'}
    >
      <div className={mobile
        ? 'contents'
        : 'mx-auto flex max-w-7xl items-center justify-center gap-2'}>
        {items.map(({ id, labelKey, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={activeSection === id ? 'page' : undefined}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 text-base font-semibold transition-colors ${
              activeSection === id
                ? 'border-teal-700 bg-teal-50 text-teal-900'
                : 'border-transparent text-slate-700 hover:bg-slate-100'
            } ${mobile ? 'min-w-0 flex-col gap-0.5 px-1 py-1 text-[0.875rem]' : 'flex-1 sm:max-w-48'}`}
          >
            <Icon aria-hidden="true" className={mobile ? 'h-5 w-5' : 'h-5 w-5'} />
            <span className="truncate">{t[labelKey]}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
