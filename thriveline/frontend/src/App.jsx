import { useState, useEffect } from 'react';
import './App.css';
import Chat from './pages/Chat';
import Community from './pages/Community';
import EmotionalTracker from './pages/EmotionalTracker';
import MoodModal from './components/MoodModal';
import { useAnonymousId } from './hooks/useAnonymousId';

const today = new Date().toISOString().split('T')[0];

export default function App() {
  const [tab, setTab] = useState('sage');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [todayMood, setTodayMood] = useState(null);
  const userId = useAnonymousId();

  useEffect(() => {
    const checkedIn = localStorage.getItem(`thriveline_checkin_${today}`);
    if (!checkedIn) {
      const t = setTimeout(() => setShowMoodModal(true), 600);
      return () => clearTimeout(t);
    } else {
      setTodayMood(checkedIn);
    }
  }, []);

  function handleCheckinDone(moodLabel) {
    localStorage.setItem(`thriveline_checkin_${today}`, moodLabel);
    setTodayMood(moodLabel);
    setShowMoodModal(false);
  }

  return (
    <div className="app">
      {showMoodModal && (
        <MoodModal
          userId={userId}
          onDone={handleCheckinDone}
          onSkip={() => setShowMoodModal(false)}
        />
      )}

      <div className="header">
        <div className="logo">Thrive<em>Line</em></div>
        <div className="tagline">Mental health support for job seekers</div>
      </div>

      <div className="tab-content">
        {tab === 'sage'      && <Chat userId={userId} mood={todayMood} />}
        {tab === 'community' && <Community userId={userId} />}
        {tab === 'tracker'   && <EmotionalTracker userId={userId} mood={todayMood} />}
      </div>

      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'sage' ? 'active' : ''}`} onClick={() => setTab('sage')}>
          <span className="nav-icon">🌿</span>
          <span className="nav-label">Sage AI</span>
        </button>
        <button className={`nav-item ${tab === 'community' ? 'active' : ''}`} onClick={() => setTab('community')}>
          <span className="nav-icon">🤝</span>
          <span className="nav-label">Community</span>
        </button>
        <button className={`nav-item ${tab === 'tracker' ? 'active' : ''}`} onClick={() => setTab('tracker')}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">My Wellbeing</span>
        </button>
      </nav>
    </div>
  );
}
