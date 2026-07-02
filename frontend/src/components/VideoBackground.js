import React, { useRef, useEffect } from 'react';

/**
 * Cinematic looping video background with custom fade system.
 * - 500ms fade-in on load/loop start
 * - 500ms fade-out 0.55s before video ends
 * - requestAnimationFrame based (no CSS transitions)
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

    const animateFade = (target, duration) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const startOpacity = opacityRef.current;

      const step = (now) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = t * (2 - t); // ease-out
        const value = startOpacity + (target - startOpacity) * eased;
        setOpacity(value);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const fadeIn = () => {
      fadingOutRef.current = false;
      animateFade(1, 500);
    };

    const fadeOut = () => {
      if (fadingOutRef.current) return;
      fadingOutRef.current = true;
      animateFade(0, 500);
    };

    const handlePlay = () => fadeIn();

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadeOut();
      }
    };

    const handleEnded = () => {
      setOpacity(0);
      fadingOutRef.current = false;
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch(() => {});

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  return (
    <div className="video-bg-container">
      <video
        ref={videoRef}
        className="video-bg"
        src={src}
        autoPlay
        muted
        loop={false}
        playsInline
        preload="auto"
      />
      <div className="video-overlay" />
    </div>
  );
}
