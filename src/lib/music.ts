// All 12 chromatic notes
export const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export type NoteName = (typeof NOTES)[number];

// Standard guitar tuning (low to high): E A D G B E
export const STANDARD_TUNING: NoteName[] = ['E', 'A', 'D', 'G', 'B', 'E'];

// Number of frets to display
export const NUM_FRETS = 24;

// Fret markers (dots on the fretboard)
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
export const DOUBLE_MARKERS = [12, 24];

// Interval names and their semitone distances from root
export interface IntervalInfo {
  name: string;
  shortName: string;
  semitones: number;
  color: string;
}

export const INTERVALS: Record<string, IntervalInfo> = {
  'R':  { name: 'Root',             shortName: 'R',  semitones: 0,  color: '#ef4444' },
  'b2': { name: 'Minor 2nd',        shortName: 'b2', semitones: 1,  color: '#8b5cf6' },
  '2':  { name: 'Major 2nd',        shortName: '2',  semitones: 2,  color: '#f97316' },
  'b3': { name: 'Minor 3rd',        shortName: 'b3', semitones: 3,  color: '#06b6d4' },
  '3':  { name: 'Major 3rd',        shortName: '3',  semitones: 4,  color: '#f59e0b' },
  '4':  { name: 'Perfect 4th',      shortName: '4',  semitones: 5,  color: '#10b981' },
  'b5': { name: 'Diminished 5th',   shortName: 'b5', semitones: 6,  color: '#ec4899' },
  '5':  { name: 'Perfect 5th',      shortName: '5',  semitones: 7,  color: '#3b82f6' },
  '#5': { name: 'Augmented 5th',    shortName: '#5', semitones: 8,  color: '#d946ef' },
  '6':  { name: 'Major 6th',        shortName: '6',  semitones: 9,  color: '#84cc16' },
  'b7': { name: 'Minor 7th',        shortName: 'b7', semitones: 10, color: '#6366f1' },
  '7':  { name: 'Major 7th',        shortName: '7',  semitones: 11, color: '#14b8a6' },
};

// b6 alias (same semitones as #5 — context determines which name to use)
(INTERVALS as Record<string, IntervalInfo>)['b6'] = {
  name: 'Minor 6th', shortName: 'b6', semitones: 8, color: '#d946ef'
};

// For semitone values that map to multiple interval names (#5 vs b6),
// this table defines the default. Context-aware functions override this.
const SEMITONE_TO_DEFAULT_INTERVAL: Record<number, string> = {};
for (const [, info] of Object.entries(INTERVALS)) {
  if (!(info.semitones in SEMITONE_TO_DEFAULT_INTERVAL)) {
    SEMITONE_TO_DEFAULT_INTERVAL[info.semitones] = info.shortName;
  }
}

// Scale definitions
export interface ScaleDefinition {
  name: string;
  intervals: string[];
}

