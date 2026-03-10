import { useMemo } from 'react';
import {
  STANDARD_TUNING,
  NUM_FRETS,
  FRET_MARKERS,
  DOUBLE_MARKERS,
  buildFretboard,
  type NoteName,
  type FretPosition,
} from '../lib/music';

interface FretboardProps {
  keyRoot: NoteName;
  scaleIntervals: string[];
  currentChordRoot: NoteName;
  currentChordIntervals: string[];
  nextChordRoot: NoteName | null;
  nextChordIntervals: string[];
  labelMode: 'chordInterval' | 'keyInterval' | 'noteName';
  showNextChord: boolean;
}

// ViewBox coordinates (the SVG will scale to fill its container)
const STRING_SPACING = 56;
const FRET_HEIGHT = 64;
const LEFT_MARGIN = 48;
const TOP_MARGIN = 52;
const NUT_HEIGHT = 6;
const DOT_RADIUS = 19;
const NUM_STRINGS = 6;

function getStringX(stringIndex: number): number {
  return LEFT_MARGIN + stringIndex * STRING_SPACING;
}

function getFretY(fret: number): number {
  return TOP_MARGIN + NUT_HEIGHT + fret * FRET_HEIGHT;
}

function getFretMidY(fret: number): number {
  if (fret === 0) return TOP_MARGIN - 16;
  return getFretY(fret - 1) + FRET_HEIGHT / 2;
}

// Chord tone color map
const CHORD_TONE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  'R':  { fill: '#a83228', stroke: '#d4453a', text: '#fff' },
  '3':  { fill: '#8a6d2e', stroke: '#c9a23e', text: '#f5e6c0' },
  'b3': { fill: '#7a5e1e', stroke: '#b8922e', text: '#f0ddb0' },
  '5':  { fill: '#2e5e7a', stroke: '#4a90b8', text: '#c8e0f0' },
  'b5': { fill: '#5e3a6e', stroke: '#8a5ea0', text: '#dcc8e8' },
  '7':  { fill: '#2e6e5e', stroke: '#4aaa8e', text: '#c0e8dc' },
  'b7': { fill: '#4e3e7a', stroke: '#7a68b0', text: '#d0c8e8' },
  '2':  { fill: '#6e5a2e', stroke: '#a08840', text: '#e8dcc0' },
  '4':  { fill: '#3a6e4e', stroke: '#58a070', text: '#c8e8d4' },
  '6':  { fill: '#5e6e2e', stroke: '#8aa048', text: '#dce8c0' },
  'b6': { fill: '#5e4e3e', stroke: '#8a7868', text: '#e0d8d0' },
  'b2': { fill: '#5e3e4e', stroke: '#8a6878', text: '#e0d0d8' },
  '#5': { fill: '#5e3a5e', stroke: '#8a5a8a', text: '#dcc8dc' },
};

const DEFAULT_CHORD_TONE = { fill: '#333', stroke: '#888', text: '#ddd' };

function getChordToneColor(interval: string) {
  return CHORD_TONE_COLORS[interval] || DEFAULT_CHORD_TONE;
}

