"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseSpeechRecognitionOptions = {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
};
export type { UseSpeechRecognitionOptions as UseSignLanguageOptions };

export type UseSpeechRecognitionReturn = {
  supported: boolean;
  listening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
};

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
}

export interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  _shouldRestart?: boolean;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    lang = "en-US",
    continuous = true,
    interimResults = true,
    onResult,
  } = options;

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimerRef = useRef<number | null>(null);
  const lastErrorRef = useRef<string | null>(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
      mozSpeechRecognition?: new () => SpeechRecognition;
      msSpeechRecognition?: new () => SpeechRecognition;
    };
    
    // Try multiple browsers and fallbacks
    const SR =
      typeof window !== "undefined" &&
      (
        speechWindow.SpeechRecognition || 
        speechWindow.webkitSpeechRecognition || 
        speechWindow.mozSpeechRecognition || 
        speechWindow.msSpeechRecognition
      );

    setSupported(Boolean(SR));
    if (!SR) {
      console.warn('[Speech Recognition] No native support found. Browser compatibility:', {
        userAgent: navigator.userAgent,
        isChrome: /Chrome/.test(navigator.userAgent),
        isFirefox: /Firefox/.test(navigator.userAgent),
        isSafari: /Safari/.test(navigator.userAgent),
        isEdge: /Edge/.test(navigator.userAgent)
      });
      return;
    }

    const recognition: SpeechRecognition = new SR();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    
    // Add additional browser-specific configurations
    if ('maxAlternatives' in recognition) {
      (recognition as any).maxAlternatives = 1;
    }
    if ('serviceURI' in recognition) {
      // For browsers that support custom service URI
      (recognition as any).serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
    }

    recognition.onstart = () => {
      setListening(true);
      lastErrorRef.current = null;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript;
        if (res.isFinal) final += text;
        else interim += text;
      }

      setInterimTranscript(interim);
      if (final)
        setFinalTranscript((prev) => (prev ? `${prev} ${final}` : final));

      const latest = final || interim;
      if (latest && onResult) onResult(latest, Boolean(final));
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      const err: string = e?.error || "unknown";
      lastErrorRef.current = err;

      const benign = err === "aborted" || err === "no-speech";
      if (!benign) {
        setError(err);
      } else {
        setError(null);
      }

      setListening(false);

      const fatal =
        err === "not-allowed" ||
        err === "service-not-allowed" ||
        err === "audio-capture";
      if (fatal) return;

      if (!benign && continuous && recognitionRef.current?._shouldRestart) {
        if (restartTimerRef.current)
          window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = window.setTimeout(() => {
          try {
            recognition.start();
            setListening(true);
          } catch {}
        }, 500);
      }
    };

    recognition.onend = () => {
      setListening(false);
      const hadError = lastErrorRef.current !== null;
      if (!hadError && continuous && recognitionRef.current?._shouldRestart) {
        if (restartTimerRef.current)
          window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = window.setTimeout(() => {
          try {
            recognition.start();
            setListening(true);
          } catch {}
        }, 250);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, [lang, continuous, interimResults, onResult]);

  const start = useCallback(async () => {
    setError(null);
    setInterimTranscript("");
    
    // Check for HTTPS requirement
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Speech recognition requires HTTPS or localhost');
      throw new Error('HTTPS required for speech recognition');
    }
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (micError) {
      console.error('[Speech Recognition] Microphone access denied:', micError);
      setError("not-allowed");
      throw new Error("Mic permission not granted");
    }

    const recognition = recognitionRef.current;
    if (!recognition) {
      setError('Speech recognition not initialized');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current._shouldRestart = true;
      }
      
      // Add timeout for start attempt
      const startPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Speech recognition start timeout'));
        }, 10000); // 10 second timeout
        
        recognition.onstart = () => {
          clearTimeout(timeout);
          setListening(true);
          lastErrorRef.current = null;
          resolve();
        };
        
        recognition.start();
      });
      
      await startPromise;
      
    } catch (err: unknown) {
      console.error('[Speech Recognition] Start error:', err);
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message: string }).message === "string" &&
        (err as { message: string }).message.toLowerCase().includes("start")
      ) {
        return;
      }
      setError("network");
      throw err;
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (recognitionRef.current) {
      recognitionRef.current._shouldRestart = false;
    }
    try {
      recognition.stop();
    } catch {}
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
    setError(null);
    lastErrorRef.current = null;
  }, []);

  return {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    error,
    start,
    stop,
    reset,
  };
}
