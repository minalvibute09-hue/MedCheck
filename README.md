# 🩺 MedCheck AI
MedCheck helps Indian families manage their parents’ health, even when records are on paper. Users photograph a report or prescription, and the app explains it in simple Hindi, Telugu, or English, with voice. It tracks results over time and compares medicine documents, highlighting differences for a doctor or pharmacist to verify.

> **One-line Tagline:**  
> **MedCheck : an AI health copilot that explains medical records in your family’s language and flags medicine conflicts, without ever diagnosing.**

[![Status](https://img.shields.io/badge/Status-Live%20Prototype-emerald.svg)](http://localhost:5173/)
[![ABDM](https://img.shields.io/badge/ABHA%20Linked-91--5829--4012--8831-blue.svg)](http://localhost:5173/)
[![Languages](https://img.shields.io/badge/Languages-English%20%7C%20%E0%B0%A4%E0%B1%86%E0%B0%B2%E0%B1%81%E0%B0%97%E0%B1%81%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A4%80-teal.svg)](#live-language-switcher)
[![Safety](https://img.shields.io/badge/Safety-Decision--Support%20Only-amber.svg)](#trust--safety-policy)

---

## 🌟 Executive Overview & Hackathon Pitch

**MedCheck AI** is an elite, modern AI health copilot engineered for Indian family caregivers. It solves the real-world friction of deciphering paper prescriptions and diagnostic lab sheets for aging parents:
- **Scan & Understand:** Ingests paper scans, photos, and PDFs, translating medical jargon into plain words with out-of-range values highlighted.
- **Side-by-Side MedCheck Comparator:** Deterministically checks multiple visits (e.g. *Doc 1 vs Doc 2*), highlighting dose differences and drug switches.
- **Voice Readout (TTS):** Native Web Speech API audio in **Telugu, Hindi, and English**.
- **Longitudinal Timeline:** Graphs biomarkers over time (*HbA1c, Fasting Blood Sugar, Blood Pressure*).
- **Zero Diagnosis Guarantee:** Strictly decision-support. Never diagnoses; empowers the family to consult their physician.

---

## 💎 Design System: Medical Glassmorphism

1. **Theme & Palette:**
   - **Deep Trust Teal & Navy:** `#0F172A` (deep slate/navy) & `#0EA5E9` (trust teal/sky).
   - **Alert & Status Accents:** Soft mint (`#10B981`) for normal ranges and amber (`#F59E0B`) for dosage conflicts.
   - **Background:** Subtle mesh gradient over off-white slate (`#F8FAFC`) with frosted glass cards (`backdrop-filter: blur(16px)`).
2. **Navigation & Controls:**
   - **ABHA Linked Badge:** Prominently displays `91-5829-4012-8831` with a pulsing live sync indicator.
   - **Segmented Language Switcher:** Live 1-click toggle for **English | తెలుగు | हिंदी**.
   - **Demo Mode Toggle:** Instant switch between curated benchmark paper records and live AI vision mode.
3. **Split-Screen Dashboard Layout:**
   - **Left Column:** Drag-and-drop file upload zone with **animated laser scanning borders**, document preview, and 1-click benchmark records.
   - **Right Column (MedCheck Intelligence Panel):**
     - **Striking Collapsible Amber Alert Banner:** Highlights medicine dosage conflicts (e.g. Metformin 500mg vs 1000mg, Amlodipine vs Telmisartan).
     - **Side-by-Side MedCheck Comparator:** Detailed diff matrix citing source documents and dates.
     - **Scan & Understand:** Plain-language summary and highlighted out-of-range lab results.
     - **Health Timeline Graph:** Interactive Recharts line chart plotting HbA1c, Fasting Glucose, and Blood Pressure curves.
4. **Voice Action Bar:**
   - Prominent floating action bar:
     - 🔊 **"Play Audio Summary":** Triggers instant browser text-to-speech in Telugu, Hindi, or English.
   - The chat composer provides real voice questions and spoken answers in English, Hindi, and Telugu using the browser's built-in Web Speech API.
5. **Doctor-Ready 1-Page Summary:**
   - Printable clinic visit summary sheet (`window.print()`).
6. **Trust & Safety Footer:**
   > *"MedCheck is a decision-support copilot and does not provide medical diagnoses. Always consult your physician."*

---

## 🚀 How to Run

### Enable Ask Health Copilot with Gemini

1. Copy `.env.example` to `.env.local` in the project root.
2. Replace the placeholder with your Gemini API key:

   ```env
   GEMINI_API_KEY=your_actual_key
   GEMINI_MODEL=gemini-3.8-flash
   ```

   Keep the key private. Do not put it in `src/`, a `VITE_` variable, or a public repository. Set the model name in `GEMINI_MODEL` as well.
3. Restart the development server after saving `.env.local`:

   ```bash
   npm run dev
   ```

4. Open the app, select **Ask Health Copilot**, and submit a question.

The local Vite development server sends questions to Gemini from its server-side endpoint, so the API key is not sent to the browser. Questions and selected-record details are sent to Google Gemini; do not use real patient information unless you have the required consent and are comfortable with Google's data handling. This development endpoint is not included in the static production build. A deployed app needs an equivalent protected server-side API endpoint.

### Voice chat

Open **Ask Health Copilot**, choose English, Hindi, or Telugu, and tap the microphone beside the message box. Speak your question; the answer is added to chat and read aloud. Use the same button while listening to finish your question or while audio is playing to stop it. Voice chat uses the browser's built-in Web Speech API and requires microphone permission in Chrome or Edge.

```bash
# Development server (Already running live!)
npm run dev

# Open in browser:
# http://localhost:5173/
```

*MedCheck AI — Built for the Altrix Labs AI Healthcare Hackathon.*
