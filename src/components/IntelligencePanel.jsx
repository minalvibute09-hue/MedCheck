import React, { useState } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Eye, 
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  Pill,
  CheckCircle2
} from 'lucide-react';
import ConflictAlertBanner from './ConflictAlertBanner';
import MedicationComparator from './MedicationComparator';
import HealthSummaryCard from './HealthSummaryCard';
import BiomarkerTrends from './BiomarkerTrends';
import TimelineView from './TimelineView';
import DocumentViewer from './DocumentViewer';

export default function IntelligencePanel({
  record,
  recordsList,
  currentLang,
  t,
  isSpeaking,
  onToggleSpeech,
  onSelectRecord,
  activeTab: activeTabProp,
  onActiveTabChange
}) {
  const [internalTab, setInternalTab] = useState('comparator');
  const activeTab = activeTabProp || internalTab;
  const setActiveTab = (tab) => {
    setInternalTab(tab);
    onActiveTabChange?.(tab);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Striking Collapsible Warning Alert Banner (Doc 1 vs Doc 2 Conflict) */}
      <ConflictAlertBanner t={t} onOpenComparator={() => setActiveTab('comparator')} />

      {/* 2. Intelligence Panel Tabs Header (Medical Glassmorphism) */}
      <div className="glass-card rounded-2xl p-1.5 flex items-center gap-1 overflow-x-auto shadow-soft-xs">
        
        {/* MedCheck Comparator Tab */}
        <button
          onClick={() => setActiveTab('comparator')}
          aria-current={activeTab === 'comparator' ? 'page' : undefined}
          className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'comparator'
              ? 'bg-[#0F172A] text-white shadow-soft-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <GitCompare className="w-4 h-4 text-[#0EA5E9]" />
          <span>{t.tabMedCheck}</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-900 uppercase">
            {t.differencesCount}
          </span>
        </button>

        {/* Scan & Understand Tab */}
        <button
          onClick={() => setActiveTab('summary')}
          aria-current={activeTab === 'summary' ? 'page' : undefined}
          className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-[#0F172A] text-white shadow-soft-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#0EA5E9]" />
          <span>{t.tabSummary}</span>
        </button>

        {/* Health Timeline Graph Tab */}
        <button
          onClick={() => setActiveTab('trends')}
          aria-current={activeTab === 'trends' ? 'page' : undefined}
          className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-[#0F172A] text-white shadow-soft-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{t.tabGraph}</span>
        </button>

        {/* Longitudinal History Tab */}
        <button
          onClick={() => setActiveTab('timeline')}
          aria-current={activeTab === 'timeline' ? 'page' : undefined}
          className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#0F172A] text-white shadow-soft-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{t.tabRecords}</span>
        </button>

        {/* OCR Raw Text Tab */}
        <button
          onClick={() => setActiveTab('ocr')}
          aria-current={activeTab === 'ocr' ? 'page' : undefined}
          className={`flex min-h-12 items-center gap-2 rounded-xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'ocr'
              ? 'bg-[#0F172A] text-white shadow-soft-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span>{t.tabOcr}</span>
        </button>

      </div>

      {/* 3. Tab Contents Rendering */}
      <div className="animate-fadeIn">
        {activeTab === 'comparator' && (
          <MedicationComparator
            records={recordsList}
            t={t}
          />
        )}

        {activeTab === 'summary' && (
          <HealthSummaryCard
            record={record}
            currentLang={currentLang}
            t={t}
            isSpeaking={isSpeaking}
            onToggleSpeech={onToggleSpeech}
          />
        )}

        {activeTab === 'trends' && (
          <BiomarkerTrends t={t} />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            records={recordsList}
            activeRecordId={record?.id}
            onSelectRecord={(rec) => {
              onSelectRecord(rec);
              setActiveTab('summary');
            }}
            t={t}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'ocr' && (
          <DocumentViewer record={record} t={t} />
        )}
      </div>

    </div>
  );
}
