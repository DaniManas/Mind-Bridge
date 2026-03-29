"""
One-time script to populate the ChromaDB knowledge base for ThriveLine.
Run with: python seed_chroma.py
"""
import chromadb
import os

CHROMA_PATH = os.path.join(os.path.dirname(__file__), "chroma_data")

CBT_STRATEGIES = [
    {
        "id": "cbt-reframing-rejection",
        "title": "Cognitive reframing for rejection",
        "content": "When a job application gets rejected, the mind often jumps to 'something is wrong with me.' This is a cognitive distortion — a pattern the brain falls into under stress. The rejection is almost always about fit, timing, or factors entirely outside your control. A company that turned you down today might have hired you last year or next year with different needs. Reframing means gently asking: 'Is there another way to see this?' The rejection is data, not verdict.",
    },
    {
        "id": "cbt-thought-record",
        "title": "Thought record technique",
        "content": "When an automatic thought spirals — 'I'll never find anything,' 'I'm the problem' — the thought record technique helps slow it down. Notice the situation. Write the automatic thought. Identify the emotion it creates. Then ask: what evidence supports this thought? What evidence goes against it? What would a balanced view look like? The goal isn't forced positivity. It's accuracy. Often the balanced thought is: 'I'm struggling, AND I have done hard things before.'",
    },
    {
        "id": "cbt-behavioral-activation",
        "title": "Behavioral activation",
        "content": "Depression and prolonged job searching share a pattern: you stop doing things that once brought meaning, which reduces positive experiences, which deepens the low mood, which makes you do even less. Behavioral activation breaks this cycle — but not with a big push. The smallest possible action counts. Sending one email. Updating one line on your resume. Taking a ten-minute walk. Momentum builds from micro-actions. The brain doesn't require a full effort to start recovering — it just requires motion.",
    },
    {
        "id": "cbt-grounding-54321",
        "title": "Grounding technique — 5-4-3-2-1",
        "content": "When anxiety takes over — before an interview, after a rejection, at 2am — the 5-4-3-2-1 technique anchors you to the present. Name 5 things you can see right now. 4 things you can physically feel. 3 things you can hear. 2 things you can smell. 1 thing you can taste. This technique works by interrupting the anxious thought loop and redirecting attention to immediate sensory reality. It doesn't solve the problem. It pauses the spiral so you can think more clearly.",
    },
    {
        "id": "cbt-box-breathing",
        "title": "Box breathing for acute anxiety",
        "content": "Box breathing is a technique used by military personnel and first responders to manage acute stress. Breathe in for 4 counts. Hold for 4. Breathe out for 4. Hold for 4. Repeat 4 cycles. It works by activating the parasympathetic nervous system — the body's 'rest and digest' mode — and counteracting the cortisol spike of anxiety. It's particularly useful before interviews, when receiving rejection emails, or when lying awake at night. The effect is physiological, not psychological — it works even when you don't believe it will.",
    },
    {
        "id": "cbt-emotion-naming",
        "title": "Emotion naming and labeling",
        "content": "Research by UCLA psychologist Matthew Lieberman found that naming an emotion reduces its intensity in the brain — specifically reducing activity in the amygdala, the fear center. When someone says 'I don't even know what I'm feeling, it's just this heavy dread,' the most helpful response isn't advice. It's helping them name it: 'It sounds like what you're carrying might be a kind of grief — not just disappointment, but something heavier. Does that fit?' A named emotion is smaller than an unnamed one.",
    },
    {
        "id": "cbt-cognitive-defusion",
        "title": "Cognitive defusion — creating distance from thoughts",
        "content": "Cognitive defusion is an ACT (Acceptance and Commitment Therapy) technique for creating distance from painful thoughts. Instead of 'I am unemployable,' the defused version is: 'I'm having the thought that I'm unemployable.' The thought doesn't change. But the relationship to it does — you become someone observing the thought rather than someone trapped inside it. This technique is especially useful with the stuck, repeating thoughts that job searching tends to produce: 'I should be further along.' 'Something is wrong with me.' You don't have to believe everything your mind tells you.",
    },
    {
        "id": "cbt-values-clarification",
        "title": "Values clarification",
        "content": "When the job search feels meaningless — 'why am I even doing this' — values clarification helps reconnect action to purpose. What do you actually value? Not what looks good on paper. Security? Creative challenge? Impact? Belonging? Financial stability for people you love? The job search serves those values, even when it doesn't feel like it. Clarifying what you're searching for beyond a paycheck creates a different relationship with the process. You're not just looking for a job. You're looking for a way to live that matches what matters to you.",
    },
    {
        "id": "cbt-self-compassion",
        "title": "Self-compassion practice",
        "content": "Kristin Neff's self-compassion research shows that self-compassion — not self-esteem — is what protects against depression under failure conditions. The practice is simple: treat yourself as you would treat a friend in the same situation. If a close friend said 'I've had 80 rejections and I think something is wrong with me,' what would you say to them? You would likely say something kind, honest, and realistic. You would not pile on. You would not dismiss it. Apply that same voice to yourself. The harshest inner critic is usually the least accurate one.",
    },
    {
        "id": "cbt-worry-time",
        "title": "Worry time technique",
        "content": "All-day background worry about job searching is exhausting and unproductive. The worry time technique involves scheduling a specific 15-minute window each day for worrying — say, 5pm. When a worry arises outside that window, you note it ('I'll think about that at 5') and return to what you were doing. This reduces cognitive load throughout the day. When 5pm arrives, you sit with the worries intentionally. Often they feel smaller then. This technique requires practice but is clinically supported for generalized anxiety.",
    },
    {
        "id": "cbt-coping-statements",
        "title": "Coping statements and anchoring",
        "content": "Coping statements are not affirmations. They are honest, evidence-based anchors used during hard moments. 'I have survived hard things before.' 'This feeling is temporary, even if it doesn't feel like it.' 'I am more than my employment status.' 'I am still the person I was before this happened.' The difference from toxic positivity is that these don't deny the difficulty — they hold it alongside something equally true. The goal is to keep the hard thing from being the only thing.",
    },
    {
        "id": "cbt-mindful-acceptance",
        "title": "Mindful acceptance of difficult days",
        "content": "Some days are just bad. Fighting a bad day — trying to think your way out of it, pushing through, forcing productivity — often makes it worse. Mindful acceptance means acknowledging: 'Today is hard, and that's okay.' Not as defeat. As skill. The day is allowed to be what it is. You are allowed to feel what you feel. Acceptance doesn't mean approval. It means stopping the second layer of suffering — the self-judgment on top of the original pain.",
    },
    {
        "id": "cbt-social-withdrawal",
        "title": "Recognizing social withdrawal patterns",
        "content": "One of the quieter effects of job searching is social withdrawal — seeing fewer people, avoiding questions about 'what are you up to', turning down invitations because you'd have to explain. This is very common. It's not anti-social behavior. It's self-protection from a question that feels like exposure. Recognizing the pattern is the first step. You don't have to explain yourself to reconnect with people you care about. 'I'd love to see you — I'm going through a hard stretch, don't want to talk about it, just want to be around you.' That's a complete sentence.",
    },
    {
        "id": "cbt-sleep-hygiene",
        "title": "Sleep hygiene for job search anxiety",
        "content": "Racing thoughts at 2am are extremely common during job searching. The mind, deprived of the structure and feedback that work provides, fills the quiet with anxiety. Evidence-based sleep hygiene for this situation: write down all pending worries before bed to offload them from active memory; stop looking at applications after 8pm; keep a consistent wake time even without a job to preserve circadian rhythm; if you wake up anxious, get up and write for 10 minutes rather than lying in the anxiety. The bed becomes associated with wakefulness if you spend hours in it anxious — protect the association.",
    },
    {
        "id": "cbt-exposure-interview",
        "title": "Interview anxiety as performance anxiety",
        "content": "Interview anxiety and stage fright share the same physiological mechanism. Elevated cortisol, adrenaline, reduced prefrontal cortex activity — the brain interprets the high-stakes social evaluation as a threat. A useful reframe: the physiological arousal of anxiety and the physiological arousal of excitement are nearly identical. The difference is the story you tell about it. 'I'm so nervous' and 'I'm so ready' produce similar heart rates. Research by Alison Wood Brooks shows that reframing anxiety as excitement — rather than trying to calm down — improves performance in high-stakes situations.",
    },
    {
        "id": "cbt-future-self",
        "title": "Future self visualization",
        "content": "When the present feels stuck, a future self visualization creates a bridge. Imagine yourself 6 months from now — employed, stable, looking back at this period. What would that person say to you today? What do they know that you don't yet? Often the answer is something like: 'This wasn't the end. You kept going even when you didn't know why.' Future self visualization isn't wishful thinking — it's a way of accessing the perspective you'll eventually have, before you've earned it through time.",
    },
    {
        "id": "cbt-boundaries-rest",
        "title": "Boundaries and rest during job searching",
        "content": "Job searching is a marathon, not a sprint. Treating every waking hour as job search time leads to burnout, not success. Setting boundaries is not laziness — it's pacing. It's okay to not check email after 6pm. It's okay to take a full day off from applications each week. It's okay to stop after sending 5 applications instead of 15. The research on productive work time shows diminishing returns after focused effort. Rest is not the absence of work. It's the part of the cycle that makes the work sustainable.",
    },
    {
        "id": "cbt-decision-fatigue",
        "title": "Managing decision fatigue in job searching",
        "content": "Job searching involves hundreds of micro-decisions daily: which jobs to apply to, how to tailor each resume, whether to follow up, what to say in a cover letter. Decision fatigue is the deterioration of decision quality after sustained decision-making. To manage it: batch similar tasks (all resume tailoring in one block), create templates and use them, set a specific number of applications per day rather than 'as many as possible,' and make the most important decisions earlier in the day when cognitive reserves are highest.",
    },
    {
        "id": "cbt-rejection-desensitization",
        "title": "Rejection desensitization and emotional exhaustion",
        "content": "After many rejections, each one tends to hurt less — but this isn't only because you've gotten stronger. Sometimes it's because you've become emotionally exhausted. If you notice you feel almost nothing after a rejection, that's worth paying attention to. Emotional numbness is a sign of burnout, not resilience. The difference matters: resilience bounces back. Numbness doesn't register. If rejections stopped hurting entirely, it may be time to step back, not push forward harder.",
    },
    {
        "id": "cbt-gratitude-micro",
        "title": "Gratitude without toxic positivity",
        "content": "Gratitude practices have strong research support — but the version that asks you to be grateful for big things when you're struggling can feel like a cruel joke. A more honest version: micro-observations. Not 'I'm grateful for my health' but 'the coffee this morning was actually good.' Not 'things could be worse' but 'that conversation with my friend was real for about 20 minutes.' Small genuine observations of moments that weren't terrible. The brain doesn't need a lot to start shifting — just something true and small.",
    },
]