export default function Fretboard({
  keyRoot,
  scaleIntervals,
  currentChordRoot,
  currentChordIntervals,
  nextChordRoot,
  nextChordIntervals,
  labelMode,
  showNextChord,
}: FretboardProps) {
  const positions = useMemo(
    () =>
      buildFretboard(
        keyRoot,
        scaleIntervals,
        currentChordRoot,
        currentChordIntervals,
        nextChordRoot,
        nextChordIntervals,
        STANDARD_TUNING,
        NUM_FRETS
      ),
    [keyRoot, scaleIntervals, currentChordRoot, currentChordIntervals, nextChordRoot, nextChordIntervals]
  );

  const vbWidth = LEFT_MARGIN + (NUM_STRINGS - 1) * STRING_SPACING + 48;
  const vbHeight = TOP_MARGIN + NUT_HEIGHT + NUM_FRETS * FRET_HEIGHT + 36;

  const visiblePositions = positions.filter((pos) => {
    return pos.inScale || pos.inCurrentChord || (showNextChord && pos.inNextChord);
  });

  function getLabel(pos: FretPosition): string {
    if (labelMode === 'noteName') return pos.note;
    if (labelMode === 'keyInterval') return pos.intervalFromKey;
    return pos.intervalFromChord;
  }

  function getDotStyle(pos: FretPosition): {
    fill: string;
    fillOpacity: number;
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
    opacity: number;
    textColor: string;
    radius: number;
  } {
    if (pos.inCurrentChord) {
      const colors = getChordToneColor(pos.intervalFromChord);
      const isRoot = pos.intervalFromChord === 'R';
      return {
        fill: colors.fill,
        fillOpacity: 1,
        stroke: colors.stroke,
        strokeWidth: isRoot ? 3 : 2,
        opacity: 1,
        textColor: colors.text,
        radius: isRoot ? DOT_RADIUS + 2 : DOT_RADIUS,
      };
    }

    if (showNextChord && pos.inNextChord && !pos.inCurrentChord) {
      const nextColors = getChordToneColor(pos.intervalInNextChord);
      return {
        fill: nextColors.fill,
        fillOpacity: 0.35,
        stroke: nextColors.stroke,
        strokeWidth: 3,
        strokeDasharray: '5 3',
        opacity: 1,
        textColor: '#ddd',
        radius: DOT_RADIUS,
      };
    }

    return {
      fill: '#1a1a1a',
      fillOpacity: 1,
      stroke: '#333',
      strokeWidth: 1,
      opacity: 0.3,
      textColor: '#555',
      radius: DOT_RADIUS - 4,
    };
  }

  return (
    <div className="fretboard-container">
      <svg
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="fretboard-svg"
      >
        {/* Fretboard wood */}
        <rect
          x={LEFT_MARGIN - 14}
          y={TOP_MARGIN}
          width={(NUM_STRINGS - 1) * STRING_SPACING + 28}
          height={NUT_HEIGHT + NUM_FRETS * FRET_HEIGHT + 12}
          rx={5}
          fill="#1a1408"
          opacity={0.7}
        />

        {/* Nut */}
        <rect
          x={LEFT_MARGIN - 14}
          y={TOP_MARGIN}
          width={(NUM_STRINGS - 1) * STRING_SPACING + 28}
          height={NUT_HEIGHT}
          fill="#c8b898"
          rx={1}
        />

        {/* Fret wires */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={LEFT_MARGIN - 14}
            y1={getFretY(fret)}
            x2={LEFT_MARGIN + (NUM_STRINGS - 1) * STRING_SPACING + 14}
            y2={getFretY(fret)}
            stroke="#555"
            strokeWidth={1.5}
            opacity={0.3}
          />
        ))}

        {/* Fret markers */}
        {FRET_MARKERS.map((fret) => {
          const markerX = LEFT_MARGIN + (NUM_STRINGS - 1) * STRING_SPACING + 34;
          const midY = getFretMidY(fret);
          const isDouble = DOUBLE_MARKERS.includes(fret);

          if (isDouble) {
            return (
              <g key={`marker-${fret}`}>
                <circle cx={markerX} cy={midY - 14} r={4} fill="#3a3a3a" opacity={0.6} />
                <circle cx={markerX} cy={midY + 14} r={4} fill="#3a3a3a" opacity={0.6} />
              </g>
            );
          }
          return (
            <circle key={`marker-${fret}`} cx={markerX} cy={midY} r={4} fill="#3a3a3a" opacity={0.6} />
          );
        })}

        {/* Fret numbers */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map((fret) => (
          <text
            key={`fretnum-${fret}`}
            x={LEFT_MARGIN - 30}
            y={getFretMidY(fret) + 4}
            textAnchor="middle"
            fill="#555"
            fontSize={11}
            fontFamily="monospace"
          >
            {fret}
          </text>
        ))}

        {/* Strings */}
        {STANDARD_TUNING.map((_, i) => {
          const x = getStringX(i);
          const thickness = 0.8 + (5 - i) * 0.3;
          return (
            <line
              key={`string-${i}`}
              x1={x}
              y1={TOP_MARGIN}
              x2={x}
              y2={vbHeight - 24}
              stroke="#a08030"
              strokeWidth={thickness}
              opacity={0.45}
            />
          );
        })}

        {/* String labels */}
        {STANDARD_TUNING.map((note, i) => (
          <text
            key={`label-${i}`}
            x={getStringX(i)}
            y={TOP_MARGIN - 10}
            textAnchor="middle"
            fill="#666"
            fontSize={13}
            fontFamily="monospace"
            fontWeight="bold"
          >
            {note}
          </text>
        ))}

        {/* Note dots */}
        {visiblePositions.map((pos) => {
          const cx = getStringX(pos.string);
          const cy = getFretMidY(pos.fret);
          const style = getDotStyle(pos);
          const label = getLabel(pos);

          const displayLabel =
            showNextChord && pos.inNextChord && !pos.inCurrentChord && labelMode === 'chordInterval'
              ? pos.intervalInNextChord
              : label;

          return (
            <g
              key={`${pos.string}-${pos.fret}`}
              opacity={style.opacity}
              className="note-dot"
            >
              <circle
                cx={cx}
                cy={cy}
                r={style.radius}
                fill={style.fill}
                fillOpacity={style.fillOpacity}
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                strokeDasharray={style.strokeDasharray}
              />
              {showNextChord && pos.inCurrentChord && pos.inNextChord && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={style.radius + 5}
                  fill="none"
                  stroke="#5b8a9a"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.5}
                />
              )}
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                fill={style.textColor}
                fontSize={displayLabel.length > 2 ? 10 : 13}
                fontFamily="system-ui, sans-serif"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {displayLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
