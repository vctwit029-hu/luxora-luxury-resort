import { useEffect, useRef, useState } from 'react';

/**
 * LUXORA opening film: one scroll gesture starts the complete resort journey.
 * The page remains on the opening scene while the film plays, then normal
 * page scrolling is released for the resort chapters below.
 */
export default function ResortJourneyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let touchY = 0;

    const unlock = () => {
      document.documentElement.classList.remove('luxora-film-playing');
      document.body.classList.remove('luxora-film-playing');
      setPlaying(false);
      setComplete(true);
    };

    const startFilm = () => {
      if (started.current || complete || !ready) return;
      started.current = true;
      setPlaying(true);
      document.documentElement.classList.add('luxora-film-playing');
      document.body.classList.add('luxora-film-playing');
      video.currentTime = 0;
      const result = video.play();
      if (result) result.catch(() => {
        started.current = false;
        document.documentElement.classList.remove('luxora-film-playing');
        document.body.classList.remove('luxora-film-playing');
        setPlaying(false);
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (complete) return;
      event.preventDefault();
      if (event.deltaY > 0) startFilm();
    };
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (complete) return;
      event.preventDefault();
      const y = event.touches[0]?.clientY ?? touchY;
      if (touchY - y > 8) startFilm();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (complete) return;
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(event.key)) {
        event.preventDefault();
        startFilm();
      }
    };

    video.addEventListener('ended', unlock);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      video.removeEventListener('ended', unlock);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.classList.remove('luxora-film-playing');
      document.body.classList.remove('luxora-film-playing');
    };
  }, [ready, complete]);

  return (
    <div className={`resort-film-stage ${ready ? 'ready' : ''} ${playing ? 'playing' : ''} ${complete ? 'complete' : ''}`}>
      <video
        ref={videoRef}
        className="resort-journey-video"
        muted
        playsInline
        preload="auto"
        aria-label="LUXORA cinematic resort journey"
        onLoadedData={() => setReady(true)}
      >
        <source src="/videos/luxora-resort-journey.mp4" type="video/mp4" />
      </video>
      {/* The opening screen is intentionally video-only: no text or controls. */}
    </div>
  );
}
