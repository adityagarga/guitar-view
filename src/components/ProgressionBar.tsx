import { transposeNote, type NoteName, type Progression } from '../lib/music';

interface ProgressionBarProps {
  keyRoot: NoteName;
  progression: Progression;
  activeBarIndex: number;
  setActiveBarIndex: (i: number) => void;
}

export default function ProgressionBar({
  keyRoot,
  progression,
  activeBarIndex,
  setActiveBarIndex,
}: ProgressionBarProps) {
  const { chords, bars } = progression;
  const nextBarIndex = (activeBarIndex + 1) % bars.length;
  const activeChordIdx = bars[activeBarIndex];
  const nextChordIdx = bars[nextBarIndex];

  return (
    <div className="progression-bar">
      {/* Bar grid */}
      <div className="bar-grid-label">
        <span className="control-label">Form ({bars.length} bars)</span>
      </div>
      <div className="bar-grid">
        {bars.map((chordIdx, barIdx) => {
          const chord = chords[chordIdx];
          const chordRoot = transposeNote(keyRoot, chord.rootInterval);
          const isActive = barIdx === activeBarIndex;
          const isNext = barIdx === nextBarIndex;
          // Is this bar a chord change from the previous bar?
          const prevChordIdx = barIdx > 0 ? bars[barIdx - 1] : bars[bars.length - 1];
          const isChange = chordIdx !== prevChordIdx;

          return (
            <button
              key={barIdx}
              className={`bar-cell ${isActive ? 'bar-active' : ''} ${isNext ? 'bar-next' : ''} ${isChange ? 'bar-change' : ''}`}
              onClick={() => setActiveBarIndex(barIdx)}
              title={`Bar ${barIdx + 1}: ${chordRoot}${chord.chordType.symbol} (${chord.degree})`}
            >
              <span className="bar-degree">{chord.degree}</span>
              <span className="bar-number">{barIdx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Unique chords summary */}
      <div className="progression-chords">
        {chords.map((chord, i) => {
          const chordRoot = transposeNote(keyRoot, chord.rootInterval);
          const isActive = i === activeChordIdx;
          const isNext = i === nextChordIdx && nextChordIdx !== activeChordIdx;

          return (
            <div
              key={i}
              className={`chord-summary ${isActive ? 'active' : ''} ${isNext ? 'next' : ''}`}
            >
              <span className="chord-degree">{chord.degree}</span>
              <span className="chord-name-display">
                {chordRoot}{chord.chordType.symbol}
              </span>
              <span className="chord-role">{chord.degreeName}</span>
              <div className="chord-tones">
                {chord.chordType.intervals.map((interval) => {
                  const isRoot = interval === 'R';
                  return (
                    <span
                      key={interval}
                      className={`tone-chip ${isActive ? 'tone-chip-active' : ''} ${isRoot && isActive ? 'tone-chip-root' : ''}`}
                    >
                      {interval}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
