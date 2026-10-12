import React, { useState } from 'react';
import Header from './components/Header';
import RecordUploader from './components/RecordUploader';
import IntelligencePanel from './components/IntelligencePanel';
import VoiceActionBar from './components/VoiceActionBar';
import DoctorReadySummary from './components/DoctorReadySummary';
import AbhaManager from './components/AbhaManager';
import CopilotChat from './components/CopilotChat';
import PitchPresentationModal from './components/PitchPresentationModal';
import PrimaryNavigation from './components/PrimaryNavigation';
import { sampleRecords } from './data/sampleRecords';
import { translations } from './data/translations';
import { defaultAbhaProfile } from './data/mockAbhaData';
import { 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Activity, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activeRecord, setActiveRecord] = useState(sampleRecords[0]);
  const [recordsList, setRecordsList] = useState(sampleRecords);
  const [abhaProfile, setAbhaProfile] = useState(defaultAbhaProfile);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState('comparator');
  const [activeSection, setActiveSection] = useState('upload');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const t = translations[currentLang] || translations.en;

  // Web Speech API Text-to-Speech Handler
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert(t.speechUnsupported);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = activeRecord?.plainSummary?.[currentLang] || activeRecord?.plainSummary?.en || "";
    if (!textToSpeak) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRecordSelected = (record) => {
    setActiveRecord(record);
    if (!recordsList.some(r => r.id === record.id)) {
      setRecordsList(prev => [record, ...prev]);
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section === 'chat') {
      setIsChatOpen(true);
      return;
    }

    if (section === 'records') setActivePanelTab('timeline');
    if (section === 'timeline') setActivePanelTab('trends');
    if (section === 'medcheck') setActivePanelTab('comparator');

    window.requestAnimationFrame(() => {
      document.getElementById(section === 'upload' ? 'upload-panel' : 'intelligence-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handlePanelTabChange = (tab) => {
    setActivePanelTab(tab);
    if (tab === 'comparator') setActiveSection('medcheck');
    else if (tab === 'trends') setActiveSection('timeline');
    else setActiveSection('records');
  };

  const totalMeds = recordsList.reduce((acc, r) => acc + (r.medications?.length || 0), 0);
  const abnormalCount = activeRecord?.abnormalFindings?.length || 0;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-canvas)] text-[var(--color-ink)] antialiased">
      
      {/* Subtle Mesh Gradient Glow Blobs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-sky-200/25 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-teal-200/20 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Top Navbar */}
      <Header
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        abhaProfile={abhaProfile}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onOpenAbhaModal={() => setIsAbhaModalOpen(true)}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
        onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
      />
      <PrimaryNavigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        t={t}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-5 sm:space-y-7 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Patient Dossier Header Card (Glassmorphism) */}
        <div className="glass-card rounded-2xl p-5 transition-all sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Patient Info */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-800 text-xl font-extrabold text-white sm:h-14 sm:w-14">
                RK
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {abhaProfile.fullName}
                  </h1>
                  <span className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 font-mono text-sm font-bold text-teal-950">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
                    <span>{t.abhaDemo}</span>
                  </span>
                  <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-800">
                    {t.profileDemo}
                  </span>
                </div>
                
                <p className="text-base font-normal text-slate-700">
                  {t.profileLabel} · {t.profileLocation} · <span className="font-semibold">{abhaProfile.bloodGroup}</span>
                </p>

                <p className="flex items-center gap-1.5 pt-1 text-base font-medium text-teal-950">
                  <Sparkles className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                  {t.primaryConditions}
                </p>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 self-stretch lg:self-auto shrink-0">
              <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs">
                <span className="block text-base font-bold text-slate-700">{t.scansLabel}</span>
                <span className="text-lg font-black text-[#0F172A]">{recordsList.length}</span>
                <span className="block text-sm text-slate-700">{t.digitizedLabel}</span>
              </div>

              <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs">
                <span className="block text-base font-bold text-slate-700">{t.medsLabel}</span>
                <span className="text-lg font-black text-[#0F172A]">{totalMeds}</span>
                <span className="block text-sm text-slate-700">{t.reconciledLabel}</span>
              </div>

              <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs">
                <span className="block text-base font-bold text-slate-700">{t.alertsLabel}</span>
                <span className="text-lg font-black text-amber-600">{abnormalCount + 1}</span>
                <span className="block text-sm font-medium text-amber-900">{t.reviewNeeded}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Split-Screen Dashboard (Desktop-First: Left Upload, Right Intelligence Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Drag & Drop Upload Zone + Sample Records (approx 38% width) */}
          <div id="upload-panel" className="scroll-mt-32 space-y-6 lg:col-span-5">
            <RecordUploader
              onRecordSelected={handleRecordSelected}
              activeRecordId={activeRecord?.id}
              t={t}
              isDemoMode={isDemoMode}
            />

            {/* Caregiver Quick Action Card */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">
                  {t.doctorBrief}
                </span>
                <span className="text-base font-semibold text-teal-900">{t.statusReady}</span>
              </div>
              <p className="text-base leading-relaxed text-slate-800">
                {t.clinicSummaryDescription}
              </p>
              <button
                onClick={() => setIsDoctorSummaryOpen(true)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-400 bg-white px-3.5 text-base font-bold text-slate-900 transition-colors hover:bg-slate-50"
              >
                <FileText className="w-4 h-4 text-[#0EA5E9]" />
                <span>{t.openDoctorBrief}</span>
              </button>
            </div>
          </div>

          {/* Right Column: MedCheck Intelligence Panel (approx 62% width) */}
          <div id="intelligence-panel" className="scroll-mt-32 lg:col-span-7">
            <IntelligencePanel
              record={activeRecord}
              recordsList={recordsList}
              currentLang={currentLang}
              t={t}
              isSpeaking={isSpeaking}
              onToggleSpeech={handleToggleSpeech}
              onSelectRecord={handleRecordSelected}
              activeTab={activePanelTab}
              onActiveTabChange={handlePanelTabChange}
            />
          </div>

        </div>

      </main>

      {/* Prominent Floating Voice Action Bar (Required) */}
      <VoiceActionBar
        currentLang={currentLang}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        t={t}
      />

      {/* Trust & Safety Footer Card (Required) */}
      <footer className="bg-white/90 border-t border-slate-200 mt-12 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Top Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2 font-medium">
              <span className="font-extrabold text-slate-900">{t.appTitle}</span>
              <span>•</span>
              <span>{t.tagline}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-base text-slate-800">
                {t.exportFhir}
              </span>
              <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-base font-semibold text-emerald-950">
                {t.abhaDemo}: 91-5829-4012-8831
              </span>
            </div>
          </div>

          {/* Exact Required Trust & Safety Disclaimer Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 font-medium leading-relaxed shadow-2xs">
            🛡️ <strong>{t.safetyShort}</strong>
          </div>
        </div>
      </footer>

      {/* Grounded Conversational AI Assistant */}
      <CopilotChat
        activeRecord={activeRecord}
        t={t}
        currentLang={currentLang}
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />

      {/* Doctor-Ready 1-Page Summary Modal */}
      <DoctorReadySummary
        isOpen={isDoctorSummaryOpen}
        onClose={() => setIsDoctorSummaryOpen(false)}
        patient={abhaProfile}
        activeRecord={activeRecord}
        records={recordsList}
      />

      {/* ABHA Gateway Modal */}
      <AbhaManager
        isOpen={isAbhaModalOpen}
        onClose={() => setIsAbhaModalOpen(false)}
        abhaProfile={abhaProfile}
        setAbhaProfile={setAbhaProfile}
        activeRecord={activeRecord}
      />

      {/* Hackathon Pitch Modal */}
      <PitchPresentationModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

      <PrimaryNavigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        t={t}
        mobile
      />
    </div>
  );
}
