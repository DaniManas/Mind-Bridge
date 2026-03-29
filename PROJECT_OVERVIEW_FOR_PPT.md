# MindBridge (ThriveLine) — Project Overview for PPT

## 1. Project Snapshot
- **Project name:** MindBridge (also referenced as ThriveLine in some UI copy)
- **Category:** Mental health + peer support for job seekers
- **Core promise:** A calm, anonymous space for emotional support, practical coping tools, and community solidarity during job search stress
- **Target users:** Job seekers facing rejection, anxiety, burnout, uncertainty, and social isolation

## 2. Problem We Are Solving
Job seekers often face:
- Repeated rejection and ghosting
- Interview anxiety and emotional exhaustion
- Social isolation and comparison stress
- Lack of low-friction emotional support between applications

Most alternatives are either:
- Too generic (motivational but not specific)
- Too clinical (hard to engage daily)
- Too noisy (doom-scrolling, social pressure)

## 3. Solution
MindBridge combines 4 pillars in one experience:
1. **Sage AI companion** (emotion-aware, grounded tone)
2. **Anonymous community peer rooms** (solidarity without identity pressure)
3. **Wellbeing tracking + interactive micro-tools** (do-along exercises, not passive content)
4. **Private journal** (text/voice capture and reflection context)

## 4. Product Experience (End-to-End Flow)
1. **Landing / Intro**
- Character-led calming welcome
- Low-pressure entry CTA
- Crisis helpline visibility

2. **Onboarding**
- Captures emotional and situational context (struggles, duration, pressures, optional age)
- Validating microcopy
- Designed to reduce typing burden

3. **Sage AI Chat**
- Safe, supportive conversational UI
- Context-aware tone and memory-aware framing
- Crisis intercept patterns for sensitive signals

4. **Community**
- Weekly pulse + peer rooms
- Anonymous posting
- Tabbed support views:
  - Peer rooms
  - Professionals
  - Workshops

5. **Wellbeing**
- Daily check-ins and mood-related insight
- Micro-wins prioritization
- Interactive tools for immediate relief

6. **Journal**
- Private entries (text/voice)
- Progress memory for personal reflection and assistant context

## 5. Current UI/Feature Inventory (What is Visible)

### A) Landing + Onboarding
- Calm, minimal visual entry
- Character-first greeting style
- Onboarding steps with contextual validation

### B) Sage AI Screen
- Chat interface
- Voice input button
- Session history behavior
- Safety handling hooks

### C) Community Screen
- **Pulse card** at top
- **Tabs:** Peer rooms / Professionals / Workshops
- **Peer rooms** with room cards and online indicators
- Anonymous compose box
- Room-based chat entry
- **Professionals section:** profile cards + verified badge + direct external therapist-practice links
- **Workshops section:** TED/YouTube content cards with relevance filtering

### D) Wellbeing Screen
- Weekly insight
- Check-in and trend-like feedback
- Emotional labels
- Interactive tools:
  - Box breathing
  - 5-4-3-2-1 grounding
  - Rejection reframe cards
  - Evidence jar
  - Only 3 Things Today
- Crisis help overlay

### E) Journal Screen
- New entry compose
- Mood tagging
- Voice + text support
- Saved history list

## 6. Community Section: Recent Finalized Decisions
- Removed “Filter by situation” chip row from top-level community view
- Kept direct access to peer rooms
- Removed **Mentors** section entirely
- Professionals now open **direct therapist practice websites** (not broad directories)
- Workshops fetch TED/YouTube items and apply **mental-health relevance filtering**

## 7. Personalization Strategy
The app personalizes via:
- Onboarding context (struggles, search duration, pressures)
- Daily check-ins and emotional tags
- Journal content (private reflection context)
- Interaction patterns over time

This enables Sage to respond with higher empathy and better situational relevance.

## 8. Safety and Trust Layer
- Anonymous community posting
- Crisis support visibility (e.g., 988 / crisis text line references in UI)
- Clear “not therapy” boundaries in community contexts
- Emotional support without toxic positivity framing

## 9. Tech/Implementation Notes (High-Level)
- Single-page, screen-based frontend prototype in `mindbridge_final_ui.html`
- UI state managed client-side
- Local persistence for selected user state/history patterns
- External content ingestion (workshops) via feed parsing API + fallback curation

## 10. Differentiators (Pitch Slides)
- **Sanctuary UX** over productivity dashboard feel
- **Low-friction emotional support** for low-energy days
- **Interactive coping tools** instead of passive advice
- **Community pulse + rooms** that validate shared struggle
- **Practical bridge** between emotional care and job-search reality

## 11. Suggested PPT Structure
1. Title + one-line vision
2. Problem statement (why current tools fail)
3. User persona + emotional journey
4. Product overview (4 pillars)
5. End-to-end user flow
6. Key screens (Landing, Sage, Community, Wellbeing, Journal)
7. Feature deep dive (community + tools)
8. Safety and trust architecture
9. Differentiators vs alternatives
10. Demo script (90 seconds)
11. Current status + roadmap
12. Ask / next steps

## 12. 90-Second Demo Script (Speaker Notes)
- Open landing: “MindBridge is a calm support space for job seekers under emotional pressure.”
- Show onboarding: “We capture context with minimal friction.”
- Show Sage: “AI companion that responds with emotional nuance, not generic positivity.”
- Show community: “Anonymous peer rooms plus direct access to professional support and relevant workshops.”
- Show wellbeing tools: “Immediate do-along interventions for anxiety, rejection, and overwhelm.”
- Show journal: “Private reflection for pattern tracking and better personalization.”
- Close: “MindBridge helps users feel seen, steady, and capable between applications.”

## 13. Known Gaps / Next Build Priorities
- Production-grade backend integration for all dynamic feeds and profiles
- Structured analytics for retention and outcomes
- Deeper workshop source quality scoring
- Verified provider curation workflow
- Expanded safety escalation policies and moderation tooling

## 14. Team Handoff Notes
- Primary UI implementation file currently used in demo:
  - `thriveline/frontend/public/mindbridge_final_ui.html`
- This document is intended as the PPT source brief for design/content teams.
