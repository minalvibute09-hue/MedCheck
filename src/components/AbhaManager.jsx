import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  QrCode, 
  Download, 
  CheckCircle2, 
  FileCode, 
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatAbhaNumber, validateAbhaNumber } from '../data/mockAbhaData';
import { generateFhirBundle } from '../data/fhirExport';

export default function AbhaManager({ 
  isOpen, 
  onClose, 
  abhaProfile, 
  setAbhaProfile, 
  activeRecord 
}) {
  const [step, setStep] = useState('card');
  const [inputNumber, setInputNumber] = useState('14-8291-0392-1940');
  const [inputOtp, setInputOtp] = useState('');
  const [copiedFhir, setCopiedFhir] = useState(false);

  if (!isOpen) return null;

  const fhirBundle = generateFhirBundle(abhaProfile, activeRecord);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!validateAbhaNumber(inputNumber)) {
      alert("Please enter a valid 14-digit ABHA number");
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setAbhaProfile(prev => ({
      ...prev,
      abhaNumber: inputNumber,
      isVerified: true
    }));
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setStep('card');
  };

  const handleDownloadFhir = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fhirBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medcheck-abdm-fhir-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyFhir = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirBundle, null, 2));
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-soft-lg border border-slate-200 overflow-hidden my-8 animate-scaleUp">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ABDM & ABHA Health Gateway
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                Ayushman Bharat Digital Mission (M1 & M2) Compliant Data Model
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tab Navigation (shadcn clean style) */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2">
          <button
            onClick={() => setStep('card')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              step === 'card' 
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital ABHA Card
          </button>
          <button
            onClick={() => setStep('fhir')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              step === 'fhir' 
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ABDM FHIR R4 Schema Export
          </button>
          <button
            onClick={() => setStep('link')}
            className={`px-4 py-2.5 border-b-2 transition cursor-pointer ${
              step === 'link' || step === 'otp'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Link / Re-verify ABHA
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          
          {/* TAB 1: Digital ABHA Card */}
          {step === 'card' && (
            <div className="space-y-6">
              
              {/* Official-Style ABHA Card */}
              <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50/70 p-5 shadow-soft relative overflow-hidden">
                
                {/* Tricolor Stripe Header */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-500 via-white to-emerald-600"></div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-soft-xs">
                      AB
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        National Health Authority
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Ayushman Bharat Digital Mission (ABDM)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active Verified
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 items-center">
                  <div className="col-span-1 flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shadow-soft-xs">
                    <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center p-1 border border-slate-200 mb-2">
                      <QrCode className="w-14 h-14 text-slate-800" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Scan for PHR</span>
                  </div>

                  <div className="col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Cardholder Name:</span>
                      <p className="font-extrabold text-slate-900 text-base">{abhaProfile.fullName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">ABHA Number:</span>
                        <p className="font-mono font-bold text-blue-700 text-sm">{abhaProfile.abhaNumber}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">ABHA Address:</span>
                        <p className="font-mono font-bold text-slate-800">{abhaProfile.abhaAddress}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Gender:</span>
                        <p className="font-medium text-slate-700">{abhaProfile.gender}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">DOB:</span>
                        <p className="font-medium text-slate-700">{abhaProfile.dob}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Blood Group:</span>
                        <p className="font-bold text-rose-700">{abhaProfile.bloodGroup}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>State: {abhaProfile.district}, {abhaProfile.state}</span>
                  <span className="font-mono">ABHA M1/M2 Sync: Active</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{abhaProfile.healthRecordsCount} Health records indexed and linked to your ABDM PHR locker</span>
                </div>

                <button
                  onClick={() => setStep('fhir')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-soft-xs cursor-pointer"
                >
                  <FileCode className="w-4 h-4" />
                  <span>View ABDM FHIR R4 Bundle</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: ABDM FHIR R4 Schema JSON */}
          {step === 'fhir' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    HL7 FHIR Release 4 Document Bundle
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Mapped to NRCeS India standard profiles (Bundle, Patient, Condition, MedicationStatement, Observation)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFhir}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                  >
                    {copiedFhir ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedFhir ? 'Copied' : 'Copy JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFhir}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-soft-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Bundle</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto max-h-80 border border-slate-800 leading-relaxed">
                {JSON.stringify(fhirBundle, null, 2)}
              </pre>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Profile</span>
                  <span className="font-semibold text-slate-800">FHIR R4 NRCeS</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Terminology</span>
                  <span className="font-semibold text-slate-800">SNOMED & LOINC</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Identity</span>
                  <span className="font-semibold text-slate-800">14-Digit ABHA</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Locker</span>
                  <span className="font-semibold text-slate-800">HIP / HIU Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Link / Re-verify ABHA */}
          {step === 'link' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Enter 14-Digit ABHA Number:
                </label>
                <input
                  type="text"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(formatAbhaNumber(e.target.value))}
                  placeholder="14-8291-0392-1940"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Format: XX-XXXX-XXXX-XXXX (e.g. 14-8291-0392-1940)
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Demo Mode: You can use the pre-filled mock ABHA ID or enter any 14 digits to test the OTP flow.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('card')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-soft-xs transition cursor-pointer"
                >
                  Send Mobile OTP
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Enter 6-Digit OTP sent to linked mobile:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-lg font-bold tracking-widest text-slate-900 text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setInputOtp('123456')}
                    className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    Auto-Fill (123456)
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Simulation: Enter <span className="font-mono font-bold">123456</span> or click Auto-Fill
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('link')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-soft-xs transition cursor-pointer"
                >
                  Verify & Sync Health Locker
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
