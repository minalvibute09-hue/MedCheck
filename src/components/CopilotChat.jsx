import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowUpRight,
  Mic,
  MicOff,
  VolumeX
} from 'lucide-react';
import { answerHealthQuery } from '../services/copilotChat';
import useVoiceChat from '../hooks/useVoiceChat';

const voiceLanguages = [
  { locale: 'en-IN', appLanguage: 'en', label: 'English' },
  { locale: 'hi-IN', appLanguage: 'hi', label: 'हिन्दी' },
  { locale: 'te-IN', appLanguage: 'te', label: 'తెలుగు' }
];

export default function CopilotChat({ 
  activeRecord, 
  t,
  currentLang,
  isOpen: isOpenProp,
  onOpenChange
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = isOpenProp ?? localOpen;
  const setIsOpen = onOpenChange || setLocalOpen;
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState(
    voiceLanguages.find(({ appLanguage }) => appLanguage === currentLang)?.locale || 'en-IN'
  );
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: t.emptyChat,
      followUps: [
        t.samplePromptOne,
        t.samplePromptTwo,
        t.samplePromptThree
      ]
    }
  ]);
  const messagesEndRef = useRef(null);
  const voiceChat = useVoiceChat(
    (question, language) => handleSend(question, language),
    voiceLanguage,
    t
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    setVoiceLanguage(
      voiceLanguages.find(({ appLanguage }) => appLanguage === currentLang)?.locale || 'en-IN'
    );
  }, [currentLang]);

  useEffect(() => {
    setMessages((previous) => previous.map((message, index) => index === 0
      ? {
        ...message,
        text: t.chatWelcome,
        followUps: [t.samplePromptOne, t.samplePromptTwo, t.samplePromptThree]
      }
      : message
    ));
  }, [t]);

  async function handleSend(textToSend = null, language = currentLang) {
    const query = (textToSend ?? input).trim();
    if (!query || isSending) return;

    const userMsg = { sender: 'user', text: query };
    const history = messages.slice(1);
    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === null) setInput('');
    setIsSending(true);

    try {
      const response = await answerHealthQuery(query, activeRecord, history, language);
      setMessages((prev) => [...prev, { sender: 'bot', text: response }]);
      return response;
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: t.chatFailed }
      ]);
      console.error('Health Copilot request failed:', error);
      return null;
    } finally {
      setIsSending(false);
    }
  }

  const voiceStatusLabel = {
    idle: t.tapAndSpeak,
    listening: t.listening,
    thinking: t.thinking,
    speaking: t.speaking
  }[voiceChat.status];
  const voiceStatusHint = {
    idle: t.tapAndSpeak,
    listening: t.tapToFinish,
    thinking: t.thinking,
    speaking: t.tapToStop
  }[voiceChat.status];

  return (
    <>
      {/* Floating Copilot Toggle Pill (Clean shadcn style) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-slate-800 sm:bottom-6 sm:right-6"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-blue-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <span>{t.askCopilotTitle}</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 left-2 right-2 z-50 flex h-[min(75vh,620px)] flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:h-[min(85vh,620px)] sm:w-[420px]">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-base font-bold">{t.assistantName}</h4>
                <div className="flex items-center gap-1.5 text-sm text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[200px] truncate">{activeRecord?.title || t.navRecords}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label={t.closeChat}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 text-base">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-soft-xs'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-soft-xs'
                }`}>
                  <p className="whitespace-pre-line text-base leading-relaxed">{m.text}</p>

                  {/* Follow-up suggestions */}
                  {m.followUps && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <span className="block text-sm font-bold text-slate-700">
                        {t.sampleRecordsHeading}:
                      </span>
                      {m.followUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSend(fu)}
                          className="flex min-h-12 w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white p-3 text-left text-base font-medium text-slate-800 transition-colors hover:bg-teal-50"
                        >
                          <span className="line-clamp-1">{fu}</span>
                          <ArrowUpRight className="w-3 h-3 text-blue-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2"
            >
              <input
                type="text"
                placeholder={t.askCopilot}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-12 min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 transition focus:border-teal-800"
              />
              <select
                aria-label={t.languageLabel}
                value={voiceLanguage}
                onChange={(event) => setVoiceLanguage(event.target.value)}
                disabled={voiceChat.status !== 'idle'}
                className="min-h-12 max-w-[5.5rem] rounded-xl border border-slate-300 bg-white px-2 text-sm text-slate-900"
              >
                {voiceLanguages.map(({ locale, label }) => (
                  <option key={locale} value={locale}>{label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={voiceChat.toggleVoiceChat}
                disabled={voiceChat.status === 'thinking' || isSending}
                aria-label={voiceStatusHint}
                title={voiceStatusHint}
                className={`inline-flex min-h-12 items-center gap-1.5 rounded-xl border px-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                  voiceChat.status === 'listening'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : voiceChat.status === 'speaking'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                {voiceChat.status === 'speaking'
                  ? <VolumeX className="w-4 h-4" />
                  : voiceChat.status === 'listening'
                    ? <MicOff className="w-4 h-4" />
                    : <Mic className="w-4 h-4 text-[#0EA5E9]" />}
                <span>{voiceStatusLabel}</span>
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                aria-label={t.sendMessage}
                className="flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-teal-800 text-white transition-colors hover:bg-teal-900 disabled:opacity-40"
              >
                {isSending ? (
                  <span className="block w-4 h-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            {voiceChat.transcript && (
              <p className="mt-2 text-base text-slate-800" aria-live="polite">
                <span className="font-semibold">{t.transcriptLabel}:</span> {voiceChat.transcript}
              </p>
            )}
            {voiceChat.error && (
              <p className="mt-2 text-base text-rose-800" role="alert">{voiceChat.error}</p>
            )}
            <p className="mt-2 text-center text-sm font-normal text-slate-700">
              {t.chatPrivacy}
            </p>
          </div>

        </div>
      )}
    </>
  );
}
