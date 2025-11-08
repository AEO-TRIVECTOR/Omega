'use client';

import React, { useState, useEffect } from 'react';
import { getSoundEngine } from '../lib/audio/sound-engine';

interface AudioControlsProps {
  className?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ className = '' }) => {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [omegaPulse, setOmegaPulse] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const soundEngine = getSoundEngine();

  const handleToggle = async () => {
    if (!initialized) {
      await soundEngine.init();
      setInitialized(true);
    }

    const newEnabled = !enabled;
    setEnabled(newEnabled);
    soundEngine.setEnabled(newEnabled);

    if (newEnabled) {
      soundEngine.playClick();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    soundEngine.setVolume(newVolume);
  };

  const handleOmegaToggle = async () => {
    if (!initialized) {
      await soundEngine.init();
      setInitialized(true);
      setEnabled(true);
      soundEngine.setEnabled(true);
    }

    const newOmegaPulse = !omegaPulse;
    setOmegaPulse(newOmegaPulse);

    if (newOmegaPulse) {
      soundEngine.startOmegaPulse();
    } else {
      soundEngine.stopOmegaPulse();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (omegaPulse) {
        soundEngine.stopOmegaPulse();
      }
    };
  }, [omegaPulse, soundEngine]);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Enable/Disable Toggle */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
          ${enabled
            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
            : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
          }
        `}
        title={enabled ? 'Disable audio' : 'Enable audio'}
      >
        <span className="text-lg">{enabled ? '🔊' : '🔇'}</span>
        <span className="text-sm font-medium">
          {enabled ? 'Audio On' : 'Audio Off'}
        </span>
      </button>

      {/* Volume Slider */}
      {enabled && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-cyan-400 font-mono w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Ω Pulse Toggle */}
      {enabled && (
        <button
          onClick={handleOmegaToggle}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm
            ${omegaPulse
              ? 'border-purple-500 bg-purple-500/10 text-purple-400'
              : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
            }
          `}
          title={omegaPulse ? 'Stop Ω pulse' : 'Start Ω pulse (0.847 Hz)'}
        >
          <span>{omegaPulse ? '🌊' : '⭕'}</span>
          <span className="font-mono">Ω Pulse</span>
        </button>
      )}

      {/* Info */}
      {enabled && (
        <div className="text-xs text-gray-500 font-mono">
          {omegaPulse && <span className="text-purple-400 animate-pulse">● </span>}
          Sonification active
        </div>
      )}
    </div>
  );
};
