import React, { useState } from 'react';
import { 
  GitCompare, 
  ShieldAlert, 
  Calendar, 
  Copy, 
  Check, 
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { compareMedicationDocuments } from '../services/medicationComparator';

export default function MedicationComparator({ records = [], t }) {
  const rxRecords = records.filter(r => r.medications && r.medications.length > 0);

  const [docAId, setDocAId] = useState(rxRecords[1]?.id || rxRecords[0]?.id || '');
  const [docBId, setDocBId] = useState(rxRecords[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const docA = records.find(r => r.id === docAId);
  const docB = records.find(r => r.id === docBId);

  const comparison = compareMedicationDocuments(docA, docB);

  const handleCopyQuestions = () => {
    if (!comparison?.doctorQuestions) return;
    const text = comparison.doctorQuestions.join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7 mb-8 space-y-6">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-soft-xs">
          <GitCompare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {t.tabMedCheck}
          </h3>
          <p className="text-base text-slate-700">
            {t.compareDescription}
          </p>
        </div>
      </div>

      {/* Safety Notice Box (Spacious & Minimal) */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 text-base">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-teal-900" />
        <div className="space-y-1">
          <p className="font-semibold leading-relaxed text-slate-900">{t.safetyNotice}</p>
          <p className="leading-relaxed text-slate-800">{t.intentionalChange}</p>
        </div>
      </div>

      {/* Document Selectors (Desktop-first clean inputs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/60 rounded-xl border border-slate-200/70">
        
        {/* Document A Selector */}
        <div>
          <label className="mb-1.5 block text-base font-bold text-slate-800">
            {t.olderDocument}:
          </label>
          <div className="relative">
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              aria-label={t.olderDocument}
              className="min-h-12 w-full appearance-none rounded-xl border border-slate-400 bg-white p-3 pr-8 text-base font-semibold text-slate-900"
            >
              {rxRecords.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.date}) — {r.facility}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
          {docA && (
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-slate-400" /> Date: {docA.date} • {docA.medications?.length || 0} Meds
            </p>
          )}
        </div>

        {/* Document B Selector */}
        <div>
          <label className="mb-1.5 block text-base font-bold text-slate-800">
            {t.newerDocument}:
          </label>
          <div className="relative">
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              aria-label={t.newerDocument}
              className="min-h-12 w-full appearance-none rounded-xl border border-slate-400 bg-white p-3 pr-8 text-base font-semibold text-slate-900"
            >
              {rxRecords.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.date}) — {r.facility}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
          {docB && (
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-slate-400" /> Date: {docB.date} • {docB.medications?.length || 0} Meds
            </p>
          )}
        </div>

      </div>

      {/* Comparison Items Table */}
      {comparison && comparison.items.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-base font-bold text-slate-900">
              {t.comparisonItems} ({comparison.items.length})
            </span>
            <span className="text-base text-slate-700">
              {t.source} · {t.dateLabel}
            </span>
          </div>

          <div className="space-y-3">
            {comparison.items.map((item, idx) => {
              const differs = item.changeType !== 'Unchanged';
              return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-colors ${
                  differs
                    ? 'border-amber-300 bg-amber-50/50 hover:bg-amber-50'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.drugKey}
                    </h4>
                    <span className="text-base text-slate-700">
                      {item.category}
                    </span>
                  </div>

                  <span className={`inline-flex min-h-10 items-center gap-1.5 self-start rounded-lg border px-3 text-base font-bold sm:self-auto ${
                    differs
                      ? 'border-amber-400 bg-amber-100 text-amber-950'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  }`}>
                    {differs
                      ? <ShieldAlert aria-hidden="true" className="h-5 w-5" />
                      : <Check aria-hidden="true" className="h-5 w-5" />}
                    {differs ? t.differs : t.noDifference}
                  </span>
                </div>

                {/* Side-by-Side Document Details */}
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-300 bg-white p-3 text-base md:grid-cols-2">
                  
                  {/* Earlier Record */}
                  <div className="space-y-1">
                    <span className="block text-base font-bold text-slate-800">
                      {t.olderDocument}: {item.docA ? item.docA.title : t.noneLabel} · {item.docA ? item.docA.date : t.noneLabel}
                    </span>
                    {item.docA ? (
                      <div>
                        <p className="font-bold text-slate-900">{item.docA.name} — <span className="font-mono text-teal-900">{item.docA.dosage}</span></p>
                        <p className="text-base text-slate-800">{t.frequency}: {item.docA.frequency} · {item.docA.timing}</p>
                        <p className="mt-1 text-base text-slate-700">{t.source}: {item.docA.facility}</p>
                      </div>
                    ) : (
                      <p className="text-base text-slate-700">{t.noneLabel}</p>
                    )}
                  </div>

                  {/* Later Record */}
                  <div className="space-y-1 md:border-l md:border-slate-200 md:pl-3">
                    <span className="block text-base font-bold text-slate-800">
                      {t.newerDocument}: {item.docB ? item.docB.title : t.noneLabel} · {item.docB ? item.docB.date : t.noneLabel}
                    </span>
                    {item.docB ? (
                      <div>
                        <p className="font-bold text-slate-900">{item.docB.name} — <span className="font-mono text-teal-900">{item.docB.dosage}</span></p>
                        <p className="text-base text-slate-800">{t.frequency}: {item.docB.frequency} · {item.docB.timing}</p>
                        <p className="mt-1 text-base text-slate-700">{t.source}: {item.docB.facility}</p>
                      </div>
                    ) : (
                      <p className="text-base text-slate-700">{t.noneLabel}</p>
                    )}
                  </div>

                </div>

                {/* Clinical Context */}
                {differs && (
                  <p className="mt-2 rounded-lg border border-amber-300 bg-white p-3 text-base leading-relaxed text-slate-900">
                    <strong>{t.reviewDifference}:</strong> {item.clinicalNote}
                  </p>
                )}

              </div>
              );
            })}
          </div>

          {/* Generated Doctor / Pharmacist Verification Questions */}
          {comparison.doctorQuestions.length > 0 && (
            <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-700" />
                  <h4 className="text-base font-bold text-slate-900 sm:text-lg">
                    {t.doctorQuestionsHeading}
                  </h4>
                </div>

                <button
                  onClick={handleCopyQuestions}
                  aria-label={copied ? t.copiedLabel : t.copyQuestions}
                  className="inline-flex min-h-12 items-center gap-1.5 rounded-lg border border-slate-400 bg-white px-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? t.copiedLabel : t.copyQuestions}</span>
                </button>
              </div>

              <p className="text-base text-slate-800">
                {t.intentionalChange}
              </p>

              <div className="space-y-2">
                {comparison.doctorQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="flex items-start gap-2.5 rounded-lg border border-slate-300 bg-white p-3 text-base text-slate-900">
                    <span className="font-bold text-blue-600 shrink-0 mt-0.5">{qIdx + 1}.</span>
                    <p className="font-medium text-slate-800">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-center text-base text-slate-800">
          {t.noComparison}
        </p>
      )}

    </div>
  );
}
