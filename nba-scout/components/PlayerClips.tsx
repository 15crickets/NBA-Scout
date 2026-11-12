"use client";
import { useState } from "react";
import Image from "next/image";
import type { ClipResult } from "./types";

interface PlayerClipsProps {
  clips: ClipResult[] | null;
  isLoading?: boolean;
}

export default function PlayerClips({ clips, isLoading }: PlayerClipsProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2 animate-pulse">
            <div className="h-16 w-28 shrink-0 rounded bg-zinc-800" />
            <div className="flex flex-col justify-center gap-2 flex-1">
              <div className="h-3 w-3/4 rounded bg-zinc-800" />
              <div className="h-3 w-1/2 rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!clips) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-4 text-center text-sm text-zinc-500">
        Popular clips will appear here
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {clips.map((clip) => (
          <button
            key={clip.videoId}
            onClick={() => setPlayingId(clip.videoId)}
            className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-left hover:border-zinc-600 hover:bg-zinc-800 transition-colors group"
          >
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded">
              <Image
                src={clip.thumbnail}
                alt={clip.title}
                fill
                sizes="112px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xl">▶</span>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-snug line-clamp-3 self-center">
              {clip.title}
            </p>
          </button>
        ))}
      </div>

      {playingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setPlayingId(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPlayingId(null)}
              className="absolute -top-9 right-0 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ✕ Close
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-700">
              <iframe
                src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
                title="YouTube player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
