import { useState, useRef, useCallback } from 'react';

// ─── ElevenLabs Indian Female Voice ─────────────────────────────────────────
// Voice: "Aria" - Indian English, soft and clear
// Free tier: 10,000 characters/month — plenty for reading tool details
// Get your free API key at: https://elevenlabs.io  (Sign up → Profile → API Key)
const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY || '';

// Best Indian English female voices on ElevenLabs (free tier):
// - "21m00Tcm4TlvDq8ikWAM"  → Rachel   (soft, clear American — fallback)
// - "pFZP5JQG7iQjIQuC4Bku"  → Lily     (soft British — fallback)
// - "EXAVITQu4vr4xnSDxMaL"  → Sarah    (warm, natural)
// - "XB0fDUnXU5powFXDhCwa"  → Charlotte (clear, warm)
// We use "Aria" style via the multilingual v2 model which sounds most natural
// for Indian English content.
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah — warm, soft, clear

// ─── Fallback: Browser TTS with best Indian-sounding voice ──────────────────
function speakBrowser(text, setSpeaking) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // Priority order: look for Indian English, then any female voice, then Google
  const voice =
    voices.find(v => v.lang === 'en-IN') ||
    voices.find(v => v.lang === 'en-IN' && v.name.toLowerCase().includes('female')) ||
    voices.find(v => v.name.toLowerCase().includes('heera')) ||   // Windows Indian
    voices.find(v => v.name.toLowerCase().includes('raveena')) || // macOS Indian
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.name.includes('Google') && v.name.includes('Female')) ||
    voices.find(v => v.name.toLowerCase().includes('female')) ||
    voices.find(v => v.lang.startsWith('en'));

  if (voice) utter.voice = voice;
  utter.rate  = 0.88;   // slightly slower = clearer
  utter.pitch = 1.1;    // slightly higher = more feminine
  utter.volume = 1;
  utter.onstart = () => setSpeaking(true);
  utter.onend   = () => setSpeaking(false);
  utter.onerror = () => setSpeaking(false);
  window.speechSynthesis.speak(utter);
}

// ─── Main Hook ───────────────────────────────────────────────────────────────
export default function useVoice() {
  const [speaking, setSpeaking]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const audioRef  = useRef(null);

  // Stop any current playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setLoading(false);
  }, []);

  // Core speak function — tries ElevenLabs first, falls back to browser TTS
  const speak = useCallback(async (text) => {
    stop();

    // ── ElevenLabs path ────────────────────────────────────────────────────
    if (ELEVENLABS_API_KEY) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.55,          // natural variation
                similarity_boost: 0.80,   // stays close to voice character
                style: 0.25,              // slight expressiveness
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!res.ok) throw new Error(`ElevenLabs error ${res.status}`);

        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        setLoading(false);
        setSpeaking(true);

        audio.onended = () => {
          setSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setSpeaking(false);
          setLoading(false);
        };
        audio.play();
        return;
      } catch (err) {
        console.warn('ElevenLabs failed, using browser TTS:', err.message);
        setLoading(false);
      }
    }

    // ── Browser TTS fallback ───────────────────────────────────────────────
    speakBrowser(text, setSpeaking);
  }, [stop]);

  // ── Build text scripts ───────────────────────────────────────────────────

  // Full details read (for modal)
  const speakTool = useCallback((tool) => {
    const parts = [
      `${tool.n}.`,
      tool.d,
      tool.about ? `About this tool. ${tool.about}` : '',
      tool.steps?.length
        ? `Here is how to get started. ${tool.steps.map((s, i) => `Step ${i + 1}. ${s}`).join('. ')}`
        : '',
      tool.tips?.length
        ? `Pro tips. ${tool.tips.join('. ')}`
        : '',
    ].filter(Boolean).join('  ');
    speak(parts);
  }, [speak]);

  // Quick summary read (for card)
  const speakQuick = useCallback((tool) => {
    const parts = [
      `${tool.n}.`,
      tool.d,
      tool.steps?.length
        ? `Quick start. ${tool.steps.slice(0, 2).join('. ')}`
        : '',
    ].filter(Boolean).join('  ');
    speak(parts);
  }, [speak]);

  return {
    speaking,
    loading,
    supported: true,   // always supported (either ElevenLabs or browser)
    speakTool,
    speakQuick,
    stop,
    speak,
    hasApiKey: !!ELEVENLABS_API_KEY,
  };
}