PSYCHOEDUCATION = [
    {
        "id": "psycho-rejection-fatigue",
        "title": "Rejection fatigue",
        "content": "Rejection fatigue is a recognized phenomenon in the psychology of job searching. After repeated rejection — particularly when the feedback is absent or generic — the brain starts to treat each new application as a threat rather than an opportunity. The anticipatory dread of another rejection becomes more powerful than the hope of a positive outcome. This is neurological, not a character flaw. The brain is doing what it was designed to do: protect you from repeated painful stimuli. Knowing this is rejection fatigue — that it has a name and a mechanism — is the first step to working with it rather than fighting it.",
    },
    {
        "id": "psycho-imposter-syndrome",
        "title": "Imposter syndrome",
        "content": "Imposter syndrome was coined by psychologists Pauline Clance and Suzanne Imes in 1978. It describes the persistent feeling of being a fraud despite evidence of competence — the sense that at any moment, someone will figure out you don't belong. It's extremely common in high-achievers and particularly acute during job searching, when your professional identity is already under scrutiny. Having a name for it makes it smaller. 'I'm having imposter syndrome right now' is a complete diagnosis. You don't need to fix it — you need to recognize when it's speaking instead of reality.",
    },
    {
        "id": "psycho-job-search-depression",
        "title": "Job search depression",
        "content": "Job search depression is distinct from clinical depression but shares its symptoms: loss of motivation, disrupted sleep, social withdrawal, difficulty concentrating, loss of pleasure in activities you used to enjoy. The job search itself is the trigger — the constant rejection, the loss of structure, the identity disruption, the financial uncertainty. It's situational, and it's real. It doesn't mean you have a clinical disorder. It means the situation is genuinely hard, your brain is responding appropriately, and you need support — not just better interview prep.",
    },
    {
        "id": "psycho-burnout-stages",
        "title": "Burnout stages",
        "content": "Burnout is a real physiological state, not a motivation problem. Freudenberger's model describes 12 stages: compulsion to prove oneself → working harder → neglecting needs → displacement of conflict onto others → revision of values (work above all) → denial of problems → withdrawal from social contact → behavioral changes (irritability, detachment) → depersonalization → inner emptiness → depression → burnout syndrome. Job searchers commonly hit stages 5-8 without recognizing it. Knowing the stages means recognizing where you are — and knowing that you can come back from any point if you stop and get support.",
    },
    {
        "id": "psycho-identity-erosion",
        "title": "Identity erosion after job loss",
        "content": "For many people — especially mid-career professionals, those from cultures where professional success carries family honor, and those who've spent years building a career identity — job loss isn't just losing a paycheck. It's losing a piece of who you are. 'What do you do?' is a question that cuts differently when the answer is 'I'm looking.' Identity erosion is the gradual hollowing out of self-concept that happens when a major identity anchor disappears. Recognizing it as a grief process — not a failure — changes how you relate to the recovery.",
    },
    {
        "id": "psycho-learned-helplessness",
        "title": "Learned helplessness",
        "content": "Martin Seligman's research on learned helplessness showed that after enough uncontrollable negative outcomes, animals and people stop trying — even when escape becomes possible. After dozens of rejections with no feedback, the brain learns a rule: 'Effort doesn't change outcome.' You stop applying — not because you're lazy, but because your brain is protecting you from more pain that feels inevitable. This is reversible. But it requires understanding that the withdrawal is a learned response, not a character trait. The belief 'nothing I do matters' is a product of the pattern, not a truth about you.",
    },
    {
        "id": "psycho-comparison-trap",
        "title": "Comparison trap and social media distortion",
        "content": "LinkedIn is a highlight reel. Every 'Excited to announce' post shows you someone else's outcome with none of their struggle — the months of searching, the rejections, the doubt they had before the offer came. You are comparing your behind-the-scenes to everyone else's premiere. The comparison isn't real, and it isn't fair. Social media platforms algorithmically amplify success announcements because they generate engagement. Your silence is statistically normal. Their announcement is selected for visibility. These are not comparable data points.",
    },
    {
        "id": "psycho-financial-cognitive-load",
        "title": "Financial anxiety and cognitive load",
        "content": "Sendhil Mullainathan and Eldar Shafir's research on scarcity showed that financial worry doesn't just feel bad — it actively reduces cognitive bandwidth. The mind running 'what if I can't pay rent' in the background has fewer resources available for everything else: problem-solving, emotional regulation, creativity, focus. You're not getting dumber or less capable. You're carrying more cognitive weight than most people can see. Acknowledging the cognitive load of financial stress is not an excuse — it's an accurate assessment of the conditions you're working under.",
    },
    {
        "id": "psycho-grief-of-career",
        "title": "Grief of professional identity loss",
        "content": "Losing a job you've held for years — especially one that shaped your identity, your relationships, your daily structure — involves real grief. Elizabeth Kübler-Ross's stages (denial, anger, bargaining, depression, acceptance) apply here. You might deny the severity at first, then feel rage at the unfairness, then bargain ('if I apply to 20 jobs a day'), then fall into depression when nothing works, and finally — gradually — accept the transition and build forward. None of these stages have a timeline. And they don't happen in order. Grief isn't a straight line.",
    },
    {
        "id": "psycho-visa-anxiety",
        "title": "Visa anxiety and compounded stress",
        "content": "For international workers on OPT, H-1B, or other visa timelines, job search stress is categorically different. Every rejection isn't just a 'no' — it's a tick on a countdown. The stakes aren't limited to career; they include whether you can stay in the country you've built a life in, whether you'll have to leave without telling people why, whether you'll disappoint parents who sacrificed for your education abroad. This compounded stress — financial + career + immigration + family expectations + deadline — is a fundamentally heavier burden than most advice acknowledges. It deserves to be named, not subsumed into generic 'uncertainty.'",
    },
    {
        "id": "psycho-gap-shame-spiral",
        "title": "The gap shame spiral",
        "content": "The longer the employment gap, the harder it becomes to explain. The harder the explanation, the more shame builds. The more shame, the more avoidance — of networking, of applications, of conversations. The more avoidance, the longer the gap grows. This is the gap shame spiral. It feeds itself. Breaking it doesn't require a perfect explanation of the gap — it requires one action that interrupts the avoidance. One email sent. One conversation had. The spiral can be broken at any point, but only by moving through the discomfort rather than around it.",
    },
    {
        "id": "psycho-emotional-labor",
        "title": "Emotional labor of performing 'fine'",
        "content": "Job seekers perform wellness for everyone around them — family, friends, former colleagues, networking contacts — while carrying the actual weight internally. This is called emotional labor: the management of feelings to create a publicly acceptable emotional display. Performing 'fine' for six months while not being fine is exhausting in a way that's invisible to everyone watching. The gap between the performed self and the actual self widens over time. ThriveLine is designed to be the place where you don't have to perform. You can be where you actually are.",
    },
    {
        "id": "psycho-mid-career-layoff",
        "title": "Mid-career layoff after long tenure",
        "content": "Being laid off after 10 or more years is a different experience from a short-tenure exit. The identity hit is deeper. The network may be older and less agile. The market may have shifted toward skills that didn't exist when you last interviewed. The shame of 'explaining the gap' is heavier when you've been a leader. There's also a specific grief that comes from losing the place where you became who you professionally are — the team, the institutional knowledge, the role that shaped your career identity. This is not the same as a setback in the early career. It's more like starting again while carrying more weight.",
    },
    {
        "id": "psycho-interview-anxiety-physiology",
        "title": "Interview anxiety physiology",
        "content": "Interview anxiety has a physiological basis that's worth understanding. In a high-stakes social evaluation, the brain activates the stress response: cortisol and adrenaline rise, the amygdala becomes more active, the prefrontal cortex (responsible for articulate thought) becomes less active. This is why people blank on questions they know the answer to, stumble over words they normally speak fluently, and feel like a different person than they are in relaxed contexts. Understanding this isn't just reassuring — it allows for targeted preparation. The goal isn't to eliminate arousal but to channel it.",
    },
]

