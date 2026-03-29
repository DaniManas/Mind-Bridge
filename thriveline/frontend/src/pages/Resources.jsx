import AffirmationHero from '../components/AffirmationHero';
import BreathingTimer from '../components/BreathingTimer';

const RESOURCE_CARDS = [
  {
    id: 'rejection-fatigue',
    title: 'Understanding Rejection Fatigue',
    desc: "After enough rejections, the brain treats each new application as a threat. This isn't a character flaw — it's neurological. It has a name.",
    category: 'psychoeducation',
    icon: '🧠',
  },
  {
    id: 'imposter-syndrome',
    title: 'Imposter Syndrome: It Has a Name',
    desc: "Coined by psychologists in 1978. The feeling of being a fraud despite evidence of competence. Extremely common in job seekers. Naming it makes it smaller.",
    category: 'psychoeducation',
    icon: '🪞',
  },
  {
    id: 'job-search-burnout',
    title: 'Job Search Burnout',
    desc: "Burnout is a physiological state, not a motivation problem. Recognising where you are in the stages is the first step to getting through it.",
    category: 'psychoeducation',
    icon: '🌊',
  },
  {
    id: 'grounding',
    title: 'Grounding for Interview Anxiety',
    desc: "The 5-4-3-2-1 technique. Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Interrupts the spiral in under 2 minutes.",
    category: 'coping',
    icon: '🌿',
  },
  {
    id: 'routine',
    title: 'Building Routine Without Structure',
    desc: "The job search strips away the structure that work provided. Small rituals — even tiny ones — carry more psychological weight than you'd expect.",
    category: 'practical',
    icon: '🕯️',
  },
  {
    id: 'identity-erosion',
    title: 'Identity After a Long-Tenure Layoff',
    desc: "When you've been somewhere 10+ years, leaving isn't just a job change. It's a grief process. Treating it that way isn't weakness — it's accuracy.",
    category: 'psychoeducation',
    icon: '🌱',
  },
  {
    id: 'visa-timeline',
    title: 'Searching on a Visa Timeline',
    desc: "The OPT/H-1B search is categorically different. Every rejection isn't just a no — it's a tick on a countdown. Others on this path share what helped.",
    category: 'practical',
    icon: '⏳',
  },
  {
    id: 'success-stories',
    title: 'Stories from People Who Made It',
    desc: "Anonymous accounts from community members who came out the other side. Not highlight reels — honest accounts of what the search was actually like.",
    category: 'hope',
    icon: '✨',
  },
];

const CRISIS_LINES = [
  { name: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988 · 24/7 · Free', color: 'var(--crisis)' },
  { name: 'Crisis Text Line', detail: 'Text HOME to 741741 · Any crisis', color: 'var(--amber)' },
  { name: 'SAMHSA Helpline', detail: '1-800-662-4357 · Mental health referrals', color: 'var(--sage)' },
];

const CATEGORY_COLORS = {
  psychoeducation: '122,158,126',
  coping: '212,165,116',
  practical: '180,160,200',
  hope: '212,165,116',
};

const styles = {
  page: { padding: '20px 16px 32px' },
  sectionTitle: {
    fontSize: 13, fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
    marginTop: 8,
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 10, marginBottom: 24,
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12, padding: '14px 12px',
    cursor: 'default',
    transition: 'border-color 0.2s',
  },
  cardIcon: { fontSize: 18, marginBottom: 6 },
  cardTitle: { fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 },
  cardDesc: { fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.55 },
  catTag: (c) => ({
    display: 'inline-block',
    padding: '2px 8px', borderRadius: 20,
    fontSize: 10, marginTop: 8,
    background: `rgba(${CATEGORY_COLORS[c] || '212,165,116'}, 0.1)`,
    color: `rgba(${CATEGORY_COLORS[c] || '212,165,116'}, 0.9)`,
    border: `1px solid rgba(${CATEGORY_COLORS[c] || '212,165,116'}, 0.2)`,
    letterSpacing: 0.3,
  }),
  crisisSection: {
    background: 'rgba(192,80,74,0.06)',
    border: '1px solid rgba(192,80,74,0.2)',
    borderRadius: 14, padding: '16px',
    marginTop: 8,
  },
  crisisTitle: {
    fontSize: 11, color: 'var(--crisis)',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 12,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  crisisItem: {
    marginBottom: 10, paddingBottom: 10,
    borderBottom: '1px solid rgba(192,80,74,0.1)',
  },
  crisisName: { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  crisisDetail: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
};

export default function Resources({ mood }) {
  return (
    <div style={styles.page}>
      <AffirmationHero mood={mood} />
      <BreathingTimer />

      <div style={styles.sectionTitle}>Learn & Understand</div>
      <div style={styles.grid}>
        {RESOURCE_CARDS.map(r => (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardIcon}>{r.icon}</div>
            <div style={styles.cardTitle}>{r.title}</div>
            <div style={styles.cardDesc}>{r.desc}</div>
            <span style={styles.catTag(r.category)}>{r.category}</span>
          </div>
        ))}
      </div>

      <div style={styles.crisisSection}>
        <div style={styles.crisisTitle}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Crisis Support · Always Here
        </div>
        {CRISIS_LINES.map((c, i) => (
          <div key={c.name} style={{ ...styles.crisisItem, borderBottom: i === CRISIS_LINES.length - 1 ? 'none' : undefined, marginBottom: i === CRISIS_LINES.length - 1 ? 0 : undefined }}>
            <div style={styles.crisisName}>{c.name}</div>
            <div style={styles.crisisDetail}>{c.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
