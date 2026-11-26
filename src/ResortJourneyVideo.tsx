import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-scrubbed master film for the LUXORA resort tour.
 * Add the optimized master MP4 at public/videos/luxora-resort-journey.mp4.
 * The procedural Three.js resort remains underneath as a graceful fallback.
 */
export default function ResortJourneyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame = 0;
    const syncToScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        if (Number.isFinite(video.duration) && video.duration > 0 && video.readyState >= 1) {
          const nextTime = progress * Math.max(0, video.duration - 0.08);
          if (Math.abs(video.currentTime - nextTime) > 0.09) {
            try { video.currentTime = nextTime; } catch { /* wait for metadata / seekable range */ }
          }
        }
      });
    };

    video.addEventListener('loadedmetadata', syncToScroll);
    window.addEventListener('scroll', syncToScroll, { passive: true });
    window.addEventListener('resize', syncToScroll);
    syncToScroll();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', syncToScroll);
      window.removeEventListener('scroll', syncToScroll);
      window.removeEventListener('resize', syncToScroll);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={ready ? 'resort-journey-video ready' : 'resort-journey-video'}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
      onError={() => setReady(false)}
    >
      <source src="/videos/luxora-resort-journey.mp4" type="video/mp4" />
    </video>
  );
}
