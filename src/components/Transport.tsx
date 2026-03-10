import type { MetronomeState } from '../hooks/useMetronome';

interface TransportProps {
  metro: MetronomeState;
}

export default function Transport({ metro }: TransportProps) {
  return (
    <div className="transport">
      <button
        className={`transport-play ${metro.isPlaying ? 'playing' : ''}`}
        onClick={metro.handlePlay}
        title="Space to play/stop"
      >
        {metro.isPlaying ? 'Stop' : 'Play'}
      </button>

      <div className="transport-bpm">
        <button className="bpm-btn" onClick={() => metro.handleBpmChange(-5)}>-</button>
        <div className="bpm-display">
          <input
            type="number"
            className="bpm-input"
            value={metro.bpm}
            min={30}
            max={300}
            onChange={(e) => metro.setBpm(Math.max(30, Math.min(300, Number(e.target.value) || 80)))}
          />
          <span className="bpm-label">BPM</span>
        </div>
        <button className="bpm-btn" onClick={() => metro.handleBpmChange(5)}>+</button>
      </div>

      <div className="transport-beats">
        <select
          className="beats-select"
          value={metro.beatsPerBar}
          onChange={(e) => metro.setBeatsPerBar(Number(e.target.value))}
        >
          <option value={3}>3/4</option>
          <option value={4}>4/4</option>
          <option value={6}>6/8</option>
        </select>
      </div>

      {metro.isPlaying && (
        <div className="transport-indicator">
          <span className="bar-display">Bar {metro.currentBar + 1}</span>
          <div className="beat-dots">
            {Array.from({ length: metro.beatsPerBar }, (_, i) => (
              <span
                key={i}
                className={`beat-dot ${i === metro.currentBeat ? 'beat-dot-active' : ''} ${i === 0 && i === metro.currentBeat ? 'beat-dot-downbeat' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      <span className="transport-hint">Space to play/stop</span>
    </div>
  );
}
