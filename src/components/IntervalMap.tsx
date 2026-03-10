import { useMemo } from 'react';
import {
  INTERVALS,
  getIntervalMappings,
  transposeNote,
  type NoteName,
  type ProgressionChord,
} from '../lib/music';

interface IntervalMapProps {
  keyRoot: NoteName;
  scaleIntervals: string[];
  currentChord: ProgressionChord;
  nextChord: ProgressionChord;
}

export default function IntervalMap({
  keyRoot,
  scaleIntervals,
  currentChord,
  nextChord,
}: IntervalMapProps) {
  const currentRoot = useMemo(() => transposeNote(keyRoot, currentChord.rootInterval), [keyRoot, currentChord]);
  const nextRoot = useMemo(() => transposeNote(keyRoot, nextChord.rootInterval), [keyRoot, nextChord]);

  const mappings = useMemo(() => getIntervalMappings(
    keyRoot,
    scaleIntervals,
    currentRoot,
    currentChord.chordType.intervals,
    nextRoot,
    nextChord.chordType.intervals,
  ), [keyRoot, scaleIntervals, currentRoot, currentChord, nextRoot, nextChord]);

  // Precompute key interval for each mapping row (avoids inline IIFE in JSX)
  const keyIntervalForNote = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of mappings) {
      const match = scaleIntervals.find(si => {
        const info = INTERVALS[si];
        return info && transposeNote(keyRoot, info.semitones) === m.note;
      });
      map.set(m.note, match ? INTERVALS[match]?.shortName ?? '' : '');
    }
    return map;
  }, [mappings, scaleIntervals, keyRoot]);

  return (
    <div className="interval-map">
      <div className="interval-map-header">
        <span className="map-label">Voice Leading</span>
        <span className="map-desc">
          How scale tones function across{' '}
          <strong className="map-current-name">
            {currentRoot}{currentChord.chordType.symbol}
          </strong>
          {' \u2192 '}
          <strong className="map-next-name">
            {nextRoot}{nextChord.chordType.symbol}
          </strong>
        </span>
      </div>

      <div className="interval-map-grid">
        {/* Header row */}
        <div className="map-row map-row-header">
          <span className="map-cell map-cell-note">Note</span>
          <span className="map-cell map-cell-key">Key</span>
          <span className="map-cell map-cell-current">
            {currentChord.degree}
          </span>
          <span className="map-cell map-cell-arrow" />
          <span className="map-cell map-cell-next">
            {nextChord.degree}
          </span>
        </div>

        {mappings.map((m, i) => {
          return (
            <div
              key={i}
              className={`map-row ${m.isChordToneInCurrent || m.isChordToneInNext ? 'map-row-highlight' : ''}`}
            >
              <span className="map-cell map-cell-note">{m.note}</span>
              <span className="map-cell map-cell-key">
                {keyIntervalForNote.get(m.note) ?? ''}
              </span>
              <span
                className={`map-cell map-cell-current ${m.isChordToneInCurrent ? 'map-tone-current' : ''}`}
              >
                {m.intervalInCurrent}
                {m.isChordToneInCurrent && <span className="tone-dot tone-dot-current" />}
              </span>
              <span className="map-cell map-cell-arrow">
                {m.intervalInCurrent !== m.intervalInNext ? (
                  <span className="arrow-text">{'\u2192'}</span>
                ) : (
                  <span className="arrow-text same">{'='}</span>
                )}
              </span>
              <span
                className={`map-cell map-cell-next ${m.isChordToneInNext ? 'map-tone-next' : ''}`}
              >
                {m.intervalInNext}
                {m.isChordToneInNext && <span className="tone-dot tone-dot-next" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
