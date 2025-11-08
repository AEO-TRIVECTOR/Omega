/**
 * Sound Design Engine for Consciousness Mathematics
 * 
 * Sonifies mathematical concepts:
 * - Eigenvalues → Musical frequencies
 * - Connes distance → Pitch intervals
 * - State transitions → Timbral shifts
 * - Ω resonance → Ambient pulse at 0.847 Hz
 */

export class SoundEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private omegaOscillator: OscillatorNode | null = null;
  private omegaGain: GainNode | null = null;
  private enabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.3; // Master volume
      this.masterGain.connect(this.context.destination);
    }
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  async init(): Promise<void> {
    if (!this.context) return;
    
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    
    this.enabled = true;
  }

  /**
   * Start Ω resonance ambient pulse (0.847 Hz)
   */
  startOmegaPulse(): void {
    if (!this.context || !this.masterGain || this.omegaOscillator) return;

    const omega = 0.847; // Hz
    
    // Create sub-bass oscillator
    this.omegaOscillator = this.context.createOscillator();
    this.omegaOscillator.type = 'sine';
    this.omegaOscillator.frequency.value = omega * 40; // Audible range (33.88 Hz)
    
    // Create LFO for amplitude modulation
    const lfo = this.context.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = omega; // 0.847 Hz pulse
    
    // LFO gain (modulation depth)
    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 0.05; // Subtle modulation
    
    // Omega gain
    this.omegaGain = this.context.createGain();
    this.omegaGain.gain.value = 0.1; // Base volume
    
    // Connect: LFO → LFO Gain → Omega Gain
    lfo.connect(lfoGain);
    lfoGain.connect(this.omegaGain.gain);
    
    // Connect: Oscillator → Omega Gain → Master
    this.omegaOscillator.connect(this.omegaGain);
    this.omegaGain.connect(this.masterGain);
    
    // Start
    this.omegaOscillator.start();
    lfo.start();
  }

  /**
   * Stop Ω resonance pulse
   */
  stopOmegaPulse(): void {
    if (this.omegaOscillator) {
      this.omegaOscillator.stop();
      this.omegaOscillator.disconnect();
      this.omegaOscillator = null;
    }
    
    if (this.omegaGain) {
      this.omegaGain.disconnect();
      this.omegaGain = null;
    }
  }

  /**
   * Play eigenvalue as musical note
   * Maps eigenvalue to frequency using harmonic series
   */
  playEigenvalue(eigenvalue: number, duration: number = 0.5): void {
    if (!this.context || !this.masterGain || !this.enabled) return;

    const now = this.context.currentTime;
    
    // Map eigenvalue to frequency (C major scale)
    // Base frequency: 261.63 Hz (C4)
    const baseFreq = 261.63;
    const scale = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2]; // Just intonation
    const scaleIndex = Math.floor(eigenvalue * 10) % scale.length;
    const frequency = baseFreq * scale[scaleIndex] * (1 + eigenvalue);
    
    // Create oscillator
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    // Create gain envelope (ADSR)
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05); // Attack
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1); // Decay
    gain.gain.setValueAtTime(0.15, now + duration - 0.1); // Sustain
    gain.gain.linearRampToValueAtTime(0, now + duration); // Release
    
    // Connect
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    // Play
    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Play Connes distance as pitch interval
   */
  playConnesDistance(distance: number, maxDistance: number, duration: number = 0.8): void {
    if (!this.context || !this.masterGain || !this.enabled) return;

    const now = this.context.currentTime;
    
    // Normalize distance to [0, 1]
    const normalized = Math.min(distance / maxDistance, 1);
    
    // Map to frequency range (200 Hz - 800 Hz)
    const frequency = 200 + normalized * 600;
    
    // Create two oscillators for harmonic richness
    const osc1 = this.context.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = frequency;
    
    const osc2 = this.context.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 1.5; // Perfect fifth
    
    // Create gain envelope
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    // Connect
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    
    // Play
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Play state transition sound
   */
  playStateTransition(fromState: number, toState: number, totalStates: number): void {
    if (!this.context || !this.masterGain || !this.enabled) return;

    const now = this.context.currentTime;
    
    // Map states to frequencies
    const baseFreq = 440; // A4
    const freq1 = baseFreq * Math.pow(2, fromState / totalStates);
    const freq2 = baseFreq * Math.pow(2, toState / totalStates);
    
    // Create oscillator with frequency sweep
    const osc = this.context.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq1, now);
    osc.frequency.exponentialRampToValueAtTime(freq2, now + 0.3);
    
    // Create gain envelope
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    // Connect
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    // Play
    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Play parameter sweep sound (for μ, Ω, κ changes)
   */
  playParameterSweep(value: number, min: number, max: number): void {
    if (!this.context || !this.masterGain || !this.enabled) return;

    const now = this.context.currentTime;
    
    // Normalize value to [0, 1]
    const normalized = (value - min) / (max - min);
    
    // Map to frequency (100 Hz - 400 Hz)
    const frequency = 100 + normalized * 300;
    
    // Create oscillator
    const osc = this.context.createOscillator();
    osc.type = 'square';
    osc.frequency.value = frequency;
    
    // Create gain envelope (very short)
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    // Connect
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    // Play
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Play click sound
   */
  playClick(): void {
    if (!this.context || !this.masterGain || !this.enabled) return;

    const now = this.context.currentTime;
    
    // Create noise buffer
    const bufferSize = this.context.sampleRate * 0.05;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // Create buffer source
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    
    // Create filter (high-pass)
    const filter = this.context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    // Create gain envelope
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    // Connect
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    // Play
    source.start(now);
  }

  /**
   * Set master volume
   */
  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Enable/disable sound
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    
    if (!enabled) {
      this.stopOmegaPulse();
    }
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.stopOmegaPulse();
    
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
}

// Global singleton instance
let globalSoundEngine: SoundEngine | null = null;

export function getSoundEngine(): SoundEngine {
  if (!globalSoundEngine) {
    globalSoundEngine = new SoundEngine();
  }
  return globalSoundEngine;
}
