import { useState, useEffect, useRef } from 'react';

const PHASES = [
  { label: 'Breathe In', duration: 4, scale: 1.25 },
  { label: 'Hold', duration: 4, scale: 1.25 },
  { label: 'Breathe Out', duration: 4, scale: 1.0 },
  { label: 'Hold', duration: 4, scale: 1.0 },
];

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '24px 20px',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 14, fontWeight: 600,
    color: 'var(--text)', marginBottom: 4,
  },
  subtitle: {
    fontSize: 12, color: 'var(--text-muted)',
    marginBottom: 24,
  },
  circleWrap: {
    position: 'relative',
    width: 120, height: 120,
    margin: '0 auto 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  circleOuter: (scale, active) => ({
    position: 'absolute',
    width: '100%', height: '100%',
    borderRadius: '50%',
    background: 'rgba(122,158,126,0.12)',
    border: '2px solid rgba(122,158,126,0.3)',
    transform: `scale(${scale})`,
    transition: active ? 'transform 1s ease-in-out' : 'none',
  }),
  circleInner: {
    position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
  },
  countdown: {
    fontSize: 28, fontWeight: 600,
    color: 'var(--sage)',
    lineHeight: 1,
  },
  phaseLabel: {
    fontSize: 11, color: 'var(--sage-light)',
    marginTop: 2,
  },
  idleText: {
    fontSize: 13, color: 'var(--text-muted)',
  },
  startBtn: (active) => ({
    padding: '10px 28px',
    borderRadius: 20,
    background: active ? 'rgba(122,158,126,0.15)' : 'rgba(122,158,126,0.2)',
    border: `1px solid ${active ? 'rgba(122,158,126,0.4)' : 'rgba(122,158,126,0.5)'}`,
    color: 'var(--sage)',
    fontSize: 14, fontFamily: 'inherit',
    cursor: 'pointer',
    marginBottom: 10,
  }),
  cyclesText: {
    fontSize: 12, color: 'var(--text-dim)',
    marginTop: 8,
  },
};

export default function BreathingTimer() {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    let phase = phaseIdx;
    let count = PHASES[phase].duration;
    setCountdown(count);

    intervalRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        phase = (phase + 1) % PHASES.length;
        if (phase === 0) setCycles(c => c + 1);
        setPhaseIdx(phase);
        count = PHASES[phase].duration;
      }
      setCountdown(count);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, phaseIdx]);

  function toggle() {
    if (active) {
      clearInterval(intervalRef.current);
      setActive(false);
      setPhaseIdx(0);
      setCountdown(4);
    } else {
      setPhaseIdx(0);
      setCountdown(4);
      setActive(true);
    }
  }

  const currentPhase = PHASES[phaseIdx];

  return (
    <div style={styles.card}>
      <div style={styles.title}>Box Breathing</div>
      <div style={styles.subtitle}>4-4-4-4 · Clinically supported for acute anxiety</div>

      <div style={styles.circleWrap}>
        <div style={styles.circleOuter(active ? currentPhase.scale : 1.0, active)} />
        <div style={styles.circleInner}>
          {active ? (
            <>
              <span style={styles.countdown}>{countdown}</span>
              <span style={styles.phaseLabel}>{currentPhase.label}</span>
            </>
          ) : (
            <span style={styles.idleText}>Ready</span>
          )}
        </div>
      </div>

      <button style={styles.startBtn(active)} onClick={toggle}>
        {active ? 'Stop' : 'Begin'}
      </button>

      {cycles > 0 && (
        <div style={styles.cyclesText}>
          {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
        </div>
      )}
    </div>
  );
}
