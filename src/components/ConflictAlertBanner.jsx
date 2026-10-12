import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Stethoscope, 
  ShieldAlert,
  GitCompare,
  HelpCircle
} from 'lucide-react';

export default function ConflictAlertBanner({ onOpenComparator, t }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 shadow-soft transition-all">
      
      {/* Top Banner Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-amber-950 sm:text-lg">
                {t.differencesCount}
              </span>
              <span className="rounded border border-amber-400 bg-amber-100 px-2 py-0.5 text-sm font-bold text-amber-950">
                {t.differs}
              </span>
            </div>
            <p className="mt-0.5 text-base leading-relaxed text-amber-950">
              {t.intentionalChange}
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-amber-100/80 hover:bg-amber-200 text-amber-800 transition cursor-pointer shrink-0"
          aria-label={isExpanded ? t.collapseDetails : t.expandDetails}
          title={isExpanded ? t.collapseDetails : t.expandDetails}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-amber-200/70 space-y-3.5 animate-fadeIn">
          
          {/* Conflict Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Metformin Dose Escalation */}
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-slate-800">
              <span className="mb-1 block font-bold text-amber-950">
                Metformin · {t.differs}
              </span>
              <p className="text-base text-slate-900">
                {t.olderDocument}: Metformin 500mg (1-0-1)<br/>
                {t.newerDocument}: Metformin 1000mg + Glimepiride 1mg (1-0-1)
              </p>
              <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-base font-medium text-amber-950">
                {t.intentionalChange}
              </span>
            </div>

            {/* Blood Pressure Medication Switch */}
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-slate-800">
              <span className="mb-1 block font-bold text-amber-950">
                {t.trendPressure} · {t.differs}
              </span>
              <p className="text-base text-slate-900">
                {t.olderDocument}: Amlodipine 5mg (CCB)<br/>
                {t.newerDocument}: Telmisartan 40mg (ARB)
              </p>
              <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-base font-medium text-amber-950">
                {t.intentionalChange}
              </span>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 text-xs">
            <p className="flex items-center gap-1.5 text-base font-medium text-amber-950">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              {t.intentionalChange}
            </p>

            {onOpenComparator && (
              <button
                onClick={onOpenComparator}
                className="inline-flex min-h-12 items-center gap-1.5 self-start rounded-lg bg-amber-900 px-4 text-base font-bold text-white transition-colors hover:bg-amber-950 sm:self-auto"
              >
                <GitCompare className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.tabMedCheck} →</span>
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
