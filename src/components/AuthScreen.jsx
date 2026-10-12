import React, { useState } from 'react';
import { Activity, LogIn, UserPlus } from 'lucide-react';
import { loginAccount, registerAccount } from '../services/api';

export default function AuthScreen({ t, onAuthenticated, initialError = '' }) {
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
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4 py-8">
      <section className="glass-card w-full max-w-lg space-y-6 rounded-2xl p-6 sm:p-8" aria-labelledby="auth-heading">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-800 text-white">
            <Activity aria-hidden="true" className="h-6 w-6" />
          </span>
          <div>
            <h1 id="auth-heading" className="text-2xl font-bold text-slate-950">{t.appTitle}</h1>
            <p className="text-base text-slate-700">{t.tagline}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-950">{isRegister ? t.registerTitle : t.loginTitle}</h2>
          <p className="mt-1 text-base text-slate-700">{t.authSubtitle}</p>
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
                className="min-h-12 w-full rounded-xl border border-slate-400 bg-white px-3 font-normal"
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
              className="min-h-12 w-full rounded-xl border border-slate-400 bg-white px-3 font-normal"
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
              className="min-h-12 w-full rounded-xl border border-slate-400 bg-white px-3 font-normal"
            />
            {isRegister && <span className="block text-sm font-normal text-slate-700">{t.passwordHint}</span>}
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-base text-rose-950">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 text-base font-bold text-white transition-colors hover:bg-teal-900 disabled:opacity-60"
          >
            {isRegister ? <UserPlus aria-hidden="true" className="h-5 w-5" /> : <LogIn aria-hidden="true" className="h-5 w-5" />}
            {isSubmitting ? t.pleaseWait : isRegister ? t.registerButton : t.loginButton}
          </button>
        </form>

        <p className="text-center text-base text-slate-800">
          {isRegister ? t.haveAccount : t.needAccount}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? 'login' : 'register');
              setError('');
            }}
            className="min-h-11 rounded-lg px-2 font-bold text-teal-900 underline underline-offset-2"
          >
            {isRegister ? t.loginButton : t.registerButton}
          </button>
        </p>

        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-base leading-relaxed text-amber-950" role="note">
          {t.safetyNotice} {t.databasePrivacy}
        </p>
      </section>
    </main>
  );
}
