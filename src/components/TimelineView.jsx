import React, { useState } from 'react';
import { 
  Calendar, 
  Stethoscope, 
  FileSpreadsheet, 
  Building2, 
  Languages, 
  ArrowRight
} from 'lucide-react';
import { sampleRecords } from '../data/sampleRecords';

export default function TimelineView({ 
  records = sampleRecords, 
  activeRecordId, 
  onSelectRecord, 
  t,
  currentLang = 'en'
}) {
  const [filterType, setFilterType] = useState('all');

  const filteredRecords = records.filter(r => {
    if (filterType === 'all') return true;
    if (filterType === 'prescription') return r.type.includes('prescription');
    if (filterType === 'lab') return r.type.includes('lab');
    if (filterType === 'discharge') return r.type.includes('discharge');
    return true;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getRecordIcon = (type) => {
    if (type.includes('prescription')) return Stethoscope;
    if (type.includes('lab')) return FileSpreadsheet;
    if (type.includes('discharge')) return Building2;
    return Languages;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7 mb-8">
      
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {t.unifiedTimeline}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            {t.timelineDescription}
          </p>
        </div>

        {/* Filter Pills (shadcn clean style) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'prescription', label: t.filterPrescriptions },
            { id: 'lab', label: t.filterLabs },
            { id: 'discharge', label: t.filterDischarges }
          ].map(pill => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              aria-pressed={filterType === pill.id}
              className={`min-h-11 rounded-lg border px-3 text-base font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === pill.id
                  ? 'bg-blue-600 text-white shadow-soft-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      {sortedRecords.length === 0 ? (
        <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-base text-slate-800">
          {t.emptyRecords}
        </p>
      ) : (
      <div className="relative space-y-5 pl-6 before:absolute before:bottom-3 before:left-2.5 before:top-3 before:w-0.5 before:bg-slate-300 sm:pl-8 sm:before:left-3.5">
        {sortedRecords.map((item, index) => {
          const Icon = getRecordIcon(item.type);
          const isSelected = activeRecordId === item.id;

          return (
            <div key={item.id || index} className="relative group">
              <div className={`absolute -left-6 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 sm:-left-8 sm:h-7 sm:w-7 ${
                isSelected
                  ? 'border-white bg-teal-800 text-white ring-4 ring-teal-100'
                  : 'border-slate-400 bg-white text-slate-700'
              }`}>
                <Icon aria-hidden="true" className="h-4 w-4" />
              </div>
              <button
                type="button"
                onClick={() => onSelectRecord(item)}
                className={`block w-full rounded-xl border p-4 text-left transition-colors sm:p-5 ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50 shadow-sm'
                    : 'border-slate-300 bg-white hover:border-teal-700 hover:bg-teal-50/50'
                }`}
              >
                <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <span className="mb-1 inline-block rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 font-mono text-base font-bold text-slate-900">
                      {item.date}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 text-base font-medium text-slate-700">
                    <Building2 aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
                    {item.facility}
                  </span>
                </div>
                <p className="mb-3 line-clamp-2 text-base leading-relaxed text-slate-800">
                  {item.plainSummary?.[currentLang] || item.plainSummary?.en || t.summarySource}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.diagnoses?.slice(0, 2).map((d, i) => (
                      <span key={i} className="rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-800">
                        {d.name}
                      </span>
                    ))}
                    {item.medications?.length > 0 && (
                      <span className="rounded-lg border border-teal-300 bg-teal-50 px-2 py-1 text-sm font-semibold text-teal-950">
                        {item.medications.length} {t.medsLabel}
                      </span>
                    )}
                    {item.abnormalFindings?.length > 0 && (
                      <span className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-950">
                        {item.abnormalFindings.length} {t.alertsLabel}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-base font-semibold text-teal-950">
                    {isSelected ? t.activeRecord : t.selectRecord}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </button>

            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
