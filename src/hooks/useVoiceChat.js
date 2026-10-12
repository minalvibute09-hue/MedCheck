import { useCallback, useEffect, useRef, useState } from 'react';

function cleanSpeechText(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/https?:\/\/[^\s)]+|www\.[^\s)]+/giu, (url) =>
      url
        .replace(/^https?:\/\/(?:www\.)?/iu, '')
        .replace(/[/?#=&_.-]+/gu, ' ')
    )
    .replace(/([*#_`>~])/gu, ' ')
    .replace(/(^|\n)\s*[-+]\s+/gu, '$1')
    .replace(/\s+/gu, ' ')
    .trim();
}

function splitSpeechIntoChunks(text, maxLength = 180) {
  const speechText = cleanSpeechText(text).replace(/(\d)\.(\d)/gu, '$1\u0000$2');
  const sentences = (speechText.match(/[^.!?।]+[.!?।]?/gu) || [])
    .map((sentence) => sentence.replace(/\u0000/gu, '.'));
  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/u);
    for (const word of words) {
      if (word.length > maxLength) {
        if (current) chunks.push(current);
        current = '';
        for (let start = 0; start < word.length; start += maxLength) {
          chunks.push(word.slice(start, start + maxLength));
        }
        continue;
      }
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > maxLength && current) {
        chunks.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (/[.!?।]$/u.test(sentence.trim()) && current) {
      chunks.push(current);
      current = '';
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function microphoneErrorMessage(code, t) {
  const errorCode = String(code || '').toLowerCase();
  if (['not-allowed', 'service-not-allowed', 'notallowederror'].includes(errorCode)) {
    return t.errorMicDenied;
  }
  if (errorCode === 'no-speech') {
    return t.errorNoSpeech;
  }
  if (['audio-capture', 'notfounderror', 'devicesnotfounderror'].includes(errorCode)) {
    return t.errorNoMic;
  }
  if (errorCode === 'notreadableerror') {
    return t.errorMicBusy;
  }
  if (errorCode === 'network') {
    return t.errorSpeechService;
  }
  if (errorCode === 'securityerror') {
    return t.errorMicBlocked;
  }
  if (errorCode === 'invalidstateerror') {
    return t.errorRecognition;
  }
  if (errorCode === 'aborterror') {
    return t.errorMicInterrupted;
  }
  if (errorCode) {
    return `${t.errorRecognition} (${code})`;
  }
  return t.errorRecognition;
}

export default function useVoiceChat(onQuestion, language, t) {
  const [status, setStatus] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const statusRef = useRef('idle');
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const callbackRef = useRef(onQuestion);
  const speechRunRef = useRef(0);
  const suppressEndRef = useRef(false);
  const translationsRef = useRef(t);
  const mountedRef = useRef(true);

  callbackRef.current = onQuestion;
  translationsRef.current = t;

  const updateStatus = useCallback((nextStatus) => {
    statusRef.current = nextStatus;
    if (mountedRef.current) setStatus(nextStatus);
  }, []);

  const stopSpeaking = useCallback(() => {
    speechRunRef.current += 1;
    window.speechSynthesis.cancel();
    updateStatus('idle');
  }, [updateStatus]);

  const speakAnswer = useCallback((answer, locale) => {
    const speechSynthesis = window.speechSynthesis;
    const chunks = splitSpeechIntoChunks(answer);
    if (!chunks.length) {
      updateStatus('idle');
      return;
    }

    speechRunRef.current += 1;
    const runId = speechRunRef.current;
    speechSynthesis.cancel();
    speechSynthesis.resume();
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.toLowerCase() === locale.toLowerCase()) ||
      voices.find((item) => item.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));

    updateStatus('speaking');
    const speakChunk = (index) => {
      if (runId !== speechRunRef.current) return;
      if (index >= chunks.length) {
        updateStatus('idle');
        return;
      }

      const utterance = new window.SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = locale;
      utterance.rate = 0.9;
      if (voice) utterance.voice = voice;
      utterance.onend = () => speakChunk(index + 1);
      utterance.onerror = (event) => {
        if (runId !== speechRunRef.current) return;
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setError(translationsRef.current.errorSpeechPlayback);
        }
        updateStatus('idle');
      };
      speechSynthesis.speak(utterance);
      speechSynthesis.resume();
    };

    speakChunk(0);
  }, [updateStatus]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      suppressEndRef.current = true;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      speechRunRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError(t.errorVoiceUnsupported);
      return;
    }

    setError('');
    setTranscript('');
    finalTranscriptRef.current = '';
    suppressEndRef.current = false;
    window.speechSynthesis.cancel();

    let recognition;
    try {
      recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        let finalText = '';
        let interimText = '';
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          if (result.isFinal) finalText += result[0].transcript;
          else interimText += result[0].transcript;
        }
        finalTranscriptRef.current = finalText;
        setTranscript(`${finalText} ${interimText}`.trim());
      };

      recognition.onerror = (event) => {
        if (event.error === 'aborted') return;
        suppressEndRef.current = true;
        setError(microphoneErrorMessage(event.error, translationsRef.current));
        updateStatus('idle');
      };

      recognition.onend = async () => {
        recognitionRef.current = null;
        if (suppressEndRef.current) {
          suppressEndRef.current = false;
          return;
        }

        const question = finalTranscriptRef.current.trim();
        if (!question) {
          setError(translationsRef.current.errorNoSpeech);
          updateStatus('idle');
          return;
        }

        updateStatus('thinking');
        try {
          const answer = await callbackRef.current(question, language);
          if (typeof answer === 'string' && answer.trim()) {
            await new Promise((resolve) => window.requestAnimationFrame(resolve));
            speakAnswer(answer, language);
          } else {
            setError(translationsRef.current.errorVoiceSend);
            updateStatus('idle');
          }
        } catch {
          setError(translationsRef.current.errorVoiceSend);
          updateStatus('idle');
        }
      };

      recognitionRef.current = recognition;
      updateStatus('listening');
      recognition.start();
    } catch (startError) {
      recognitionRef.current = null;
      if (startError?.name) {
        console.error('Speech recognition could not start:', startError.name);
      }
      setError(microphoneErrorMessage(startError?.name, translationsRef.current));
      updateStatus('idle');
    }
  }, [language, speakAnswer, t, updateStatus]);

  const toggleVoiceChat = useCallback(() => {
    if (statusRef.current === 'listening') {
      try {
        recognitionRef.current?.stop();
      } catch {
        setError(translationsRef.current.errorMicStop);
        updateStatus('idle');
      }
    } else if (statusRef.current === 'speaking') {
      stopSpeaking();
    } else if (statusRef.current === 'idle') {
      startListening();
    }
  }, [startListening, stopSpeaking, t]);

  return {
    status,
    transcript,
    error,
    toggleVoiceChat
  };
}
