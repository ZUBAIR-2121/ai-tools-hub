import { useState, useRef, useCallback } from 'react';

const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY || '';
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Indian female voice

export default function useVoice() {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const supported = true;
  const hasApiKey = !!ELEVENLABS_API_KEY;

  const stop = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis?.cancel();
    setSpeaking(false); setLoading(false);
  }, []);

  const speakText = useCallback(async (text) => {
    stop();
    if (!text) return;

    if (hasApiKey) {
      setLoading(true);
      try {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
        audio.onerror = () => { setSpeaking(false); setLoading(false); };
        setLoading(false); setSpeaking(true);
        audio.play();
      } catch { setLoading(false); browserSpeak(text); }
    } else {
      browserSpeak(text);
    }
  }, [hasApiKey, stop]);

  const browserSpeak = (text) => {
    if (!window.speechSynthesis) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.95; utt.pitch = 1;
    utt.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utt);
  };

  const speakTool = useCallback((tool) => {
    const text = `${tool.n}. ${tool.d}. ${tool.about || ''}`;
    speakText(text.slice(0, 500));
  }, [speakText]);

  const speakQuick = useCallback((tool) => {
    speakText(`${tool.n}. ${tool.d}`.slice(0, 200));
  }, [speakText]);

  return { speaking, loading, supported, hasApiKey, speakText, speakTool, speakQuick, stop };
}
