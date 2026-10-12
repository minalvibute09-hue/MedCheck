import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function VoiceActionBar({ currentLang, isSpeaking, onToggleSpeech, t }) {
  const getLanguageLabel = () => {
    if (currentLang === 'hi') return 'हिंदी में सुनें';
    if (currentLang === 'te') return 'తెలుగులో వినండి';
    return 'Listen Aloud';
  };

  return (
    <div className="sticky bottom-6 z-30 max-w-2xl mx-auto w-full px-4">
      <div className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-soft-lg flex items-center justify-between gap-3">
        <button
          onClick={onToggleSpeech}
          className={`flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-soft-xs animate-pulse'
              : 'bg-linear-to-r from-[#0F172A] to-[#0284C7] hover:from-slate-900 hover:to-sky-600 text-white shadow-soft-xs'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4 text-white" />
              <span>{t.stopAudio || 'Stop Audio'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#0EA5E9]" />
              <span>🔊 {getLanguageLabel()}</span>
            </>
          )}
        </button>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 uppercase font-mono">
          <Sparkles className="w-3 h-3 text-[#0EA5E9]" />
          {currentLang} Voice
        </span>
      </div>
    </div>
  );
}
