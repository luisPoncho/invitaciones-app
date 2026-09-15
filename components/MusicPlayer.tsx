"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { InvitationTheme } from "@/lib/mock-data";

interface MusicPlayerProps {
  musicUrl?: string;
  theme?: InvitationTheme;
  shouldPlay?: boolean;
}

function extractSpotifyTrackId(url: string): string | null {
  if (!url) return null;
  const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];
  const urlMatch = url.match(/open\.spotify\.com(?:\/intl-[a-z]{2})?\/track\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  return null;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export default function MusicPlayer({ musicUrl, theme, shouldPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const spotifyControllerRef = useRef<any>(null);
  const youtubePlayerRef = useRef<any>(null);
  const hasStartedRef = useRef(false);

  const spotifyId = musicUrl ? extractSpotifyTrackId(musicUrl) : null;
  const youtubeId = musicUrl ? extractYouTubeId(musicUrl) : null;
  const provider = spotifyId ? "spotify" : youtubeId ? "youtube" : null;

  // ─── SPOTIFY INIT ──────────────────────────────────────────────
  useEffect(() => {
    if (provider !== "spotify" || !spotifyId) return;

    const existingScript = document.querySelector('script[src*="spotify.com/embed/iframe-api"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }

    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const container = document.getElementById("spotify-embed-container");
      if (!container) return;

      const options = {
        uri: `spotify:track:${spotifyId}`,
        width: 0,
        height: 0,
      };

      const callback = (controller: any) => {
        spotifyControllerRef.current = controller;
        setIsReady(true);
        controller.addListener("playback_update", (e: any) => {
          setIsPlaying(!e.data.isPaused);
        });
      };

      IFrameAPI.createController(container, options, callback);
    };

    if ((window as any).SpotifyIframeApi) {
      (window as any).onSpotifyIframeApiReady((window as any).SpotifyIframeApi);
    }

    return () => {
      spotifyControllerRef.current = null;
    };
  }, [provider, spotifyId]);

  // ─── YOUTUBE INIT ──────────────────────────────────────────────
  useEffect(() => {
    if (provider !== "youtube" || !youtubeId) return;

    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }

    const initYT = () => {
      if (!(window as any).YT) return;
      youtubePlayerRef.current = new (window as any).YT.Player("youtube-embed-container", {
        videoId: youtubeId,
        width: 0,
        height: 0,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event: any) => {
            const YT = (window as any).YT;
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              event.data === YT.PlayerState.PAUSED ||
              event.data === YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initYT();
    } else {
      (window as any).onYouTubeIframeAPIReady = initYT;
    }

    return () => {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === "function") {
        youtubePlayerRef.current.destroy();
      }
      youtubePlayerRef.current = null;
    };
  }, [provider, youtubeId]);

  // ─── AUTOPLAY ON OPEN ──────────────────────────────────────────
  useEffect(() => {
    if (shouldPlay && isReady && !hasStartedRef.current && !userMuted) {
      hasStartedRef.current = true;
      if (provider === "spotify" && spotifyControllerRef.current) {
        spotifyControllerRef.current.play();
        setTimeout(() => {
          if (spotifyControllerRef.current) spotifyControllerRef.current.seek(0);
        }, 300);
      } else if (provider === "youtube" && youtubePlayerRef.current) {
        youtubePlayerRef.current.seekTo(0);
        youtubePlayerRef.current.playVideo();
      }
    }
  }, [shouldPlay, isReady, userMuted, provider]);

  // ─── TOGGLE PLAYBACK ───────────────────────────────────────────
  const togglePlayback = useCallback(() => {
    if (provider === "spotify" && spotifyControllerRef.current) {
      if (isPlaying) {
        spotifyControllerRef.current.pause();
        setUserMuted(true);
      } else {
        spotifyControllerRef.current.play();
        setUserMuted(false);
      }
    } else if (provider === "youtube" && youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
        setUserMuted(true);
      } else {
        youtubePlayerRef.current.playVideo();
        setUserMuted(false);
      }
    }
  }, [isPlaying, provider]);

  if (!provider) return null;

  const accent = theme?.accent || "#B08D3F";
  const accentLight = theme?.accentLight || "#D9C48B";

  return (
    <>
      <div
        id={provider === "spotify" ? "spotify-embed-container" : "youtube-embed-container"}
        style={{
          position: "fixed",
          width: 0,
          height: 0,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <button
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className="fixed z-[9999] bottom-5 right-5 group"
        style={{ width: 48, height: 48 }}
      >
        <span
          className={`absolute inset-0 rounded-full transition-all duration-700 ${isPlaying ? "animate-pulse" : ""}`}
          style={{
            background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`,
            transform: isPlaying ? "scale(1.5)" : "scale(1)",
            opacity: isPlaying ? 1 : 0,
          }}
        />
        <span
          className="absolute inset-0 rounded-full border backdrop-blur-lg transition-all duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${accent}CC, ${accentLight}AA)`,
            borderColor: `${accentLight}60`,
            boxShadow: `0 4px 20px ${accent}50`,
          }}
        />
        <span className="relative flex items-center justify-center w-full h-full">
          {isPlaying ? (
            <span className="flex items-end gap-[3px] h-4">
              <span className="w-[3px] bg-white rounded-full animate-soundbar1" style={{ animationDuration: "0.5s" }} />
              <span className="w-[3px] bg-white rounded-full animate-soundbar2" style={{ animationDuration: "0.7s" }} />
              <span className="w-[3px] bg-white rounded-full animate-soundbar3" style={{ animationDuration: "0.4s" }} />
              <span className="w-[3px] bg-white rounded-full animate-soundbar4" style={{ animationDuration: "0.6s" }} />
            </span>
          ) : (
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </span>
      </button>

      <style>{`
        @keyframes soundbar1 { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes soundbar2 { 0%, 100% { height: 8px; } 50% { height: 12px; } }
        @keyframes soundbar3 { 0%, 100% { height: 12px; } 50% { height: 6px; } }
        @keyframes soundbar4 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
        .animate-soundbar1 { animation: soundbar1 0.5s ease-in-out infinite; }
        .animate-soundbar2 { animation: soundbar2 0.7s ease-in-out infinite; }
        .animate-soundbar3 { animation: soundbar3 0.4s ease-in-out infinite; }
        .animate-soundbar4 { animation: soundbar4 0.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}
