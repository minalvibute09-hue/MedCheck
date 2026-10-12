import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import Header from './components/Header';
import RecordUploader from './components/RecordUploader';
import IntelligencePanel from './components/IntelligencePanel';
import VoiceActionBar from './components/VoiceActionBar';
import DoctorReadySummary from './components/DoctorReadySummary';
import AbhaManager from './components/AbhaManager';
import CopilotChat from './components/CopilotChat';
import PitchPresentationModal from './components/PitchPresentationModal';
import PrimaryNavigation from './components/PrimaryNavigation';
import AuthScreen from './components/AuthScreen';
import { sampleRecords } from './data/sampleRecords';
import { translations } from './data/translations';
import { defaultAbhaProfile } from './data/mockAbhaData';
import { getLanguageLocale } from './data/languageOptions';
import {
  clearAccessToken,
  getAccessToken,
  getCurrentUser,
  getMedicalRecords,
  saveMedicalRecord,
  storeAccessToken
} from './services/api';
import { 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Activity, 
  AlertCircle,
  FileText
} from 'lucide-react';

function MedCheckDashboard({ currentUser, accessToken, conversationId, onLogout }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [activeRecord, setActiveRecord] = useState(sampleRecords[0]);
  const [recordsList, setRecordsList] = useState(sampleRecords);
  const [abhaProfile, setAbhaProfile] = useState(() => ({
    ...defaultAbhaProfile,
    fullName: currentUser.fullName
  }));
  const [recordsError, setRecordsError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isDoctorSummaryOpen, setIsDoctorSummaryOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState('comparator');
  const [activeSection, setActiveSection] = useState('upload');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    let isMounted = true;
    getMedicalRecords(accessToken)
      .then(({ records }) => {
        if (!isMounted) return;
        setRecordsList((current) => {
          const recordsById = new Map(current.map((record) => [record.id, record]));
          records.forEach((record) => recordsById.set(record.id, record));
          return [...recordsById.values()];
        });
      })
      .catch((error) => {
        console.error('Could not load saved medical records:', error);
        if (isMounted) setRecordsError(t.recordsSyncFailed);
      });
    return () => { isMounted = false; };
  }, [accessToken, t.recordsSyncFailed]);

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
    utterance.lang = getLanguageLocale(currentLang);
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRecordSelected = (record, alreadySaved = false) => {
    setActiveRecord(record);
    if (alreadySaved) setActivePanelTab('ocr');
    if (!recordsList.some(r => r.id === record.id)) {
      setRecordsList(prev => [record, ...prev]);
    }
    if (!alreadySaved && !sampleRecords.some((sample) => sample.id === record.id)) {
      saveMedicalRecord(accessToken, record).catch((error) => {
        console.error('Could not save medical record:', error);
        setRecordsError(t.recordsSyncFailed);
      });
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
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-start">
        <PrimaryNavigation
          activeSection={activeSection}
          onNavigate={handleNavigate}
          t={t}
          currentUser={currentUser}
          onOpenDoctorSummary={() => setIsDoctorSummaryOpen(true)}
          onOpenAbhaModal={() => setIsAbhaModalOpen(true)}
          onLogout={onLogout}
        />

      {/* Main Container */}
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 space-y-5 px-4 py-5 sm:space-y-7 sm:px-6 sm:py-8 lg:px-8">
        {recordsError && (
          <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-base text-amber-950">
            {recordsError}
          </p>
        )}
        
        {/* Patient Dossier Header Card (Glassmorphism) */}
        <div className="glass-card rounded-2xl p-5 transition-all sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Patient Info */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-700 to-cyan-600 text-xl font-extrabold text-white ring-4 ring-teal-100 shadow-md sm:h-14 sm:w-14">
                {currentUser.fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')}
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
                <p className="text-base text-slate-700">{currentUser.email}</p>
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-400 bg-white px-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50 lg:hidden"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  {t.signOut}
                </button>
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
              accessToken={accessToken}
              currentLang={currentLang}
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
      </div>

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
        accessToken={accessToken}
        conversationId={conversationId}
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

function conversationIdForUser(userId) {
  const key = `medcheck.conversation.${userId}`;
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [currentLang, setCurrentLang] = useState('en');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    function handleUnauthorized() {
      setAccessToken('');
      setCurrentUser(null);
      setConversationId('');
    }
    window.addEventListener('medcheck:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('medcheck:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setAuthLoading(false);
      return undefined;
    }

    let isMounted = true;
    getCurrentUser(token)
      .then(({ user }) => {
        if (!isMounted) return;
        setAccessToken(token);
        setCurrentUser(user);
        setConversationId(conversationIdForUser(user.id));
      })
      .catch((error) => {
        console.error('Could not restore the signed-in session:', error);
        if (isMounted) setAuthError(error.message);
      })
      .finally(() => {
        if (isMounted) setAuthLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  function handleAuthenticated({ token, user }) {
    storeAccessToken(token);
    setAccessToken(token);
    setCurrentUser(user);
    setConversationId(conversationIdForUser(user.id));
    setAuthError('');
  }

  function handleLogout() {
    clearAccessToken();
    setAccessToken('');
    setCurrentUser(null);
    setConversationId('');
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] p-6">
        <p className="text-lg font-semibold text-slate-900" role="status">{t.pleaseWait}</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <AuthScreen
        t={t}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onAuthenticated={handleAuthenticated}
        initialError={authError}
      />
    );
  }

  return (
    <MedCheckDashboard
      currentUser={currentUser}
      accessToken={accessToken}
      conversationId={conversationId}
      onLogout={handleLogout}
    />
  );
}
