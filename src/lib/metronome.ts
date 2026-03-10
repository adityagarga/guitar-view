// Web Audio API metronome with lookahead scheduling for rock-solid timing.
// Based on Chris Wilson's "A Tale of Two Clocks" technique.

export type MetronomeCallback = (beat: number, bar: number) => void;

export class Metronome {
  private audioCtx: AudioContext | null = null;
  private bpm = 120;
  private beatsPerBar = 4;
  private currentBeat = 0;
  private currentBar = 0;
  private totalBars = 12;
  private isPlaying = false;
  private timerID: number | null = null;
  private nextNoteTime = 0;
  private scheduleAheadTime = 0.1;   // seconds to look ahead
  private lookaheadMs = 25;           // how often to call scheduler (ms)
  private onBeat: MetronomeCallback | null = null;
  private onBarChange: MetronomeCallback | null = null;

  constructor() {
    // Lazy-init AudioContext on first play (browser policy)
  }

  private getAudioCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  setBpm(bpm: number) {
    this.bpm = Math.max(30, Math.min(300, bpm));
  }

  getBpm() {
    return this.bpm;
  }

  setBeatsPerBar(beats: number) {
    this.beatsPerBar = beats;
  }

  setTotalBars(bars: number) {
    this.totalBars = bars;
  }

  setOnBeat(cb: MetronomeCallback) {
    this.onBeat = cb;
  }

  setOnBarChange(cb: MetronomeCallback) {
    this.onBarChange = cb;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  // Sync internal bar position (e.g. when user clicks a bar while playing)
  seekToBar(bar: number) {
    this.currentBar = bar % this.totalBars;
    this.currentBeat = 0;
  }

  private scheduleClick(time: number, isDownbeat: boolean) {
    const ctx = this.getAudioCtx();

    // Short sine beep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isDownbeat) {
      // Higher pitch, louder for beat 1
      osc.frequency.value = 1000;
      gain.gain.value = 0.3;
    } else {
      osc.frequency.value = 700;
      gain.gain.value = 0.15;
    }

    osc.start(time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.stop(time + 0.06);
  }

  private scheduler() {
    const ctx = this.getAudioCtx();
    const secondsPerBeat = 60.0 / this.bpm;

    while (this.nextNoteTime < ctx.currentTime + this.scheduleAheadTime) {
      const isDownbeat = this.currentBeat === 0;

      // Schedule the audio click
      this.scheduleClick(this.nextNoteTime, isDownbeat);

      // Fire callbacks (use setTimeout to align with the scheduled audio time)
      const beat = this.currentBeat;
      const bar = this.currentBar;
      const delay = Math.max(0, (this.nextNoteTime - ctx.currentTime) * 1000);

      setTimeout(() => {
        this.onBeat?.(beat, bar);
        if (beat === 0) {
          this.onBarChange?.(beat, bar);
        }
      }, delay);

      // Advance beat
      this.currentBeat++;
      if (this.currentBeat >= this.beatsPerBar) {
        this.currentBeat = 0;
        this.currentBar = (this.currentBar + 1) % this.totalBars;
      }

      this.nextNoteTime += secondsPerBeat;
    }
  }

  start(fromBar = 0) {
    if (this.isPlaying) return;

    const ctx = this.getAudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;
    this.currentBar = fromBar % this.totalBars;
    this.nextNoteTime = ctx.currentTime + 0.05; // tiny delay to avoid glitch

    this.timerID = window.setInterval(() => this.scheduler(), this.lookaheadMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
    this.currentBeat = 0;
    this.currentBar = 0;
  }

  dispose() {
    this.stop();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
