import React, { useRef, useEffect } from 'react';

/**
 * Cinematic looping video background.
 * Custom rAF-based fade system — no CSS transitions.
 * 500ms fade-in on load/loop, 500ms fade-out 0.55s before end.
 */
export default function VideoBackground({ src }) {
  const videoRef = useRef(null);
  const opacityRef = useRef(0);
  const rafRef = useRef(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setOpacity = (val) => {
      opacityRef.current = val;
      if (video) video.style.opacity = val;
    };

    const cancelRaf = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };

    const animateTo = (target, duration) => {
      cancelRaf();
      const start = performance.now();
      const from = opacityRef.current;
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setOpacity(from + (target - from) * eased);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onPlay = () => { fadingOutRef.current = false; animateTo(1, 500); };

    const onTimeUpdate = () => {
      if (!video.duration || fadingOutRef.current) return;
      if (video.duration - video.currentTime <= 0.55) {
        fadingOutRef.current = true;
        animateTo(0, 500);
      }
    };

    const onEnded = () => {
      setOpacity(0); fadingOutRef.current = false;
      setTimeout(() => { video.currentTime = 0; video.play().catch(() => {}); }, 100);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.play().catch(() => {});

    return () => {
      cancelRaf();
      video.removeEventListener('play', onPlay);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [src]);

  return (
    <div className="video-bg-wrap">
      <video
        ref={videoRef}
        className="video-bg-el"
        src={src}
        autoPlay muted loop={false} playsInline preload="auto"
      />
      <div className="video-bg-scrim" />
    </div>
  );
}