CRISIS_RESOURCES = [
    {
        "id": "crisis-988",
        "title": "988 Suicide & Crisis Lifeline",
        "content": "Call or text 988, available 24/7, free and confidential. Trained counselors are available for anyone in emotional distress or suicidal crisis. Available in English and Spanish. You don't have to be in immediate danger to call — feeling like you're at the end of your rope is enough. The line is for crisis, and a job search crisis is a crisis.",
    },
    {
        "id": "crisis-text-line",
        "title": "Crisis Text Line",
        "content": "Text HOME to 741741. Free, 24/7 crisis support via text. Especially useful when calling feels too hard or too public. Trained crisis counselors respond within minutes. Text-based support is equally effective as phone-based for many people, and the barrier to entry is lower.",
    },
    {
        "id": "crisis-samhsa",
        "title": "SAMHSA National Helpline",
        "content": "Call 1-800-662-4357, free and confidential, 24/7. The Substance Abuse and Mental Health Services Administration helpline provides referrals and information for mental health and substance use issues. Available in English and Spanish. Can help find local treatment and support options.",
    },
    {
        "id": "crisis-nami",
        "title": "NAMI Helpline",
        "content": "Call 1-800-950-NAMI (6264), Monday through Friday 10am to 10pm ET. The National Alliance on Mental Illness helpline provides mental health information, resource referrals, and support for people experiencing mental health challenges. Also has a crisis text line: text NAMI to 741741.",
    },
    {
        "id": "crisis-international",
        "title": "International crisis resources",
        "content": "For international users, the International Association for Suicide Prevention maintains a directory of crisis centers worldwide. Many countries have local equivalents to 988. If you are in the US on a visa, all US crisis resources are available to you regardless of immigration status. Crisis counselors are not immigration enforcement.",
    },
    {
        "id": "crisis-finding-therapist",
        "title": "Finding a therapist",
        "content": "Psychology Today's therapist finder (psychologytoday.com/us/therapists) lets you filter by insurance, specialty, and cost. Open Path Collective offers affordable therapy at $30-$80 per session for people with financial hardship. Many therapists offer sliding scale fees — it's always worth asking directly. University counseling centers often have community slots. Telehealth has made access significantly wider — many therapists see clients across state lines.",
    },
    {
        "id": "crisis-when-to-seek-help",
        "title": "When to seek professional help",
        "content": "Signs that you need more support than self-help or peer support can provide: feeling hopeless most days for two or more weeks, inability to get out of bed or complete basic daily tasks, stopped eating or significantly overeating, using alcohol or substances to get through the day, having thoughts of self-harm or not wanting to be here anymore. These are signs your brain needs professional support — not because something is fundamentally wrong with you, but because you're carrying more than any person should carry alone.",
    },
    {
        "id": "crisis-eap",
        "title": "Employee Assistance Programs (EAP)",
        "content": "If you were recently laid off, check whether your former employer's Employee Assistance Program is still accessible. EAPs often provide 30-90 days of continued access post-termination, including free therapy sessions. This is a benefit many people don't know they can still use. Contact your former HR department or benefits administrator to check your status.",
    },
    {
        "id": "crisis-immigration-support",
        "title": "Immigration and crisis support",
        "content": "If visa stress is contributing to a crisis, there are resources specifically for this intersection. NILC (National Immigration Law Center) and local immigration legal aid societies can provide practical guidance. USCIS has information lines. International student offices at universities often have counselors familiar with visa anxiety. The crisis isn't only emotional — sometimes it needs practical intervention too, and getting the facts about your actual options can reduce the catastrophizing that uncertainty creates.",
    },
    {
        "id": "crisis-warmline",
        "title": "Mental health warmlines",
        "content": "Warmlines are non-crisis peer support lines — for when you're struggling but not in acute crisis. They're staffed by people with lived mental health experience. The National Warmline Directory (warmline.org) lists warmlines by state. These are lower-barrier options for when you want to talk to someone but don't feel like you're 'bad enough' for a crisis line. There is no threshold you have to cross to deserve support.",
    },
]


