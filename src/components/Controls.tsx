import {
  NOTES,
  SCALES,
  PROGRESSIONS,
  type NoteName,
  type ScaleDefinition,
  type Progression,
} from '../lib/music';

interface ControlsProps {
  keyRoot: NoteName;
  setKeyRoot: (n: NoteName) => void;
  selectedScale: ScaleDefinition;
  setSelectedScale: (s: ScaleDefinition) => void;
  selectedProgression: Progression;
  setSelectedProgression: (p: Progression) => void;
  labelMode: 'chordInterval' | 'keyInterval' | 'noteName';
  setLabelMode: (m: 'chordInterval' | 'keyInterval' | 'noteName') => void;
  showNextChord: boolean;
  setShowNextChord: (v: boolean) => void;
}

export default function Controls({
  keyRoot,
  setKeyRoot,
  selectedScale,
  setSelectedScale,
  selectedProgression,
  setSelectedProgression,
  labelMode,
  setLabelMode,
  showNextChord,
  setShowNextChord,
}: ControlsProps) {
  return (
    <div className="controls">
      {/* Key root selector */}
      <div className="control-group">
        <label className="control-label">Key</label>
        <div className="note-grid">
          {NOTES.map((note) => (
            <button
              key={note}
              className={`note-btn ${keyRoot === note ? 'active' : ''}`}
              onClick={() => setKeyRoot(note)}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Progression selector */}
      <div className="control-group">
        <label className="control-label">Progression</label>
        <select
          className="control-select"
          value={selectedProgression.name}
          onChange={(e) => {
            const prog = PROGRESSIONS.find((p) => p.name === e.target.value);
            if (prog) setSelectedProgression(prog);
          }}
        >
          {PROGRESSIONS.map((prog) => (
            <option key={prog.name} value={prog.name}>
              {prog.name}
            </option>
          ))}
        </select>
      </div>

      {/* Scale selector */}
      <div className="control-group">
        <label className="control-label">Scale</label>
        <select
          className="control-select"
          value={selectedScale.name}
          onChange={(e) => {
            const scale = SCALES.find((s) => s.name === e.target.value);
            if (scale) setSelectedScale(scale);
          }}
        >
          {SCALES.map((scale) => (
            <option key={scale.name} value={scale.name}>
              {scale.name}
            </option>
          ))}
        </select>
      </div>

      {/* Label mode */}
      <div className="control-group">
        <label className="control-label">Labels</label>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${labelMode === 'chordInterval' ? 'active' : ''}`}
            onClick={() => setLabelMode('chordInterval')}
            title="Intervals relative to the current chord root"
          >
            vs Chord
          </button>
          <button
            className={`toggle-btn ${labelMode === 'keyInterval' ? 'active' : ''}`}
            onClick={() => setLabelMode('keyInterval')}
            title="Intervals relative to the key root"
          >
            vs Key
          </button>
          <button
            className={`toggle-btn ${labelMode === 'noteName' ? 'active' : ''}`}
            onClick={() => setLabelMode('noteName')}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Next chord overlay toggle */}
      <div className="control-group">
        <label className="control-label">Next Chord</label>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${showNextChord ? 'active' : ''}`}
            onClick={() => setShowNextChord(true)}
          >
            Show
          </button>
          <button
            className={`toggle-btn ${!showNextChord ? 'active' : ''}`}
            onClick={() => setShowNextChord(false)}
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
