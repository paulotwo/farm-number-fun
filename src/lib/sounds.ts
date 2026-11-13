// Sound utilities using Web Audio API and Web Speech API
// No backend needed — everything runs in the browser
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { isNative } from "@/lib/platform";

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/** Play a melodic "correct" chime — ascending happy notes */
export function playCorrectSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.4);
  });
}

/** Play a gentle "wrong" buzzer — descending tone */
export function playWrongSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(350, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.35);
}

/** Play a soft pop sound when animals appear */
export function playPopSound(delayMs = 0) {
  setTimeout(() => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }, delayMs);
}

/** Play a celebration fanfare */
export function playCelebrateSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
  });
}

/** Play a click/tap sound for button interactions */
export function playClickSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}

// O WebView do Android não implementa `speechSynthesis`: no app a fala usa o
// TTS do sistema pelo plugin. Cada fala nova descarta a anterior; `onEnd` só
// roda para a fala atual, quando ela termina ou quando não há como falar (sem
// voz para o idioma), para o jogo nunca ficar esperando uma fala que não vem.
let nativeSpeechId = 0;
const NATIVE_RETRY_MS = 400;

function speakNative(text: string, lang: string, onEnd?: () => void) {
  const id = ++nativeSpeechId;
  const finish = () => {
    if (id === nativeSpeechId) onEnd?.();
  };
  // Logo depois de abrir o app o motor de TTS pode ainda não estar conectado
  // e a fala é recusada: tenta de novo enquanto esta fala ainda for a atual.
  const attempt = (retriesLeft: number) => {
    TextToSpeech.speak({ text, lang, rate: 0.85, pitch: 1.3 }).then(finish, () => {
      if (id !== nativeSpeechId) return;
      if (retriesLeft <= 0) finish();
      else setTimeout(() => id === nativeSpeechId && attempt(retriesLeft - 1), NATIVE_RETRY_MS);
    });
  };
  attempt(2);
}

/** Interrompe a fala em andamento (voltar ao início, app em segundo plano). */
export function stopSpeech() {
  try {
    if (isNative) {
      nativeSpeechId++;
      TextToSpeech.stop().catch(() => {});
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Fala indisponível: nada a interromper
  }
}

/** Speak text using Web Speech API (system TTS in the native app) */
export function speak(text: string, langOrCallback?: string | (() => void), onEnd?: () => void) {
  if (isNative) {
    speakNative(
      text,
      typeof langOrCallback === "string" ? langOrCallback : "pt-BR",
      typeof langOrCallback === "function" ? langOrCallback : onEnd,
    );
    return;
  }
  if (!("speechSynthesis" in window)) {
    if (typeof langOrCallback === "function") langOrCallback();
    else onEnd?.();
    return;
  }

  const lang = typeof langOrCallback === "string" ? langOrCallback : "pt-BR";
  const callback = typeof langOrCallback === "function" ? langOrCallback : onEnd;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  utterance.pitch = 1.3; // Slightly higher pitch for a friendly children's voice

  // Try to find a voice matching the requested language
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang.split("-")[0];
  const matchedVoice = voices.find(
    (v) => v.lang.startsWith(langPrefix) && v.name.toLowerCase().includes("female")
  ) || voices.find((v) => v.lang.startsWith(langPrefix));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (callback) {
    utterance.onend = () => callback();
  }

  window.speechSynthesis.speak(utterance);
}

/** Ensure voices are loaded (they load async in some browsers) */
export function preloadVoices() {
  // No app basta acordar o motor de TTS cedo, para já estar conectado na primeira fala.
  if (isNative) {
    TextToSpeech.getSupportedLanguages().catch(() => {});
    return;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}
