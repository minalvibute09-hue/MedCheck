import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  FileHeart,
  HeartPulse,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { loginAccount, registerAccount } from '../services/api';
import { languageOptions } from '../data/languageOptions';

function HealthIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-label="Illustration of a health analysis dashboard">
      <div className="absolute -inset-5 rounded-[2.5rem] bg-teal-200/40 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-teal-950 via-teal-800 to-cyan-700 p-5 shadow-2xl sm:p-7">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border border-white/10" />
        <div className="relative flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <HeartPulse className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Health overview</p>
              <p className="text-xs text-teal-100">Records, made easier to understand</p>
            </div>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">Preview</span>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
            <div className="flex items-center justify-between text-teal-100">
              <span className="text-xs font-semibold">Your records</span>
              <FileHeart className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-black">Together</p>
            <p className="mt-1 text-xs text-teal-100">prescriptions and reports</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
            <div className="flex items-center justify-between text-teal-100">
              <span className="text-xs font-semibold">At a glance</span>
              <Activity className="h-4 w-4" />
            </div>
            <div className="mt-3 flex h-8 items-end gap-1.5" aria-hidden="true">
              {[12, 19, 15, 25, 20, 30, 26, 34, 28, 38].map((height, index) => (
                <span key={index} style={{ height: `${height}px` }} className="flex-1 rounded-t bg-teal-200/90" />
              ))}
            </div>
            <p className="mt-1 text-xs text-teal-100">simple, clear overview</p>
          </div>
        </div>

        <div className="relative mt-3 rounded-2xl border border-white/15 bg-white/95 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">Your records, thoughtfully explained</p>
              <p className="text-xs text-slate-600">Private by design. Always check with your doctor.</p>
            </div>
            <Sparkles className="h-5 w-5 shrink-0 text-amber-500" />
          </div>
          <svg viewBox="0 0 420 74" className="mt-4 h-16 w-full" role="img" aria-label="Illustrative health trend line">
            <defs>
              <linearGradient id="healthArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity=".24" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 58 C32 58 34 42 64 46 S95 58 124 40 S160 44 190 33 S230 47 258 31 S295 36 322 18 S367 28 420 8 V74 H0Z" fill="url(#healthArea)" />
            <path d="M0 58 C32 58 34 42 64 46 S95 58 124 40 S160 44 190 33 S230 47 258 31 S295 36 322 18 S367 28 420 8" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <span className="absolute -left-3 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-bold text-teal-950 shadow-xl sm:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Family health, together
      </span>
    </div>
  );
}

export default function AuthScreen({ t, currentLang, setCurrentLang, onAuthenticated, initialError = '' }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = mode === 'register'
        ? await registerAccount({ fullName, email, password })
        : await loginAccount({ email, password });
      onAuthenticated(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isRegister = mode === 'register';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-canvas)] px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <section className="space-y-7 py-3 sm:space-y-9" aria-label="Welcome to MedCheck">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-lg shadow-teal-900/20">
              <Activity aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-slate-950">{t.appTitle}<span className="text-teal-700"> AI</span></p>
              <p className="text-sm font-semibold text-slate-600">Family health, made clearer</p>
            </div>
            <label className="sr-only" htmlFor="welcome-language">{t.languageLabel}</label>
            <select
              id="welcome-language"
              value={currentLang}
              onChange={(event) => setCurrentLang(event.target.value)}
              className="ml-auto min-h-11 max-w-36 rounded-xl border border-slate-300 bg-white px-2 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:border-teal-600 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10 sm:max-w-44"
            >
              {languageOptions.map(({ code, native }) => (
                <option key={code} value={code} lang={`${code}-IN`}>{native}</option>
              ))}
            </select>
          </div>

          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1.5 text-sm font-bold text-teal-950 shadow-sm">
              <Sparkles className="h-4 w-4 text-teal-700" /> A calmer way to care
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Your family’s health story, <span className="text-teal-800">all in one place.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-slate-700">
              Understand health records, keep track of important details, and feel more prepared for the next doctor visit.
            </p>
          </div>

          <HealthIllustration />

          <blockquote className="max-w-lg border-l-4 border-teal-600 pl-4 text-base font-semibold leading-relaxed text-slate-800 sm:text-lg">
            “Good care begins with understanding, and grows stronger when families care together.”
          </blockquote>
        </section>

        <section className="glass-card mx-auto w-full max-w-lg space-y-5 rounded-3xl p-5 shadow-xl shadow-slate-900/5 sm:p-8" aria-labelledby="auth-heading">
          <div>
            <h2 id="auth-heading" className="text-2xl font-black text-slate-950">{isRegister ? t.registerTitle : t.loginTitle}</h2>
            <p className="mt-1 text-base text-slate-700">{t.authSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Choose sign in or sign up">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegister}
              onClick={() => { setMode('login'); setError(''); }}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 font-bold transition-all duration-200 ${!isRegister ? 'bg-white text-teal-950 shadow-md' : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'}`}
            >
              <LogIn aria-hidden="true" className="h-4 w-4" /> {t.loginButton}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              onClick={() => { setMode('register'); setError(''); }}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 font-bold transition-all duration-200 ${isRegister ? 'bg-white text-teal-950 shadow-md' : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'}`}
            >
              <UserPlus aria-hidden="true" className="h-4 w-4" /> {t.registerButton}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <label className="block space-y-1.5 text-base font-semibold text-slate-900">
                <span>{t.fullNameLabel}</span>
                <input
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal transition-colors hover:border-teal-500 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
                />
              </label>
            )}

            <label className="block space-y-1.5 text-base font-semibold text-slate-900">
              <span>{t.emailLabel}</span>
              <input
                autoComplete="email"
                type="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal transition-colors hover:border-teal-500 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              />
            </label>

            <label className="block space-y-1.5 text-base font-semibold text-slate-900">
              <span>{t.passwordLabel}</span>
              <input
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                type="password"
                minLength={isRegister ? 8 : 1}
                maxLength={72}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal transition-colors hover:border-teal-500 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              />
              {isRegister && <span className="block text-sm font-normal text-slate-700">{t.passwordHint}</span>}
            </label>

            {error && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-base text-rose-950">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 text-base font-bold text-white shadow-md shadow-teal-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-900 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
            >
              {isRegister ? <UserPlus aria-hidden="true" className="h-5 w-5" /> : <LogIn aria-hidden="true" className="h-5 w-5" />}
              {isSubmitting ? t.pleaseWait : isRegister ? t.registerButton : t.loginButton}
              {!isSubmitting && <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950" role="note">
            <ShieldCheck aria-hidden="true" className="mr-1 inline h-4 w-4 align-[-3px]" />
            {t.safetyNotice} {t.databasePrivacy}
          </p>
        </section>
      </div>
    </main>
  );
}
