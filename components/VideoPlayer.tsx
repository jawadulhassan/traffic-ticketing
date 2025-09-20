"use client";

import { useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export default function VideoPlayer({
  videoUrl,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />

        {/* Overlay controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* Controls bar */}
      <div className="bg-gray-900 text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayPause}
            className="hover:text-gray-300 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={resetVideo}
            className="hover:text-gray-300 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1 mx-3">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-primary-500 h-1 rounded-full transition-all duration-200"
                style={{
                  width: `${
                    duration > 0 ? (currentTime / duration) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
