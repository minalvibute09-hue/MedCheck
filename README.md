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
- **Scan & Understand:** Reads photos, handwriting, and PDFs with Gemini Vision. Extracted details include confidence indicators and should always be checked against the original.
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
   - **Sample Records:** One-click fictional examples for trying the interface.
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

### MongoDB-backed accounts, records, and chat

The existing React/Vite interface uses a separate Express API and MongoDB database named `medcheck`. The API creates its collections and indexes on first start. It stores registered accounts, uploaded/extracted record JSON, and chat messages. Demo records remain fictional and are not copied into the database automatically.

Switching from MySQL does not migrate any existing MySQL accounts, records, or chat messages. Those remain in the old MySQL database; users must register again in MongoDB unless you perform a separately planned data migration.

1. Install and start **MongoDB Community Server** locally, or create a MongoDB Atlas cluster.
2. Copy `server/.env.example` to `server/.env`. For a local installation, the default `MONGODB_URI=mongodb://127.0.0.1:27017/medcheck` works when MongoDB is running. For Atlas, replace it with your cluster connection string, database name `medcheck`, and credentials. Set `JWT_SECRET` to a unique random value at least 32 characters long, and configure `GEMINI_API_KEY` and `GEMINI_MODEL`. Do not commit either `.env` file.

3. From the project root, open two terminals:

   ```powershell
   npm run dev:api
   ```

   ```powershell
   npm run dev
   ```

   (The same commands work in other shells.)

4. Open `http://localhost:5173/`, create an account, and sign in. The Vite development server proxies `/api` calls to Express at `http://localhost:5000`.

```text
Collections: users, medicalrecords, chatmessages
Models: server/src/models/
```

Passwords are hashed with bcrypt; the browser stores a signed-in JWT in local storage. Private records and chat endpoints require that token. Use local/demo data only unless your deployment has appropriate consent, access controls, encryption, backups, and privacy review. Medical record JSON and chat messages contain sensitive information. This development setup is not a production deployment.

### Gemini and voice

The Express API sends chat questions, selected record context, and uploaded document content to Google Gemini for processing. Authenticated document uploads accept JPG, PNG, WebP, and PDF files up to 10 MB. Uploaded records are saved to MongoDB before being shown in the interface. Images are rotated using their EXIF orientation and resized before Gemini processing. Keep the API key only in server environment variables; never add it to browser code or a `VITE_` variable. Check extracted medicine names, doses, dates, and lab values against the scan; handwriting can be unclear and AI can make mistakes.

Run focused document extraction tests with:

```powershell
npm run test:scan
```

Voice chat uses the browser's built-in Web Speech API and requires microphone permission in Chrome or Edge. Open the chat, select English, Hindi, or Telugu, tap the microphone, speak, and tap it again to finish. The chat answer is then read aloud; tap the speaking button to stop playback. If the microphone is blocked, allow it for the local site in browser settings and reload the page.

For an existing local Gemini configuration, the API also reads the project-root `.env.local` as a fallback. Credentials in `server/.env` take priority.

*MedCheck AI — Built for the Altrix Labs AI Healthcare Hackathon.*
