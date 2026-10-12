import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet,
  Stethoscope,
  Building2,
  Languages,
  Camera
} from 'lucide-react';
import { sampleRecords } from '../data/sampleRecords';
import { extractMedicalDocument } from '../services/api';
import { Skeleton } from './ui/Skeleton';

const sampleButtons = [
  {
    id: "rec-rx-001",
    label: "Dr. Sharma Rx (Diabetes & BP)",
    category: "Prescription",
    badge: "Metformin 1000mg + Telmisartan 40mg",
    date: "12-Mar-2024",
    facility: "Max Super Speciality Hospital",
    icon: Stethoscope
  },
  {
    id: "rec-lab-002",
    label: "Metropolis Lab (HbA1c 8.2%)",
    category: "Lab Panel",
    badge: "Fasting Sugar 148 • Lipids 228",
    date: "10-Mar-2024",
    facility: "Metropolis Diagnostic Labs",
    icon: FileSpreadsheet
  },
  {
    id: "rec-bilingual-004",
    label: "Bilingual Handwritten Rx",
    category: "Prior Visit",
    badge: "Metformin 500mg + Amlodipine 5mg",
    date: "05-Nov-2023",
    facility: "Sanjeevani Clinic, Varanasi",
    icon: Languages
  },
  {
    id: "rec-dis-003",
    label: "Apollo Hospital Discharge",
    category: "Inpatient",
    badge: "Acute Bronchitis & Inhaler",
    date: "22-Jan-2024",
    facility: "Apollo Hospitals, Bengaluru",
    icon: Building2
  }
];

export default function RecordUploader({ 
  onRecordSelected, 
  activeRecordId, 
  t,
  isDemoMode,
  accessToken
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState("");
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const documentInputRef = useRef(null);

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleSelectSample = (recordId) => {
    const found = sampleRecords.find(r => r.id === recordId);
    if (found) {
      setIsProcessing(true);
      setProgressStep(t.uploadBusy);
      setTimeout(() => {
        setIsProcessing(false);
        onRecordSelected(found);
      }, 400);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setUploadError(t.uploadTooLarge);
      return;
    }
    const extensionMimeTypes = {
      pdf: 'application/pdf',
      txt: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp'
    };
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type || extensionMimeTypes[extension] || '';
    if (!['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)) {
      setUploadError(t.uploadFailed);
      return;
    }
    setUploadError('');
    setPreviewUrl(file.type.startsWith('image/') ? URL.createObjectURL(file) : '');
    setIsProcessing(true);
    setProgressStep(t.readingDocument);

    try {
      setProgressStep(t.processingExtract);
      let document;
      if (mimeType === 'text/plain') {
        document = { fileName: file.name, mimeType, text: await file.text() };
      } else {
        const bytes = new Uint8Array(await file.arrayBuffer());
        let binary = '';
        const chunkSize = 0x8000;
        for (let offset = 0; offset < bytes.length; offset += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
        }
        document = {
          fileName: file.name,
          mimeType,
          data: window.btoa(binary)
        };
      }

      setProgressStep(t.processingValidate);
      const { record } = await extractMedicalDocument(accessToken, document);
      onRecordSelected(record);
    } catch (err) {
      console.error('Document extraction failed:', err);
      setUploadError(err.message || t.uploadFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 transition-all sm:p-6 sm:space-y-5" aria-busy={isProcessing}>
      
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            <Camera className="w-5 h-5 text-[#0EA5E9]" />
            {t.uploadHeading}
          </h2>
          <p className="text-base font-normal text-slate-700">
            {t.uploadSubtitle}
          </p>
        </div>

      </div>

      {/* Drag & Drop Upload Zone with Animated Laser Scanning Border (Required) */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="region"
        aria-label={t.uploadHeading}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-5 text-center transition-colors sm:p-8 ${
          isDragging 
            ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 scale-[0.99]' 
            : 'border-slate-300 hover:border-[#0EA5E9] bg-white/60 hover:bg-sky-50/30'
        }`}
      >
        {/* Animated Laser Scanning Line */}
        <div className="scanner-laser"></div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />
        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.txt,image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />

        {isProcessing ? (
          <div className="py-3 space-y-3">
            <div className="w-9 h-9 border-2 border-[#0EA5E9] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-base font-semibold text-slate-900" aria-live="polite">{progressStep}</p>
            <div className="space-y-1.5 max-w-xs mx-auto">
              <Skeleton className="h-1.5 w-full rounded-full" />
              <Skeleton className="h-1.5 w-3/4 mx-auto rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-[#0EA5E9] border border-sky-100 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {t.uploadHeading}
              </p>
              <p className="text-base text-slate-700">
                {t.uploadFormats}
              </p>
            </div>
            <p className="text-base font-medium text-teal-950">{t.uploadTip}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="min-h-12 rounded-xl bg-teal-800 px-4 text-base font-bold text-white hover:bg-teal-900"
              >
                {t.uploadCamera}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  documentInputRef.current?.click();
                }}
                className="min-h-12 rounded-xl border border-slate-400 bg-white px-4 text-base font-bold text-slate-900 hover:bg-slate-50"
              >
                {t.uploadChoose}
              </button>
            </div>
          </div>
        )}
      </div>
      {previewUrl && !isProcessing && (
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white p-2">
          <img src={previewUrl} alt={t.imageAlt} className="max-h-64 w-full rounded-lg object-contain" />
        </div>
      )}
      {uploadError && (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-base text-rose-900">
          {uploadError}
        </p>
      )}
      <p className="text-base text-slate-700">{t.confirmDetails}</p>

      {/* Benchmark Sample Records (For 1-Click Stage Evaluation) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            {t.sampleRecordsHeading}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">1-Click Demo</span>
        </div>

        <div className="space-y-2">
          {sampleButtons.map((btn, index) => {
            const Icon = btn.icon;
            const isSelected = activeRecordId === btn.id;
            const sampleLabel = [t.titleSampleOne, t.titleSampleTwo, t.titleSampleFour, t.titleSampleThree][index];
            const categoryLabel = [
              t.filterPrescriptions,
              t.filterLabs,
              t.filterPrescriptions,
              t.filterDischarges
            ][index];

            return (
              <button
                key={btn.id}
                onClick={() => handleSelectSample(btn.id)}
                type="button"
                aria-pressed={isSelected}
                className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50 shadow-sm'
                    : 'border-slate-300 bg-white hover:border-teal-700 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#0EA5E9] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-slate-100 px-2 py-1 text-sm font-bold text-slate-800">
                        {categoryLabel}
                      </span>
                      <span className="font-mono text-sm text-slate-700">{btn.date}</span>
                    </div>
                    <h4 className="mt-0.5 truncate text-base font-bold text-slate-900">
                      {sampleLabel}
                    </h4>
                    <p className="truncate text-base text-slate-700">
                      {btn.badge}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex shrink-0 items-center gap-1 text-base font-bold text-teal-900">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.activeRecord}
                  </span>
                ) : (
                  <span className="shrink-0 text-base font-medium text-slate-800">
                    {t.loadSampleAction} →
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
