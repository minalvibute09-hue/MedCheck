import React from 'react';
import {
  FileUp,
  Files,
  TrendingUp,
  GitCompare,
  MessageCircle,
  FileText,
  HeartHandshake,
  LogOut
} from 'lucide-react';

const items = [
  { id: 'upload', labelKey: 'navUpload', icon: FileUp },
  { id: 'records', labelKey: 'navRecords', icon: Files },
  { id: 'timeline', labelKey: 'navTimeline', icon: TrendingUp },
  { id: 'medcheck', labelKey: 'navMedCheck', icon: GitCompare },
  { id: 'chat', labelKey: 'navChat', icon: MessageCircle }
];

export default function PrimaryNavigation({
  activeSection,
  onNavigate,
  t,
  mobile = false,
  currentUser,
  onOpenDoctorSummary,
  onOpenAbhaModal,
  onLogout
}) {
  const initials = currentUser?.fullName
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'MC';

  return (
    <nav
      aria-label={t.navLabel}
      className={mobile
        ? 'mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-slate-300 bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(23,51,58,0.08)] backdrop-blur sm:hidden'
        : 'sticky top-[6.5rem] z-30 hidden h-[calc(100vh-6.5rem)] w-64 shrink-0 flex-col border-r border-slate-200 bg-white/75 px-4 py-5 backdrop-blur lg:flex'}
    >
      {!mobile && currentUser && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-3 shadow-sm">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-700 to-cyan-600 text-sm font-black text-white ring-2 ring-white shadow-md"
            role="img"
            aria-label={`${currentUser.fullName} profile`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">{currentUser.fullName}</p>
            <p className="truncate text-xs text-slate-600">{currentUser.email}</p>
          </div>
        </div>
      )}

      <p className={mobile ? 'sr-only' : 'mb-2 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500'}>
        {t.navLabel}
      </p>
      <div className={mobile ? 'contents' : 'flex flex-1 flex-col gap-1.5'}>
        {items.map(({ id, labelKey, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={activeSection === id ? 'page' : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
              activeSection === id
                ? 'border-teal-200 bg-teal-50 text-teal-950 shadow-sm'
                : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-white hover:text-teal-900 hover:shadow-sm'
            } ${mobile ? 'min-w-0 flex-col justify-center gap-0.5 px-1 py-1 text-[0.875rem]' : 'w-full justify-start text-left'}`}
          >
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span className="truncate">{t[labelKey]}</span>
          </button>
        ))}
      </div>
      {!mobile && (
        <div className="mt-5 space-y-1 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onOpenDoctorSummary}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-950"
          >
            <FileText aria-hidden="true" className="h-5 w-5" /> {t.doctorBrief}
          </button>
          <button
            type="button"
            onClick={onOpenAbhaModal}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-950"
          >
            <HeartHandshake aria-hidden="true" className="h-5 w-5" /> {t.abhaStatus}
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-rose-50 hover:text-rose-800"
            >
              <LogOut aria-hidden="true" className="h-5 w-5" /> {t.signOut}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
