import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend 
} from 'recharts';
import { TrendingUp, Activity, Heart, Droplets } from 'lucide-react';
import { historicalBiomarkers } from '../data/sampleRecords';

export default function BiomarkerTrends({ t }) {
  const [activeTab, setActiveTab] = useState('sugar');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-7 mb-8">
      
      {/* Header and Chart Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            {t.vitalsTrends}
          </h3>
          <p className="mt-0.5 text-base text-slate-700">
            {t.trendDescription}
          </p>
        </div>

        {/* Tab Switcher (shadcn style) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sugar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'sugar'
                ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.trendSugar}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'bp'
                ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.trendPressure}</span>
          </button>

          <button
            onClick={() => setActiveTab('lipids')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'lipids'
                ? 'bg-white text-slate-900 shadow-soft-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.trendLipids}</span>
          </button>
        </div>
      </div>

      {/* Interactive Charts Area */}
      {historicalBiomarkers.length <= 1 ? (
        <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-base text-slate-900">
          {t.emptyChart}
        </p>
      ) : (
        <>
      <div className="h-80 w-full pt-2" aria-label={t.trendDescription}>
        <ResponsiveContainer width="100%" height="100%">
          
          {activeTab === 'sugar' ? (
            <LineChart data={historicalBiomarkers} margin={{ top: 10, right: 30, left: 8, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#334155' }} stroke="#64748b" label={{ value: t.dateLabel, position: 'insideBottom', offset: -12 }} />
              <YAxis yAxisId="glucose" domain={[100, 200]} unit=" mg/dL" tick={{ fontSize: 12, fill: '#334155' }} stroke="#64748b" />
              <YAxis yAxisId="hba1c" orientation="right" domain={[5, 10]} unit="%" tick={{ fontSize: 12, fill: '#334155' }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine yAxisId="glucose" y={100} label={{ value: `${t.targetFasting} (100)`, fill: '#166534', fontSize: 12 }} stroke="#166534" strokeDasharray="4 4" />
              <ReferenceLine yAxisId="hba1c" y={7.0} label={{ value: `${t.targetHbA1c} (7.0%)`, fill: '#1e3a8a', fontSize: 12 }} stroke="#1e3a8a" strokeDasharray="4 4" />
              <Line yAxisId="glucose" type="monotone" dataKey="fastingGlucose" name={`${t.trendSugar} (mg/dL)`} stroke="#a16207" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
              <Line yAxisId="hba1c" type="monotone" dataKey="hba1c" name="HbA1c (%)" stroke="#1e3a8a" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
            </LineChart>
          ) : activeTab === 'bp' ? (
            <LineChart data={historicalBiomarkers} margin={{ top: 10, right: 30, left: 8, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#334155' }} stroke="#64748b" label={{ value: t.dateLabel, position: 'insideBottom', offset: -12 }} />
              <YAxis domain={[70, 160]} unit=" mmHg" tick={{ fontSize: 12, fill: '#334155' }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={120} label={{ value: `${t.targetSystolic} (120)`, fill: '#166534', fontSize: 12 }} stroke="#166534" strokeDasharray="3 3" />
              <ReferenceLine y={80} label={{ value: `${t.targetDiastolic} (80)`, fill: '#166534', fontSize: 12 }} stroke="#166534" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="systolicBp" name={`${t.targetSystolic} (mmHg)`} stroke="#9f1239" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="diastolicBp" name={`${t.targetDiastolic} (mmHg)`} stroke="#3730a3" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
            </LineChart>
          ) : (
            <LineChart data={historicalBiomarkers} margin={{ top: 10, right: 30, left: 8, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#334155' }} stroke="#64748b" label={{ value: t.dateLabel, position: 'insideBottom', offset: -12 }} />
              <YAxis domain={[100, 300]} unit=" mg/dL" tick={{ fontSize: 12, fill: '#334155' }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={200} label={{ value: `${t.targetCholesterol} (<200)`, fill: '#166534', fontSize: 12 }} stroke="#166534" strokeDasharray="3 3" />
              <ReferenceLine y={150} label={{ value: `${t.targetTriglycerides} (<150)`, fill: '#166534', fontSize: 12 }} stroke="#166534" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="totalCholesterol" name={`${t.targetCholesterol} (mg/dL)`} stroke="#991b1b" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="triglycerides" name={`${t.targetTriglycerides} (mg/dL)`} stroke="#9a3412" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
            </LineChart>
          )}

        </ResponsiveContainer>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label={t.trendDescription}>
        {historicalBiomarkers.map((entry) => {
          const values = activeTab === 'sugar'
            ? [
                entry.fastingGlucose != null && `${t.trendSugar}: ${entry.fastingGlucose} mg/dL`,
                entry.hba1c != null && `HbA1c: ${entry.hba1c}%`
              ].filter(Boolean)
            : activeTab === 'bp'
              ? entry.systolicBp != null && entry.diastolicBp != null
                ? [`${t.trendPressure}: ${entry.systolicBp}/${entry.diastolicBp} mmHg`]
                : []
              : [
                  entry.totalCholesterol != null && `${t.trendLipids}: ${entry.totalCholesterol} mg/dL`,
                  entry.triglycerides != null && `${t.trendLipids}: ${entry.triglycerides} mg/dL`
                ].filter(Boolean);
          return (
            <li key={entry.fullDate} className="rounded-lg border border-slate-300 bg-slate-50 p-3 text-base text-slate-900">
              <strong>{entry.date}</strong>
              <span className="mt-1 block text-slate-800">{values.join(' · ') || t.noLabValues}</span>
            </li>
          );
        })}
      </ul>
        </>
      )}

      {/* Clinical Interpretation Note */}
      <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700">
        <span className="font-bold text-teal-950 shrink-0">{t.chartInsight}:</span>
        <p className="leading-relaxed">{t.trendDescription}</p>
      </div>

    </div>
  );
}
