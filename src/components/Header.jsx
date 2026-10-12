import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Globe, 
  Presentation, 
  Sparkles, 
  Volume2, 
  VolumeX,
  FileText,
  ToggleLeft,
  ToggleRight,
  Zap
} from 'lucide-react';

export default function Header({ 
  currentLang, 
  setCurrentLang, 
  t, 
  abhaProfile, 
  isDemoMode,
  setIsDemoMode,
  onOpenAbhaModal, 
  onOpenPitchModal,
  onOpenDoctorSummary,
  isSpeaking,
  onToggleSpeech
}) {
  const languageOptions = [
    { code: 'en', label: 'English', locale: 'en' },
    { code: 'hi', label: 'हिन्दी', locale: 'hi' },
    { code: 'te', label: 'తెలుగు', locale: 'te' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm transition-colors">
      
      {/* Top Thin Caregiver Dossier Ribbon */}
      <div className="hidden border-b border-slate-700 bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-200 sm:block sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0EA5E9]/15 text-[#0EA5E9] font-semibold text-[11px] border border-[#0EA5E9]/30">
              <Sparkles className="w-3 h-3 text-[#0EA5E9]" />
              {t.appTitle}
            </span>
            <span className="hidden lg:inline text-slate-400 text-xs">
              {t.tagline}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.trustPolicy}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700 hidden sm:inline"></span>
            <span className="text-slate-400 hidden sm:inline">{t.exportFhir}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-2 py-2 sm:min-h-20 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="truncate text-base font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  MedCheck <span className="text-teal-800">AI</span>
                </span>
                <span className="hidden rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 font-mono text-xs font-bold text-teal-900 sm:inline-flex">
                  v2.4
                </span>
              </div>
              <p className="hidden text-sm font-medium text-slate-700 lg:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center / Right: Nav Controls */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            
            {/* 1. Prominent ABHA Linked Badge (Required) */}
            <button
              onClick={onOpenAbhaModal}
              className="hidden min-h-12 items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 text-base font-semibold text-emerald-950 transition-colors hover:bg-emerald-100 xl:inline-flex"
              title={t.abhaStatus}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline text-emerald-700 font-normal">{t.abhaStatus}:</span>
              <span className="font-mono font-bold text-emerald-900 tracking-tight">91-5829-4012-8831</span>
            </button>

            {/* 2. Live Segmented Language Switcher: English | తెలుగు | हिंदी (Required) */}
            <div role="group" className="flex gap-0.5 rounded-xl border border-slate-300 bg-slate-100 p-1 text-base font-semibold" aria-label={t.languageLabel}>
              {languageOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => setCurrentLang(opt.code)}
                  lang={opt.locale}
                  aria-label={opt.label}
                  aria-pressed={currentLang === opt.code}
                  className={`min-h-12 min-w-11 rounded-lg px-2 transition-colors cursor-pointer ${
                    currentLang === opt.code
                      ? 'border border-teal-800 bg-white font-bold text-teal-950'
                      : 'text-slate-800 hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* 3. Demo Mode Toggle Switch (Required) */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`hidden min-h-12 items-center gap-2 rounded-xl border px-3 text-base font-semibold transition-colors cursor-pointer xl:inline-flex ${
                isDemoMode
                  ? 'bg-amber-50 text-amber-900 border-amber-200 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={t.demoMode}
            >
              <Zap className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>{t.demoMode}:</span>
              <span className={`font-bold ${isDemoMode ? 'text-amber-800' : 'text-slate-500'}`}>
                {isDemoMode ? t.demoOn : t.demoOff}
              </span>
            </button>

            {/* 4. Doctor-Ready Summary Button */}
            <button
              onClick={onOpenDoctorSummary}
              className="hidden min-h-12 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 lg:inline-flex"
            >
              <FileText className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{t.doctorBrief}</span>
            </button>

            {/* 5. 24h Team Plan & Hackathon Pitch */}
            <button
              onClick={onOpenPitchModal}
              className="hidden min-h-12 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-slate-800 lg:inline-flex"
            >
              <Presentation className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{t.teamPlan}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
