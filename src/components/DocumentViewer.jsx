import React, { useEffect, useState } from 'react';
import { Eye, Copy, Check, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DocumentViewer({ record, t }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('raw');

  useEffect(() => {
    setActiveTab(record?.extractionNotice ? 'parsed' : 'raw');
  }, [record?.id, record?.extractionNotice]);

  if (!record) {
    return (
      <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-base text-slate-900">
        {t.emptyRecords}
      </p>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(record.rawOcrText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden mb-8">
      
      {/* Top Header Bar */}
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-800 text-sm">
            {t.tabOcr}
          </span>
          <span className="text-[11px] font-mono bg-white text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
            {[record.type?.replaceAll('_', ' '), record.date, record.scanType].filter(Boolean).join(' · ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 text-base font-semibold">
            <button
              onClick={() => setActiveTab('raw')}
              className={`min-h-12 whitespace-nowrap rounded-lg px-3 transition-colors ${
                activeTab === 'raw'
                  ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabRaw}
            </button>
            <button
              onClick={() => setActiveTab('parsed')}
              className={`min-h-12 whitespace-nowrap rounded-lg px-3 transition-colors ${
                activeTab === 'parsed'
                  ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.tabEntities}
            </button>
          </div>

          <button
            onClick={handleCopy}
            aria-label={copied ? t.copiedLabel : t.copyText}
            className="inline-flex min-h-12 items-center gap-1.5 rounded-lg border border-slate-400 bg-white px-3 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? t.copiedLabel : t.copyText}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {record.extractionNotice && (
          <p role="note" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-base font-medium text-amber-950">
            {t.extractionReviewNotice}
          </p>
        )}
        {activeTab === 'raw' ? (
          <div>
            <div className="mb-2.5 text-base text-slate-700">
              <span>{t.rawScanDescription}</span>
            </div>
            <pre className="max-h-80 overflow-x-auto whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-900 p-5 font-mono text-base leading-relaxed text-slate-100">
              {record.rawOcrText || t.noOcrText}
            </pre>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {record.plainSummary && (
              <p className="col-span-full rounded-xl border border-teal-200 bg-teal-50 p-4 text-base leading-relaxed text-teal-950">
                {Object.values(record.plainSummary).find(Boolean)}
              </p>
            )}
            {record.extractionNotice && (
              <p className="col-span-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-base text-slate-800">
                {t.safetyShort}
              </p>
            )}
            
            {/* Extracted Diagnoses */}
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
              <span className="mb-3 block text-base font-bold text-slate-900">
                {t.diagnoses} ({record.diagnoses?.length || 0})
              </span>
              <ul className="space-y-2 text-base">
                {record.diagnoses?.map((d, i) => (
                  <li key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-soft-xs">
                    <p className="font-bold text-slate-900">{d.name}</p>
                    {(d.icd10 || d.snomedCode) && (
                      <p className="mt-1 text-base text-slate-700">
                        {[d.icd10 && `ICD-10: ${d.icd10}`, d.snomedCode && `SCT: ${d.snomedCode}`]
                          .filter(Boolean)
                          .join(' | ')}
                      </p>
                    )}
                    {d.confidence && d.confidence !== 'high' && (
                      <span className="mt-2 inline-block rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-950">
                        {t.checkExtractedValue}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Medications */}
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
              <span className="mb-3 block text-base font-bold text-slate-900">
                {t.extractedMedicines} ({record.medications?.length || 0})
              </span>
              <ul className="space-y-2 text-base">
                {record.medications?.map((m, i) => (
                  <li key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-soft-xs">
                    <p className="font-bold text-slate-900">{m.name}</p>
                    {(m.dosage || m.frequency) && (
                      <p className="text-base font-medium text-teal-900">
                        {[m.dosage, m.frequency].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {m.timing && <p className="mt-0.5 text-base text-slate-700">{m.timing}</p>}
                    {m.duration && <p className="mt-0.5 text-base text-slate-700">{m.duration}</p>}
                    {m.confidence && m.confidence !== 'high' && (
                      <span className="mt-2 inline-block rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-950">
                        {t.checkExtractedValue}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Lab Tests */}
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
              <span className="mb-3 block text-base font-bold text-slate-900">
                {t.extractedLabs} ({record.labValues?.length || 0})
              </span>
              <ul className="space-y-2 text-base">
                {record.labValues?.length > 0 ? (
                  record.labValues.map((l, i) => (
                    <li key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-soft-xs flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{l.testName}</p>
                        {l.loincCode && <p className="text-[10px] text-slate-500 font-mono">LOINC: {l.loincCode}</p>}
                        {l.referenceRange && <p className="text-sm text-slate-700">{l.referenceRange}</p>}
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-base font-bold ${
                        l.status === 'High'
                          ? 'border-rose-300 bg-rose-50 text-rose-950'
                          : l.status === 'Low' || l.status === 'Unknown'
                            ? 'border-amber-300 bg-amber-50 text-amber-950'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      }`}>
                        {l.status !== 'Normal'
                          ? <AlertTriangle aria-hidden="true" className="h-4 w-4" />
                          : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
                        {l.status === 'High'
                          ? t.statusHigh
                          : l.status === 'Low'
                            ? t.statusLow
                            : l.status === 'Unknown'
                              ? t.statusUnknown
                              : t.normal}
                        {l.value && ` · ${l.value}`}
                        {l.unit && ` ${l.unit}`}
                      </span>
                      {l.confidence && l.confidence !== 'high' && (
                        <span className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-950">
                          {t.checkExtractedValue}
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-base text-slate-800">{t.noLabValues}</p>
                )}
              </ul>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
