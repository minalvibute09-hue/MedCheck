import React from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  Pill, 
  Stethoscope, 
  HeartPulse, 
  Info, 
  ShieldAlert, 
  Sparkles,
  Volume2,
  VolumeX,
  FileCheck,
  CheckCircle,
  Calendar,
  Building
} from 'lucide-react';
import { checkDrugInteractions } from '../services/drugInteractions';

export default function HealthSummaryCard({ 
  record, 
  currentLang, 
  t, 
  isSpeaking, 
  onToggleSpeech 
}) {
  if (!record) {
    return (
      <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-base text-slate-900">
        {t.emptyRecords}
      </p>
    );
  }

  const summaryText = record.plainSummary?.[currentLang] || record.plainSummary?.en || t.summaryUnavailable;
  const interactions = checkDrugInteractions(record.medications || []);

  return (
    <div className="space-y-5">
      <aside className="flex items-start gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 text-base text-slate-900" role="note">
        <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-teal-900" />
        <p>{t.safetyNotice}</p>
      </aside>

      {/* Main Plain-Language AI Summary Banner (Spacious, Minimal, Blue Accent) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-soft relative overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-soft-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {t.aiSummary}
              </h3>
              <p className="text-base text-slate-700">
                {t.summarySource}: <span className="font-semibold text-slate-900">{record.title}</span>
              </p>
            </div>
          </div>

          {/* Voice Read-Aloud Button */}
          <button
            onClick={onToggleSpeech}
            aria-label={isSpeaking ? t.stopButton : t.listenAloud}
            className={`inline-flex min-h-12 items-center gap-2 self-start rounded-xl border px-4 text-base font-semibold transition-colors sm:self-auto ${
              isSpeaking
                ? 'border-amber-400 bg-amber-50 text-amber-950'
                : 'border-slate-400 bg-white text-slate-900 hover:bg-slate-50'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600" />
                <span>{t.stopButton}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>{t.listenButton}</span>
              </>
            )}
          </button>
        </div>

        {/* Plain Text Body */}
        <div className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-lg leading-relaxed text-slate-900">
          {summaryText}
        </div>

        {/* Metadata Footer */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-medium bg-slate-100 px-3 py-1 rounded-lg">
            <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
            {record.doctorName}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium bg-slate-100 px-3 py-1 rounded-lg">
            <Calendar aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />
            {t.dateLabel}: {record.date}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium bg-slate-100 px-3 py-1 rounded-lg">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            {record.facility}
          </span>
          {record.vitals?.bp && (
            <span className="inline-flex items-center gap-1.5 font-medium bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg">
              <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
              {t.recordedBP}: {record.vitals.bp}
            </span>
          )}
        </div>
      </div>

      {/* Drug-Drug Interaction Safety Alert (If Present) */}
      {interactions.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{t.safetyAlerts}</span>
          </div>
          <div className="space-y-3">
            {interactions.map((alert, idx) => (
              <div key={idx} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-xs sm:text-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-amber-950">{alert.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">{alert.description}</p>
                <p className="text-blue-900 font-medium text-xs bg-white p-2 rounded-lg border border-amber-200/50">
                  💡 <strong>Recommendation:</strong> {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Out-Of-Range Lab Findings (Spacious, Minimal Cards) */}
      {record.abnormalFindings && record.abnormalFindings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base tracking-tight">
                  {t.abnormalValues}
                </h4>
                <p className="text-base text-slate-700">
                  {t.referenceRange}
                </p>
              </div>
            </div>
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-base font-semibold text-amber-950">
              {record.abnormalFindings.length} {t.abnormalTitle}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {record.abnormalFindings.map((finding, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition">
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-base font-bold text-slate-900">{finding.parameter}</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-base font-bold ${
                      finding.severity === 'Low'
                        ? 'border-amber-300 bg-amber-50 text-amber-950'
                        : 'border-rose-300 bg-rose-50 text-rose-950'
                    }`}>
                      <AlertTriangle aria-hidden="true" className="h-4 w-4" />
                      {finding.severity === 'Low'
                        ? t.statusLow
                        : finding.severity === 'Critical'
                          ? t.statusCritical
                          : t.statusHigh}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2 text-xs">
                    <span className="text-slate-700">{t.observed}:</span>
                    <span className="font-bold text-rose-700 font-mono text-sm">{finding.observed}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-700">{t.referenceRange}:</span>
                    <span className="font-mono text-slate-700">{finding.normalRange}</span>
                  </div>
                  <p className="rounded-lg border border-slate-300 bg-white p-3 text-base leading-relaxed text-slate-800">
                    {finding.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lab Tests Full Table (Clean shadcn Data Table) */}
      {record.labValues && record.labValues.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-4">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-base tracking-tight">
              Biochemical & Diagnostic Test Parameters
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-y border-slate-200/80">
                <tr>
                  <th className="py-3 px-3.5">Test Parameter</th>
                  <th className="py-3 px-3.5">Observed Value</th>
                  <th className="py-3 px-3.5">Biological Reference</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">LOINC Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {record.labValues.map((lab, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3.5 font-semibold text-slate-800">
                      {lab.testName}
                      <p className="text-[11px] font-normal text-slate-500 mt-0.5">{lab.plainExplanation}</p>
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                      {lab.value} {lab.unit}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 font-mono text-xs">
                      {lab.referenceRange}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        lab.status === 'High' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : lab.status === 'Low'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {lab.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-mono text-slate-400 text-xs">
                      {lab.loincCode || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Medications & Dosages Table */}
      {record.medications && record.medications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Pill className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-base tracking-tight">
                {t.medications}
              </h4>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {record.medications.length} Prescribed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {record.medications.map((med, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-soft-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                      {med.name}
                    </h5>
                    {med.generic && (
                      <p className="text-xs text-slate-500 font-mono">
                        {med.generic}
                      </p>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                    {med.dosage}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 my-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Frequency:</span>
                    <span className="font-semibold text-slate-800">{med.frequency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Instructions:</span>
                    <span className="font-semibold text-blue-700">{med.timing}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs mt-2">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Why Prescribed:</strong> {med.purpose}
                  </p>
                  {med.sideEffects && (
                    <p className="text-slate-500 text-[11px]">
                      ⚠️ <em>Notice:</em> {med.sideEffects}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Diagnoses & Codes */}
      {record.diagnoses && record.diagnoses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7">
          <h4 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            {t.diagnoses} (ICD-10 & SNOMED CT Coded)
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {record.diagnoses.map((diag, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium">
                <span className="font-bold">{diag.name}</span>
                {diag.icd10 && (
                  <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700 font-semibold">
                    ICD: {diag.icd10}
                  </span>
                )}
                {diag.snomedCode && (
                  <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                    SCT: {diag.snomedCode}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caregiver Action Items & Questions for Doctor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Caregiver Tips */}
        {record.lifestyleTips && record.lifestyleTips.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2 text-slate-900">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {t.lifestyleTips}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {record.lifestyleTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions for Doctor */}
        {record.doctorQuestions && record.doctorQuestions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2 text-slate-900">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              {t.questionsForDoctor}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {record.doctorQuestions.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0 mt-0.5">?</span>
                  <span className="font-medium text-slate-800">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.disclaimer}
        </p>
      </div>

    </div>
  );
}
