"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { InvitationTheme } from "@/lib/mock-data";

interface MusicPlayerProps {
  musicUrl?: string;
  theme?: InvitationTheme;
  shouldPlay?: boolean; // controlled by EntryWrapper (true after animation opens)
}

/**
 * Extract Spotify track ID from various URL formats:
 *   https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6
 *   https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6?si=xxx
 *   spotify:track:6rqhFgbbKwnb9MLmUQDhG6
 *   https://open.spotify.com/intl-es/track/6rqhFgbbKwnb9MLmUQDhG6?si=xxx
 */
function extractSpotifyTrackId(url: string): string | null {
  if (!url) return null;

  // Handle spotify: URI scheme
  const uriMatch = url.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  // Handle open.spotify.com URLs (with or without /intl-xx/)
  const urlMatch = url.match(/open\.spotify\.com(?:\/intl-[a-z]{2})?\/track\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];

  return null;
}

export default function MusicPlayer({ musicUrl, theme, shouldPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controllerRef = useRef<any>(null);
  const hasStartedRef = useRef(false);

  const trackId = musicUrl ? extractSpotifyTrackId(musicUrl) : null;

  // Initialize Spotify IFrame API
  useEffect(() => {
    if (!trackId) return;

    // Load the Spotify IFrame API script
    const existingScript = document.querySelector('script[src*="spotify.com/embed/iframe-api"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }

    // Wait for the API to be ready
    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const container = document.getElementById("spotify-embed-container");
      if (!container) return;

      const options = {
        uri: `spotify:track:${trackId}`,
        width: 0,
        height: 0,
      };

      const callback = (controller: any) => {
        controllerRef.current = controller;
        setIsReady(true);

        controller.addListener("playback_update", (e: any) => {
          setIsPlaying(!e.data.isPaused);
        });
      };

      IFrameAPI.createController(container, options, callback);
    };

    // If the API is already loaded, call it manually
    if ((window as any).SpotifyIframeApi) {
      (window as any).onSpotifyIframeApiReady((window as any).SpotifyIframeApi);
    }

    return () => {
      controllerRef.current = null;
    };
  }, [trackId]);

  // Auto-play when entry animation opens (shouldPlay becomes true)
  useEffect(() => {
    if (shouldPlay && isReady && !hasStartedRef.current && !userMuted && controllerRef.current) {
      hasStartedRef.current = true;
      controllerRef.current.play();
      // Pequeño delay para asegurar que el reproductor registró el play antes de regresarlo a 0
      setTimeout(() => {
        if (controllerRef.current) {
          controllerRef.current.seek(0);
        }
      }, 300);
    }
  }, [shouldPlay, isReady, userMuted]);

  const togglePlayback = useCallback(() => {
    if (!controllerRef.current) return;

    if (isPlaying) {
      controllerRef.current.pause();
      setUserMuted(true);
    } else {
      controllerRef.current.play();
      setUserMuted(false);
    }
  }, [isPlaying]);

  // Don't render anything if there's no valid Spotify URL
  if (!trackId) return null;

  const accent = theme?.accent || "#B08D3F";
  const accentLight = theme?.accentLight || "#D9C48B";

  return (
    <>
      {/* Hidden Spotify embed container */}
      <div
        id="spotify-embed-container"
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

      {/* Floating toggle button */}
      <button
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        className="fixed z-[9999] bottom-5 right-5 group"
        style={{
          width: 48,
          height: 48,
        }}
      >
        {/* Outer glow ring - animates when playing */}
        <span
          className={`absolute inset-0 rounded-full transition-all duration-700 ${isPlaying ? "animate-pulse" : ""}`}
          style={{
            background: `radial-gradient(circle, ${accent}40 0%, transparent 70%)`,
            transform: isPlaying ? "scale(1.5)" : "scale(1)",
            opacity: isPlaying ? 1 : 0,
          }}
        />

        {/* Button background */}
        <span
          className="absolute inset-0 rounded-full border backdrop-blur-lg transition-all duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${accent}CC, ${accentLight}AA)`,
            borderColor: `${accentLight}60`,
            boxShadow: `0 4px 20px ${accent}50`,
          }}
        />

        {/* Icon */}
        <span className="relative flex items-center justify-center w-full h-full">
          {isPlaying ? (
            /* Animated sound bars */
            <span className="flex items-end gap-[3px] h-4">
              <span className="w-[3px] bg-white rounded-full animate-soundbar1" style={{ animationDuration: "0.5s" }} />
              <span className="w-[3px] bg-white rounded-full animate-soundbar2" style={{ animationDuration: "0.7s" }} />
              <span className="w-[3px] bg-white rounded-full animate-soundbar3" style={{ animationDuration: "0.4s" }} />
              <span className="w-[3px] bg-white rounded-full animate-soundbar4" style={{ animationDuration: "0.6s" }} />
            </span>
          ) : (
            /* Muted / paused icon */
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

      {/* CSS animations for sound bars */}
      <style>{`
        @keyframes soundbar1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes soundbar2 {
          0%, 100% { height: 8px; }
          50% { height: 12px; }
        }
        @keyframes soundbar3 {
          0%, 100% { height: 12px; }
          50% { height: 6px; }
        }
        @keyframes soundbar4 {
          0%, 100% { height: 6px; }
          50% { height: 14px; }
        }
        .animate-soundbar1 { animation: soundbar1 0.5s ease-in-out infinite; }
        .animate-soundbar2 { animation: soundbar2 0.7s ease-in-out infinite; }
        .animate-soundbar3 { animation: soundbar3 0.4s ease-in-out infinite; }
        .animate-soundbar4 { animation: soundbar4 0.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}