export const SCALES: ScaleDefinition[] = [
  { name: 'Minor Pentatonic',         intervals: ['R', 'b3', '4', '5', 'b7'] },
  { name: 'Blues',                    intervals: ['R', 'b3', '4', 'b5', '5', 'b7'] },
  { name: 'Major Pentatonic',         intervals: ['R', '2', '3', '5', '6'] },
  { name: 'Major (Ionian)',           intervals: ['R', '2', '3', '4', '5', '6', '7'] },
  { name: 'Dorian',                   intervals: ['R', '2', 'b3', '4', '5', '6', 'b7'] },
  { name: 'Mixolydian',              intervals: ['R', '2', '3', '4', '5', '6', 'b7'] },
  { name: 'Minor (Aeolian)',          intervals: ['R', '2', 'b3', '4', '5', 'b6', 'b7'] },
  { name: 'Harmonic Minor',          intervals: ['R', '2', 'b3', '4', '5', 'b6', '7'] },
  { name: 'Phrygian',                 intervals: ['R', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
  { name: 'Lydian',                   intervals: ['R', '2', '3', 'b5', '5', '6', '7'] },
  { name: 'Locrian',                  intervals: ['R', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
  { name: 'Melodic Minor',           intervals: ['R', '2', 'b3', '4', '5', '6', '7'] },
  { name: 'Chromatic',               intervals: ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', '#5', '6', 'b7', '7'] },
];

// Chord definitions
export interface ChordDefinition {
  name: string;
  symbol: string;
  intervals: string[];
}

export const CHORDS: ChordDefinition[] = [
  { name: 'Dominant 7th',       symbol: '7',      intervals: ['R', '3', '5', 'b7'] },
  { name: 'Major',              symbol: '',       intervals: ['R', '3', '5'] },
  { name: 'Minor',              symbol: 'm',      intervals: ['R', 'b3', '5'] },
  { name: 'Major 7th',          symbol: 'maj7',   intervals: ['R', '3', '5', '7'] },
  { name: 'Minor 7th',          symbol: 'm7',     intervals: ['R', 'b3', '5', 'b7'] },
  { name: 'Diminished',         symbol: 'dim',    intervals: ['R', 'b3', 'b5'] },
  { name: 'Diminished 7th',     symbol: 'dim7',   intervals: ['R', 'b3', 'b5', '6'] },
  { name: 'Half-Diminished',    symbol: 'm7b5',   intervals: ['R', 'b3', 'b5', 'b7'] },
  { name: 'Augmented',          symbol: 'aug',    intervals: ['R', '3', '#5'] },
  { name: 'Suspended 2nd',      symbol: 'sus2',   intervals: ['R', '2', '5'] },
  { name: 'Suspended 4th',      symbol: 'sus4',   intervals: ['R', '4', '5'] },
  { name: 'Dominant 9th',       symbol: '9',      intervals: ['R', '2', '3', '5', 'b7'] },
  { name: 'Minor 9th',          symbol: 'm9',     intervals: ['R', '2', 'b3', '5', 'b7'] },
  { name: 'Major 9th',          symbol: 'maj9',   intervals: ['R', '2', '3', '5', '7'] },
  { name: 'Power Chord',        symbol: '5',      intervals: ['R', '5'] },
];

// ─── Chord Progression System ──────────────────────────────────────

export interface ProgressionChord {
  degree: string;       // 'I', 'IV', 'V', etc.
  degreeName: string;   // 'Tonic', 'Subdominant', 'Dominant'
  rootInterval: number; // semitones from key root (0 for I, 5 for IV, 7 for V)
  chordType: ChordDefinition;
}

export interface Progression {
  name: string;
  chords: ProgressionChord[];      // unique chord definitions
  bars: number[];                   // bar-by-bar sequence as indices into chords[]
}

// Helper to find chord def by symbol
function findChord(symbol: string): ChordDefinition {
  return CHORDS.find(c => c.symbol === symbol) || CHORDS[0];
}

const I7:  ProgressionChord = { degree: 'I',   degreeName: 'Tonic',        rootInterval: 0, chordType: findChord('7') };
const IV7: ProgressionChord = { degree: 'IV',  degreeName: 'Subdominant',  rootInterval: 5, chordType: findChord('7') };
const V7:  ProgressionChord = { degree: 'V',   degreeName: 'Dominant',     rootInterval: 7, chordType: findChord('7') };

export const PROGRESSIONS: Progression[] = [
  {
    name: '12-Bar Blues (I7-IV7-V7)',
    chords: [I7, IV7, V7],
    //        1   2   3   4   5   6   7   8   9  10  11  12
    bars:   [ 0,  0,  0,  0,  1,  1,  0,  0,  2,  1,  0,  0 ],
  },
  {
    name: '12-Bar Blues (V turnaround)',
    chords: [I7, IV7, V7],
    //        1   2   3   4   5   6   7   8   9  10  11  12
    bars:   [ 0,  0,  0,  0,  1,  1,  0,  0,  2,  1,  0,  2 ],
  },
  {
    name: 'Blues Minor (i7-iv7-v7)',
    chords: [
      { degree: 'i',   degreeName: 'Tonic',        rootInterval: 0, chordType: findChord('m7') },
      { degree: 'iv',  degreeName: 'Subdominant',   rootInterval: 5, chordType: findChord('m7') },
      { degree: 'v',   degreeName: 'Dominant',      rootInterval: 7, chordType: findChord('m7') },
    ],
    bars: [ 0, 0, 0, 0, 1, 1, 0, 0, 2, 1, 0, 0 ],
  },
  {
    name: 'Jazz Blues',
    chords: [
      { degree: 'I',   degreeName: 'Tonic',        rootInterval: 0, chordType: findChord('7') },
      { degree: 'IV',  degreeName: 'Subdominant',   rootInterval: 5, chordType: findChord('7') },
      { degree: 'ii',  degreeName: 'Supertonic',    rootInterval: 2, chordType: findChord('m7') },
      { degree: 'V',   degreeName: 'Dominant',      rootInterval: 7, chordType: findChord('7') },
    ],
    //        1   2   3   4   5   6   7   8   9  10  11  12
    bars:   [ 0,  1,  0,  0,  1,  1,  0,  0,  2,  3,  0,  3 ],
  },
  {
    name: 'I-IV-V Major',
    chords: [
      { degree: 'I',   degreeName: 'Tonic',        rootInterval: 0, chordType: findChord('') },
      { degree: 'IV',  degreeName: 'Subdominant',   rootInterval: 5, chordType: findChord('') },
      { degree: 'V',   degreeName: 'Dominant',      rootInterval: 7, chordType: findChord('') },
    ],
    bars: [ 0, 0, 1, 1, 2, 2, 0, 0 ],
  },
  {
    name: 'ii-V-I Jazz',
    chords: [
      { degree: 'ii',  degreeName: 'Supertonic',    rootInterval: 2, chordType: findChord('m7') },
      { degree: 'V',   degreeName: 'Dominant',      rootInterval: 7, chordType: findChord('7') },
      { degree: 'I',   degreeName: 'Tonic',         rootInterval: 0, chordType: findChord('maj7') },
    ],
    bars: [ 0, 0, 1, 1, 2, 2, 2, 2 ],
  },
  {
    name: 'i-iv-v Minor',
    chords: [
      { degree: 'i',   degreeName: 'Tonic',        rootInterval: 0, chordType: findChord('m') },
      { degree: 'iv',  degreeName: 'Subdominant',   rootInterval: 5, chordType: findChord('m') },
      { degree: 'v',   degreeName: 'Dominant',      rootInterval: 7, chordType: findChord('m') },
    ],
    bars: [ 0, 0, 1, 1, 2, 2, 0, 0 ],
  },
  {
    name: 'I-vi-IV-V (50s)',
    chords: [
      { degree: 'I',   degreeName: 'Tonic',        rootInterval: 0, chordType: findChord('') },
      { degree: 'vi',  degreeName: 'Submediant',    rootInterval: 9, chordType: findChord('m') },
      { degree: 'IV',  degreeName: 'Subdominant',   rootInterval: 5, chordType: findChord('') },
      { degree: 'V',   degreeName: 'Dominant',      rootInterval: 7, chordType: findChord('') },
    ],
    bars: [ 0, 1, 2, 3 ],
  },
];

// ─── Utility functions ──────────────────────────────────────

export function noteIndex(note: NoteName): number {
  return NOTES.indexOf(note);
}

export function getNoteAtFret(stringNote: NoteName, fret: number): NoteName {
  const idx = (noteIndex(stringNote) + fret) % 12;
  return NOTES[idx];
}

export function transposeNote(root: NoteName, semitones: number): NoteName {
  const idx = (noteIndex(root) + semitones + 12) % 12;
  return NOTES[idx];
}

// Get interval short name for a note relative to a given root.
// When preferredNames is provided (e.g. scale or chord interval names),
// ambiguous semitone values (like 8 = #5 or b6) resolve to the preferred name.
export function getIntervalFromRoot(
  root: NoteName,
  note: NoteName,
  preferredNames?: string[],
): string {
  const semitones = (noteIndex(note) - noteIndex(root) + 12) % 12;

  // If we have context, check if any preferred name matches this semitone count
  if (preferredNames) {
    for (const name of preferredNames) {
      const info = INTERVALS[name];
      if (info && info.semitones === semitones) {
        return info.shortName;
      }
    }
  }

  // Fallback: use default lookup
  const defaultName = SEMITONE_TO_DEFAULT_INTERVAL[semitones];
  return defaultName ?? '';
}

// ─── Fretboard builder ──────────────────────────────────────

export interface FretPosition {
  string: number;
  fret: number;
  note: NoteName;
  // Interval relative to the CURRENT chord root
  intervalFromChord: string;
  // Interval relative to the KEY root (for scale membership)
  intervalFromKey: string;
  inScale: boolean;
  inCurrentChord: boolean;
  inNextChord: boolean;
  // What interval this note is in the NEXT chord (for voice leading)
  intervalInNextChord: string;
}

export function buildFretboard(
  keyRoot: NoteName,
  scaleIntervals: string[],
  currentChordRoot: NoteName,
  currentChordIntervals: string[],
  nextChordRoot: NoteName | null,
  nextChordIntervals: string[],
  tuning: NoteName[] = STANDARD_TUNING,
  numFrets: number = NUM_FRETS
): FretPosition[] {
  const positions: FretPosition[] = [];

  const scaleSemitones = new Set(
    scaleIntervals.map((i) => INTERVALS[i]?.semitones).filter((s) => s !== undefined)
  );
  const currentChordSemitones = new Set(
    currentChordIntervals.map((i) => INTERVALS[i]?.semitones).filter((s) => s !== undefined)
  );
  const nextChordSemitones = new Set(
    nextChordIntervals.map((i) => INTERVALS[i]?.semitones).filter((s) => s !== undefined)
  );

  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= numFrets; f++) {
      const note = getNoteAtFret(tuning[s], f);

      // Interval from key root (for scale) — prefer scale interval names
      const semiFromKey = (noteIndex(note) - noteIndex(keyRoot) + 12) % 12;
      const intervalFromKey = getIntervalFromRoot(keyRoot, note, scaleIntervals);

      // Interval from current chord root — prefer chord interval names
      const semiFromChord = (noteIndex(note) - noteIndex(currentChordRoot) + 12) % 12;
      const intervalFromChord = getIntervalFromRoot(currentChordRoot, note, currentChordIntervals);

      // Interval from next chord root
      let intervalInNextChord = '';
      let inNextChord = false;
      if (nextChordRoot) {
        const semiFromNext = (noteIndex(note) - noteIndex(nextChordRoot) + 12) % 12;
        intervalInNextChord = getIntervalFromRoot(nextChordRoot, note, nextChordIntervals);
        inNextChord = nextChordSemitones.has(semiFromNext);
      }

      const inScale = scaleSemitones.has(semiFromKey);
      const inCurrentChord = currentChordSemitones.has(semiFromChord);

      positions.push({
        string: s,
        fret: f,
        note,
        intervalFromChord,
        intervalFromKey,
        inScale,
        inCurrentChord,
        inNextChord,
        intervalInNextChord,
      });
    }
  }

  return positions;
}

// ─── Voice leading: how intervals map between two chords ──────

export interface IntervalMapping {
  note: NoteName;
  intervalInCurrent: string;
  intervalInNext: string;
  isChordToneInCurrent: boolean;
  isChordToneInNext: boolean;
}

export function getIntervalMappings(
  keyRoot: NoteName,
  scaleIntervals: string[],
  currentChordRoot: NoteName,
  currentChordIntervals: string[],
  nextChordRoot: NoteName,
  nextChordIntervals: string[],
): IntervalMapping[] {
  const mappings: IntervalMapping[] = [];

  const currentChordSemitones = new Set(
    currentChordIntervals.map(i => INTERVALS[i]?.semitones).filter(s => s !== undefined)
  );
  const nextChordSemitones = new Set(
    nextChordIntervals.map(i => INTERVALS[i]?.semitones).filter(s => s !== undefined)
  );

  // For each note in the scale, show how it functions in both chords
  for (const scaleInterval of scaleIntervals) {
    const info = INTERVALS[scaleInterval];
    if (!info) continue;
    const note = transposeNote(keyRoot, info.semitones);

    const semiFromCurrent = (noteIndex(note) - noteIndex(currentChordRoot) + 12) % 12;
    const semiFromNext = (noteIndex(note) - noteIndex(nextChordRoot) + 12) % 12;

    mappings.push({
      note,
      intervalInCurrent: getIntervalFromRoot(currentChordRoot, note, currentChordIntervals),
      intervalInNext: getIntervalFromRoot(nextChordRoot, note, nextChordIntervals),
      isChordToneInCurrent: currentChordSemitones.has(semiFromCurrent),
      isChordToneInNext: nextChordSemitones.has(semiFromNext),
    });
  }

  return mappings;
}
