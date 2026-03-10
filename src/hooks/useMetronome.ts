import { useState, useEffect, useRef, useCallback } from 'react';
import { Metronome } from '../lib/metronome';

export interface MetronomeState {
  bpm: number;
  beatsPerBar: number;
  isPlaying: boolean;
  currentBeat: number;
  currentBar: number;
  setBpm: (bpm: number) => void;
  setBeatsPerBar: (beats: number) => void;
  handleBpmChange: (delta: number) => void;
  handlePlay: () => void;
}

export function useMetronome(
  totalBars: number,
  activeBarIndex: number,
  onBarChange: (barIndex: number) => void,
): MetronomeState {
  const [bpm, setBpmState] = useState(80);
  const [beatsPerBar, setBeatsPerBarState] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [currentBar, setCurrentBar] = useState(0);
  const metronomeRef = useRef<Metronome | null>(null);
  const onBarChangeRef = useRef(onBarChange);
  const lastMetronomeBar = useRef(0);

  // Keep callback ref fresh
  onBarChangeRef.current = onBarChange;

  // Init metronome once
  useEffect(() => {
    const m = new Metronome();
    metronomeRef.current = m;
    return () => m.dispose();
  }, []);

  // Sync settings to metronome
  useEffect(() => {
    const m = metronomeRef.current;
    if (!m) return;
    m.setBpm(bpm);
    m.setBeatsPerBar(beatsPerBar);
    m.setTotalBars(totalBars);
  }, [bpm, beatsPerBar, totalBars]);

  // Set up callbacks
  useEffect(() => {
    const m = metronomeRef.current;
    if (!m) return;

    m.setOnBeat((beat, bar) => {
      setCurrentBeat(beat);
      setCurrentBar(bar);
    });

    m.setOnBarChange((_beat, bar) => {
      lastMetronomeBar.current = bar;
      onBarChangeRef.current(bar);
    });
  }, []);

  // Sync metronome when activeBarIndex changes externally
  useEffect(() => {
    const m = metronomeRef.current;
    if (!m || !isPlaying) return;
    if (activeBarIndex !== lastMetronomeBar.current) {
      m.seekToBar(activeBarIndex);
    }
  }, [activeBarIndex, isPlaying]);

  const setBpm = useCallback((v: number) => {
    setBpmState(Math.max(30, Math.min(300, v)));
  }, []);

  const setBeatsPerBar = useCallback((v: number) => {
    setBeatsPerBarState(v);
  }, []);

  const handleBpmChange = useCallback((delta: number) => {
    setBpmState((prev) => Math.max(30, Math.min(300, prev + delta)));
  }, []);

  const handlePlay = useCallback(() => {
    const m = metronomeRef.current;
    if (!m) return;
    if (isPlaying) {
      m.stop();
      setIsPlaying(false);
      setCurrentBeat(-1);
    } else {
      m.start(activeBarIndex);
      setIsPlaying(true);
    }
  }, [isPlaying, activeBarIndex]);

  // Keyboard: space to play/stop
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handlePlay();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handlePlay]);

  return {
    bpm,
    beatsPerBar,
    isPlaying,
    currentBeat,
    currentBar,
    setBpm,
    setBeatsPerBar,
    handleBpmChange,
    handlePlay,
  };
}
