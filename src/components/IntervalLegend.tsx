import { INTERVALS, type IntervalInfo } from '../lib/music';

// Chord tone color map (same as Fretboard.tsx — kept in sync)
const CHORD_TONE_COLORS: Record<string, { fill: string; stroke: string }> = {
  'R':  { fill: '#a83228', stroke: '#d4453a' },
  '3':  { fill: '#8a6d2e', stroke: '#c9a23e' },
  'b3': { fill: '#7a5e1e', stroke: '#b8922e' },
  '5':  { fill: '#2e5e7a', stroke: '#4a90b8' },
  'b5': { fill: '#5e3a6e', stroke: '#8a5ea0' },
  '7':  { fill: '#2e6e5e', stroke: '#4aaa8e' },
  'b7': { fill: '#4e3e7a', stroke: '#7a68b0' },
  '2':  { fill: '#6e5a2e', stroke: '#a08840' },
  '4':  { fill: '#3a6e4e', stroke: '#58a070' },
  '6':  { fill: '#5e6e2e', stroke: '#8aa048' },
  'b6': { fill: '#5e4e3e', stroke: '#8a7868' },
  'b2': { fill: '#5e3e4e', stroke: '#8a6878' },
  '#5': { fill: '#5e3a5e', stroke: '#8a5a8a' },
};

function getToneColor(interval: string) {
  return CHORD_TONE_COLORS[interval] || { fill: '#333', stroke: '#888' };
}

interface IntervalLegendProps {
  currentChordName: string;
  nextChordName: string;
  currentChordIntervals: string[];
  nextChordIntervals: string[];
  showNextChord: boolean;
}

export default function IntervalLegend({
  currentChordName,
  nextChordName,
  currentChordIntervals,
  nextChordIntervals,
  showNextChord,
}: IntervalLegendProps) {
  const currentSet = new Set(currentChordIntervals);

  return (
    <div className="interval-legend">
      {/* Current chord tones */}
      <div className="legend-section">
        <span className="legend-title">
          <span className="legend-title-label">Current</span>
          <span className="legend-chord-name legend-chord-current">{currentChordName}</span>
        </span>
        <div className="legend-grid">
          {currentChordIntervals.map((key) => {
            const info: IntervalInfo | undefined = INTERVALS[key];
            if (!info) return null;
            const colors = getToneColor(key);
            return (
              <div key={key} className="legend-item">
                <span
                  className="legend-dot"
                  style={{
                    background: colors.fill,
                    borderColor: colors.stroke,
                  }}
                />
                <span className="legend-short" style={{ color: colors.stroke }}>
                  {info.shortName}
                </span>
                <span className="legend-name">{info.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next chord tones */}
      {showNextChord && nextChordIntervals.length > 0 && (
        <div className="legend-section">
          <span className="legend-title">
            <span className="legend-title-label">Next</span>
            <span className="legend-chord-name legend-chord-next">{nextChordName}</span>
          </span>
          <div className="legend-grid">
            {nextChordIntervals.map((key) => {
              const info: IntervalInfo | undefined = INTERVALS[key];
              if (!info) return null;
              const colors = getToneColor(key);
              const isShared = currentSet.has(key);
              return (
                <div key={key} className="legend-item">
                  <span
                    className="legend-dot legend-dot-next"
                    style={{
                      borderColor: colors.stroke,
                      background: `${colors.fill}59`, // 35% alpha
                    }}
                  />
                  <span className="legend-short" style={{ color: colors.stroke }}>
                    {info.shortName}
                  </span>
                  <span className="legend-name">{info.name}</span>
                  {isShared && <span className="shared-badge">shared</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
