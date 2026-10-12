import React from 'react';
import { 
  Printer, 
  X, 
  FileText, 
  AlertTriangle, 
  HelpCircle, 
  Calendar,
  Stethoscope
} from 'lucide-react';

export default function DoctorReadySummary({ 
  isOpen, 
  onClose, 
  patient, 
  activeRecord, 
  records = [] 
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const latestRx = records.find(r => r.type === 'prescription') || activeRecord;
  const latestLab = records.find(r => r.type === 'lab_report') || activeRecord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Dialog Card */}
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-soft-lg border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:m-0 print:max-w-none">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base">
              Doctor-Ready 1-Page Clinic Visit Summary
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-soft-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Printable 1-Page Medical Document Body */}
        <div className="p-7 sm:p-9 space-y-6 text-slate-800 font-sans print:p-4 print:text-xs">
          
          {/* Clinic Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-tight">MedCheck</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Clinical Encounter Summary
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Structured for Physician Consultation & Medication Reconciliation
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block font-mono">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-slate-500 font-mono">ABHA: {patient?.abhaNumber}</span>
            </div>
          </div>

          {/* Patient Demographics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name:</span>
              <span className="font-extrabold text-slate-900">{patient?.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender:</span>
              <span className="font-semibold text-slate-800">36 Yrs / Male</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group:</span>
              <span className="font-bold text-rose-700">{patient?.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Primary Diagnoses:</span>
              <span className="font-semibold text-slate-800">Type 2 DM, HTN</span>
            </div>
          </div>

          {/* Section 1: Reconciled Current Medications */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
              1. Current Prescribed Medications (Reconciled from Latest Documents)
            </h4>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Medicine Name</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Frequency & Timing</th>
                  <th className="py-2.5 px-3">Prescribed Date & Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(latestRx?.medications || []).map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">{m.name}</td>
                    <td className="py-2 px-3 font-mono text-blue-700 font-semibold">{m.dosage}</td>
                    <td className="py-2 px-3">{m.frequency} ({m.timing})</td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{latestRx.date} ({latestRx.facility.split(',')[0]})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Recent Out-Of-Range Lab Findings */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              2. Recent Abnormal Diagnostic Values (Reported: {latestLab?.date || '10-Mar-2024'})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
                <span className="font-bold text-slate-800 block">HbA1c (Glycated Hb)</span>
                <span className="text-base font-black text-rose-700 font-mono">8.2 %</span>
                <span className="text-[10px] text-slate-500 block">Target: &lt; 7.0 % (High)</span>
              </div>
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
                <span className="font-bold text-slate-800 block">Fasting Blood Sugar</span>
                <span className="text-base font-black text-rose-700 font-mono">148 mg/dL</span>
                <span className="text-[10px] text-slate-500 block">Target: 70 - 99 mg/dL</span>
              </div>
              <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
                <span className="font-bold text-slate-800 block">Serum Triglycerides</span>
                <span className="text-base font-black text-rose-700 font-mono">242 mg/dL</span>
                <span className="text-[10px] text-slate-500 block">Target: &lt; 150 mg/dL</span>
              </div>
            </div>
          </div>

          {/* Section 3: Longitudinal Trends */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              3. Longitudinal Trend Comparison (Prior Visit vs Current Visit)
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block">Blood Pressure:</span>
                <p className="text-slate-600">146/94 mmHg (Nov 2023) &rarr; <strong className="text-emerald-700">142/90 mmHg (Mar 2024)</strong> [Improving]</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Fasting Sugar:</span>
                <p className="text-slate-600">165 mg/dL (Nov 2023) &rarr; <strong className="text-blue-700">148 mg/dL (Mar 2024)</strong> [Decreasing]</p>
              </div>
            </div>
          </div>

          {/* Section 4: Open Questions */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              4. Open Questions to Verify in this Consultation
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-800 font-medium">
              <li>Confirm if Amlodipine 5mg from earlier clinic is completely replaced by Telmisartan 40mg.</li>
              <li>With HbA1c at 8.2%, should Metformin dosage be continued at 1000mg twice daily?</li>
              <li>Should kidney microalbuminuria urine test be ordered to monitor renal filtration?</li>
            </ol>
          </div>

          {/* Mandatory Caution Disclaimer */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="italic">
              This prototype uses fictional data and is not a substitute for professional medical advice.
            </span>
            <span className="font-mono text-slate-400">MedCheck v1.0 • Built for Family Caregivers</span>
          </div>

        </div>

      </div>
    </div>
  );
}
