import { useState, useMemo, useCallback } from 'react';
import Fretboard from './components/Fretboard';
import Controls from './components/Controls';
import ProgressionBar from './components/ProgressionBar';
import Transport from './components/Transport';
import IntervalMap from './components/IntervalMap';
import IntervalLegend from './components/IntervalLegend';
import { useMetronome } from './hooks/useMetronome';
import {
  SCALES,
  PROGRESSIONS,
  transposeNote,
  type NoteName,
  type ScaleDefinition,
  type Progression,
} from './lib/music';
import './App.css';

function App() {
  const [keyRoot, setKeyRoot] = useState<NoteName>('A');
  const [selectedScale, setSelectedScale] = useState<ScaleDefinition>(SCALES[0]);
  const [selectedProgression, setSelectedProgression] = useState<Progression>(PROGRESSIONS[0]);
  const [activeBarIndex, setActiveBarIndex] = useState(0);
  const [labelMode, setLabelMode] = useState<'chordInterval' | 'keyInterval' | 'noteName'>('chordInterval');
  const [showNextChord, setShowNextChord] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentChordIdx = selectedProgression.bars[activeBarIndex];
  const currentChord = selectedProgression.chords[currentChordIdx];
  const nextBarIndex = (activeBarIndex + 1) % selectedProgression.bars.length;
  const nextChordIdx = selectedProgression.bars[nextBarIndex];
  const nextChord = selectedProgression.chords[nextChordIdx];

  const currentChordRoot = useMemo(() => transposeNote(keyRoot, currentChord.rootInterval), [keyRoot, currentChord]);
  const nextChordRoot = useMemo(() => transposeNote(keyRoot, nextChord.rootInterval), [keyRoot, nextChord]);
  const nextIsDifferent = currentChordIdx !== nextChordIdx;

  const handleMetronomeBar = useCallback((barIndex: number) => {
    setActiveBarIndex(barIndex);
  }, []);

  const metro = useMetronome(
    selectedProgression.bars.length,
    activeBarIndex,
    handleMetronomeBar,
  );

  const sidebarContent = (
    <>
      <header className="app-header">
        <h1>Fretboard Explorer</h1>
        <p className="subtitle">
          Key of {keyRoot} &middot; {selectedScale.name}
        </p>
        <p className="subtitle chord-subtitle">
          <span className="current-chord-label">
            {currentChordRoot}{currentChord.chordType.symbol}
          </span>
          {showNextChord && nextIsDifferent && (
            <>
              {' \u2192 '}
              <span className="next-chord-label">
                {nextChordRoot}{nextChord.chordType.symbol}
              </span>
            </>
          )}
          {showNextChord && !nextIsDifferent && (
            <span className="same-chord-hint"> (same next bar)</span>
          )}
        </p>
      </header>

      <Transport metro={metro} />

      <Controls
        keyRoot={keyRoot}
        setKeyRoot={setKeyRoot}
        selectedScale={selectedScale}
        setSelectedScale={setSelectedScale}
        selectedProgression={selectedProgression}
        setSelectedProgression={(prog) => {
          setSelectedProgression(prog);
          setActiveBarIndex(0);
        }}
        labelMode={labelMode}
        setLabelMode={setLabelMode}
        showNextChord={showNextChord}
        setShowNextChord={setShowNextChord}
      />

      <ProgressionBar
        keyRoot={keyRoot}
        progression={selectedProgression}
        activeBarIndex={activeBarIndex}
        setActiveBarIndex={setActiveBarIndex}
      />

      {showNextChord && nextIsDifferent && (
        <IntervalMap
          keyRoot={keyRoot}
          scaleIntervals={selectedScale.intervals}
          currentChord={currentChord}
          nextChord={nextChord}
        />
      )}

      <IntervalLegend
        currentChordName={`${currentChordRoot}${currentChord.chordType.symbol}`}
        nextChordName={`${nextChordRoot}${nextChord.chordType.symbol}`}
        currentChordIntervals={currentChord.chordType.intervals}
        nextChordIntervals={nextIsDifferent ? nextChord.chordType.intervals : []}
        showNextChord={showNextChord && nextIsDifferent}
      />
    </>
  );

  return (
    <div className="app">
      {/* Desktop sidebar */}
      <div className="sidebar">
        {sidebarContent}
      </div>

      {/* Mobile: floating info bar */}
      <div className="mobile-info-bar">
        <button
          className={`mobile-play-btn ${metro.isPlaying ? 'playing' : ''}`}
          onClick={metro.handlePlay}
        >
          {metro.isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="2" width="4" height="12" rx="1" />
              <rect x="10" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          )}
        </button>

        <div className="mobile-info-center">
          <span className="mobile-info-chord">
            <span className="current-chord-label">
              {currentChordRoot}{currentChord.chordType.symbol}
            </span>
            {showNextChord && nextIsDifferent && (
              <>
                {' \u2192 '}
                <span className="next-chord-label">
                  {nextChordRoot}{nextChord.chordType.symbol}
                </span>
              </>
            )}
          </span>
          <span className="mobile-info-sub">
            {keyRoot} {selectedScale.name} &middot; Bar {activeBarIndex + 1}/{selectedProgression.bars.length}
          </span>
        </div>

        {metro.isPlaying && (
          <div className="mobile-beat-dots">
            {Array.from({ length: metro.beatsPerBar }, (_, i) => (
              <span
                key={i}
                className={`beat-dot ${i === metro.currentBeat ? 'beat-dot-active' : ''} ${i === 0 && i === metro.currentBeat ? 'beat-dot-downbeat' : ''}`}
              />
            ))}
          </div>
        )}

        {!metro.isPlaying && (
          <span className="mobile-bpm-label">{metro.bpm} BPM</span>
        )}
      </div>

      {/* Fretboard fills remaining space */}
      <div className="fretboard-panel">
        <Fretboard
          keyRoot={keyRoot}
          scaleIntervals={selectedScale.intervals}
          currentChordRoot={currentChordRoot}
          currentChordIntervals={currentChord.chordType.intervals}
          nextChordRoot={showNextChord && nextIsDifferent ? nextChordRoot : null}
          nextChordIntervals={showNextChord && nextIsDifferent ? nextChord.chordType.intervals : []}
          labelMode={labelMode}
          showNextChord={showNextChord && nextIsDifferent}
        />
      </div>

      {/* Mobile: FAB to open controls */}
      <button
        className="mobile-fab"
        onClick={() => setMobileMenuOpen(true)}
        title="Open controls"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile: full-screen overlay with controls */}
      {mobileMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-overlay-panel">
            <button
              className="mobile-overlay-close"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
