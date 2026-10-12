import React, { useState } from 'react';
import { 
  X, 
  Presentation, 
  Users, 
  Layers, 
  Target, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Workflow,
  Cpu,
  Database,
  Smartphone,
  Award
} from 'lucide-react';

export default function PitchPresentationModal({ isOpen, onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: "Team of 4 Members: 24-Hour Hackathon Execution Plan",
      subtitle: "Role specializations, milestone timelines, and parallel work streams",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Member 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm">Member 1: AI / OCR & Medical NLP Lead</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Hours 0 - 20</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Document ingestion & raster preprocessing (contrast, deskew, segmentation).</li>
                <li>Vision OCR engine (Gemini Multimodal VLM + Indian handwriting heuristics).</li>
                <li>Medical NER entity parser (Brand-to-generic mapping, dosage, frequency).</li>
                <li>Plain-language medical jargon simplification & abnormal range flagging.</li>
              </ul>
            </div>

            {/* Member 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm">Member 2: Backend & ABDM / FHIR Architect</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Hours 0 - 20</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>HL7 FHIR Release 4 Document Bundle structure (Patient, Condition, Observation).</li>
                <li>LOINC code mappings for blood tests & SNOMED CT for diagnoses.</li>
                <li>Mock ABHA Gateway (14-digit ABHA validation, OTP flow, digital card).</li>
                <li>Data privacy, encryption at rest, and ABDM M1/M2 compliance readiness.</li>
              </ul>
            </div>

            {/* Member 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm">Member 3: Frontend & Multilingual UX Lead</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Hours 0 - 20</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Unified patient timeline & interactive Recharts biomarker trend tracking.</li>
                <li>Multi-language localization in 6 Indian languages (Hindi, Telugu, Tamil, Marathi, Bengali).</li>
                <li>Web Speech API Text-to-Speech audio reader for rural and elderly patients.</li>
                <li>Interactive Q&A Copilot drawer and 1-click sample dataset demo mode.</li>
              </ul>
            </div>

            {/* Member 4 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-sm">Member 4: Healthcare Safety, Pitch & Demo Lead</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Hours 0 - 24</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>MedCheck deterministic diff comparator for side-by-side prescriptions.</li>
                <li>Doctor-Ready 1-page clinic visit summary sheet.</li>
                <li>Demo dataset creation (Dr. Sharma Rx, Metropolis Lab, Apollo Discharge).</li>
                <li>Presentation slides, 3-minute winning demo video & judge Q&A pitch script.</li>
              </ul>
            </div>

          </div>

          {/* 24-Hour Timeline Milestones */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2">
              24-Hour Sprint Milestones:
            </h5>
            <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-soft-xs">
                <span className="block font-bold text-blue-700 font-mono">0h - 4h</span>
                <span className="text-[11px] text-slate-600">Schema & ABDM FHIR Architecture</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-soft-xs">
                <span className="block font-bold text-blue-700 font-mono">4h - 12h</span>
                <span className="text-[11px] text-slate-600">OCR Pipeline & Core UI Implementation</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-soft-xs">
                <span className="block font-bold text-blue-700 font-mono">12h - 18h</span>
                <span className="text-[11px] text-slate-600">Multilingual Audio, Trends & Copilot Chat</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-soft-xs">
                <span className="block font-bold text-blue-700 font-mono">18h - 24h</span>
                <span className="text-[11px] text-slate-600">Testing, Pitch Deck & Live Demo Polish</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Technical Architecture & Data Pipeline",
      subtitle: "End-to-end data flow from document ingestion to ABDM FHIR R4 Bundle",
      content: (
        <div className="space-y-4">
          
          <div className="p-5 bg-slate-900 rounded-xl text-slate-100 font-mono text-xs space-y-3.5 border border-slate-800">
            <div className="flex items-center justify-between text-blue-400 font-bold border-b border-slate-800 pb-2.5">
              <span>MEDCHECK END-TO-END PIPELINE</span>
              <span>STANDARDS: HL7 FHIR R4 • ABDM M1/M2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-blue-400 font-bold mb-1">1. INGESTION</div>
                <div className="text-[11px] text-slate-300">Prescriptions, Lab PDFs, Scans, Camera Photos</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-blue-400 font-bold mb-1">2. OCR & VLM</div>
                <div className="text-[11px] text-slate-300">Gemini Vision / Preprocessing / Bounding Box NER</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-blue-400 font-bold mb-1">3. REASONING</div>
                <div className="text-[11px] text-slate-300">Ontology Mapping (SNOMED, LOINC, Drug Interactions)</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-emerald-400 font-bold mb-1">4. ABDM STORAGE</div>
                <div className="text-[11px] text-slate-300">FHIR R4 Bundle + Longitudinal Patient Graph</div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg text-[11px] text-slate-300 space-y-1">
              <p>• <strong>Medical Record Intelligence:</strong> Ingests complex multi-line prescriptions, extracting dosages, timings, duration, and test ranges.</p>
              <p>• <strong>Clinical Safety Shield:</strong> Checks cross-document medication conflicts (e.g. Atorvastatin + Macrolide caution, NSAID renal warnings).</p>
              <p>• <strong>Accessibility Engine:</strong> Localized summaries in 6 Indian languages + Web Speech API audio for illiterate/elderly citizens.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">FHIR Bundle (Document)</span>
              <p className="text-slate-600 text-[11px]">NRCeS DocumentBundle containing Composition, Patient, Practitioner, and clinical entries.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Clinical Observations</span>
              <p className="text-slate-600 text-[11px]">LOINC coded laboratory tests with numerical values, units, and interpretation flags (H, L, N).</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">ABHA Health Locker Link</span>
              <p className="text-slate-600 text-[11px]">14-digit ABHA ID, PHR handle, mock OTP verification, and instant FHIR JSON export.</p>
            </div>
          </div>

        </div>
      )
    },
    {
      title: "Evaluation Scorecard & 100-Point Alignment",
      subtitle: "How MedCheck comprehensively scores maximum marks in every judging bracket",
      content: (
        <div className="space-y-3.5">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Criterion</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">What Judges Look For</th>
                  <th className="py-2.5 px-3">MedCheck Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">AI Utilization</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">35%</td>
                  <td className="py-2.5 px-3 text-slate-600">Accuracy of OCR, test values, dosages, plain-language summaries</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Multimodal OCR + Medical NER + Jargon Explainer + Abnormal Flags</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Technical Architecture</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">25%</td>
                  <td className="py-2.5 px-3 text-slate-600">Clean data pipeline, sensible storage, ABDM-ready schema</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">FHIR R4 Document Bundle, SNOMED & LOINC codes, ABHA Mock Gateway</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">User Experience</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">20%</td>
                  <td className="py-2.5 px-3 text-slate-600">Easy upload flow, readable summaries, health timeline</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Drag-and-drop, 1-Click Samples, Interactive Trends, Audio TTS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Healthcare Impact</td>
                  <td className="py-2.5 px-3 font-bold text-blue-700">10%</td>
                  <td className="py-2.5 px-3 text-slate-600">Medical correctness, safe wording, appropriate disclaimers</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">MedCheck dose comparator, doctor questions, zero diagnosis guarantee</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-900">Bonus Credits</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">+10 Pts</td>
                  <td className="py-2.5 px-3 text-slate-600">Multi-language support (Hindi, Telugu) & ABDM/ABHA link</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Hindi/Telugu/English voice + Digital ABHA Card + FHIR Export</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <span className="font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Total Potential Score: 100/100 + Full Bonus Credit Achieved
            </span>
            <span className="text-[11px] font-mono bg-blue-200/80 px-2.5 py-0.5 rounded text-blue-900 font-bold">
              Altrix Labs Ready
            </span>
          </div>
        </div>
      )
    },
    {
      title: "3-Minute Winning Demo Script for Judges",
      subtitle: "Step-by-step presentation flow during the live evaluation booth",
      content: (
        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-blue-800 block mb-1">
              [0:00 - 0:40] Minute 1: The Human Problem & Ingestion
            </span>
            <p className="text-slate-700 leading-relaxed">
              "Judges, an average Indian chronic patient holds 10+ fragmented paper prescriptions and lab reports. When Metropolis reports HbA1c 8.2%, elderly parents don't know what it means or which medicine dose to take. We built MedCheck — an AI health copilot that explains medical records in your family's language and flags medicine conflicts, without ever diagnosing. Watch as I load Metropolis Lab..."
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-blue-800 block mb-1">
              [0:40 - 1:40] Minute 2: Plain Language Summaries & Regional Voice Audio
            </span>
            <p className="text-slate-700 leading-relaxed">
              "In milliseconds, our pipeline extracts the medicines, dosages, and abnormal values. Instead of jargon, MedCheck explains in plain language: 'Your 3-month sugar HbA1c is 8.2%, which is above the 7.0% goal.' Switch to Hindi or Telugu — the summary updates instantly, and an elderly user can click 'सुनिए (Audio)' to hear it spoken aloud via the browser Web Speech API!"
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-blue-800 block mb-1">
              [1:40 - 3:00] Minute 3: MedCheck Comparator, Doctor Summary & ABDM
            </span>
            <p className="text-slate-700 leading-relaxed">
              "Look at our core MedCheck comparator: it compares the Nov 2023 prescription against Mar 2024, flags that Metformin was escalated from 500mg to 1000mg, cites the exact source dates, and gives you a 1-page Doctor-Ready Summary to bring to the clinic. Under the hood, it's 100% ABDM-ready with 14-digit ABHA and HL7 FHIR R4 JSON export."
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-soft-lg border border-slate-200 overflow-hidden my-8 animate-scaleUp">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Altrix Labs Hackathon Pitch & Team Architecture
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                24-Hour Physical Hackathon Strategy • 4-Member Execution Roadmap
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

        {/* Slide Tabs (shadcn style) */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 overflow-x-auto">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-3.5 py-2.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
                activeSlide === idx
                  ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Slide {idx + 1}: {s.title.split(':')[0]}
            </button>
          ))}
        </div>

        {/* Slide Content */}
        <div className="p-6 sm:p-7">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-slate-900 tracking-tight">
              {slides[activeSlide].title}
            </h4>
            <p className="text-xs text-slate-500 font-normal">
              {slides[activeSlide].subtitle}
            </p>
          </div>

          {slides[activeSlide].content}

          {/* Slide Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={activeSlide === 0}
              onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer"
            >
              Previous Slide
            </button>

            <span className="text-xs font-mono text-slate-400">
              {activeSlide + 1} / {slides.length}
            </span>

            <button
              disabled={activeSlide === slides.length - 1}
              onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition shadow-soft-xs cursor-pointer"
            >
              Next Slide
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