def seed_knowledge_base():
    client = chromadb.PersistentClient(path=CHROMA_PATH)

    # Delete and recreate to allow re-seeding
    for name in ["cbt_strategies", "psychoeducation", "crisis_resources"]:
        try:
            client.delete_collection(name)
        except Exception:
            pass

    cbt = client.create_collection("cbt_strategies")
    psycho = client.create_collection("psychoeducation")
    crisis = client.create_collection("crisis_resources")

    cbt.add(
        ids=[e["id"] for e in CBT_STRATEGIES],
        documents=[e["content"] for e in CBT_STRATEGIES],
        metadatas=[{"title": e["title"], "category": "cbt"} for e in CBT_STRATEGIES],
    )

    psycho.add(
        ids=[e["id"] for e in PSYCHOEDUCATION],
        documents=[e["content"] for e in PSYCHOEDUCATION],
        metadatas=[{"title": e["title"], "category": "psychoeducation"} for e in PSYCHOEDUCATION],
    )

    crisis.add(
        ids=[e["id"] for e in CRISIS_RESOURCES],
        documents=[e["content"] for e in CRISIS_RESOURCES],
        metadatas=[{"title": e["title"], "category": "crisis"} for e in CRISIS_RESOURCES],
    )

    print(f"✓ Seeded {cbt.count()} CBT strategies")
    print(f"✓ Seeded {psycho.count()} psychoeducation entries")
    print(f"✓ Seeded {crisis.count()} crisis resource entries")
    print("Knowledge base ready.")


if __name__ == "__main__":
    seed_knowledge_base()
