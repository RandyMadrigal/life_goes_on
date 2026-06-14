import type { Mood } from "../interfaces/IUser";

export interface LetterSeed {
  mood: Mood;
  index: 0 | 1 | 2;
  body: string;
}

export const letters: LetterSeed[] = [
  // ── Lost ──────────────────────────────────────────────────────────
  {
    mood: "Lost",
    index: 0,
    body: `Being lost doesn't mean you're broken. It means you're between chapters. The story hasn't ended — it's just in that difficult part where the plot hasn't made sense yet. You don't need the answers right now. You don't need a destination tonight. You just need to keep breathing, keep existing, and trust that the path will become clearer. It always does. Not because life gets easier, but because you get stronger at navigating it. Even lost, you are still moving.\n\n— Life Goes On`,
  },
  {
    mood: "Lost",
    index: 1,
    body: `Feeling lost is the bravest thing you can feel. It means you've stopped pretending you know where you're going and started being honest. That honesty is the beginning of finding your way. Think of every time you've been lost before — in a city, in a decision, in yourself. You found your footing every time. Not because a map appeared, but because you kept walking. Tonight, that's enough. Just keep walking. The direction will come.\n\n— Life Goes On`,
  },
  {
    mood: "Lost",
    index: 2,
    body: `Something nobody tells you about being lost: it's often the universe making space for something better than what you planned. The version of life you had mapped out may have been too small for who you're becoming. Being lost isn't failure — it's recalibration. Give yourself permission to not know. The compass inside you hasn't stopped working. It's just finding a new north.\n\n— Life Goes On`,
  },

  // ── Motivated ─────────────────────────────────────────────────────
  {
    mood: "Motivated",
    index: 0,
    body: `That fire you feel right now — protect it. Not every day will feel like this, and that's okay. What matters is what you build on days like today. Use this energy not just to sprint, but to plant seeds that your future self will be grateful for. The motivated version of you is not a stranger — it's who you've always been underneath the exhaustion. Let it run.\n\n— Life Goes On`,
  },
  {
    mood: "Motivated",
    index: 1,
    body: `Today you have it. That thing — the clarity, the will, the energy to move. Remember this feeling on the days it goes quiet. Write down what it feels like. Write down what you want. Write down who you're becoming. Because future you will need a letter from today's you. You are, right now, exactly who you needed to become. Keep going.\n\n— Life Goes On`,
  },
  {
    mood: "Motivated",
    index: 2,
    body: `Motivation is rare. Don't waste it on busyness. Ask yourself: what matters most right now? What would change everything? Do that. Not the easy thing — the important thing. This energy is a gift. Spend it wisely, not quickly. The version of you that moves intentionally on days like this is unstoppable.\n\n— Life Goes On`,
  },

  // ── Broken ────────────────────────────────────────────────────────
  {
    mood: "Broken",
    index: 0,
    body: `Being broken isn't the end of your story. It's the part where you find out what you're actually made of. The cracks in you right now are letting the light in. Not metaphorically — literally. The places where you've hurt are the places where empathy lives, where wisdom lives, where the best of you is quietly being built. You don't have to be okay right now. You just have to still be here.\n\n— Life Goes On`,
  },
  {
    mood: "Broken",
    index: 1,
    body: `There's a kind of breaking that happens before becoming. You can't always tell which kind it is in the middle of it. But consider: what if this is the becoming kind? Not the destroying kind — the transforming kind. You've survived things before that felt unsurvivable. This will join that list. Not yet. But it will. Hold on.\n\n— Life Goes On`,
  },
  {
    mood: "Broken",
    index: 2,
    body: `Even broken things have value. A broken geode reveals what it's made of inside. A broken bone comes back stronger at the fracture. You are not less because you are broken right now. You are more honest, more human, more real than the polished version you show the world. That realness is where connection lives. That realness is what heals.\n\n— Life Goes On`,
  },

  // ── Hopeful ───────────────────────────────────────────────────────
  {
    mood: "Hopeful",
    index: 0,
    body: `Hold onto this. Hope is not naive — it's the most courageous thing a human can choose. You've seen hard things, and yet here you are, choosing to believe it gets better. That's not foolishness. That's strength. Let this feeling guide you today. Let it remind you that the future is not fixed — it's being written right now, partly by the hope you carry.\n\n— Life Goes On`,
  },
  {
    mood: "Hopeful",
    index: 1,
    body: `Something is shifting. You can feel it. That quiet knowing that things are moving in the right direction — trust it. Hope isn't about certainty; it's about direction. And right now, you're pointed somewhere worth going. Keep that. Protect it on the days it feels smaller. Today it's bright — let it light the way.\n\n— Life Goes On`,
  },
  {
    mood: "Hopeful",
    index: 2,
    body: `Hope is the thing that says maybe. Maybe it works out. Maybe things change. Maybe tomorrow is different. That maybe is everything. It keeps doors open that despair would close. You have it today — that open door. Walk toward it, even slowly. Even carefully. The other side is worth it.\n\n— Life Goes On`,
  },

  // ── Tired ─────────────────────────────────────────────────────────
  {
    mood: "Tired",
    index: 0,
    body: `You're allowed to be tired. Not as a failure — as evidence. Evidence that you've been showing up, carrying things, trying hard. Tired is what happens to people who care. Rest is not giving up. Rest is how you make the next stretch possible. Tonight, let yourself be tired. Tomorrow, let yourself begin again. That's enough. That's always been enough.\n\n— Life Goes On`,
  },
  {
    mood: "Tired",
    index: 1,
    body: `The weight you're carrying is real. I don't want to tell you to just push through. Sometimes the answer is to put some of it down, even temporarily. What can you let go of tonight, even just for tonight? Sleep is not surrender. Rest is not retreat. You've earned both.\n\n— Life Goes On`,
  },
  {
    mood: "Tired",
    index: 2,
    body: `Being tired doesn't mean you're weak. It means you've been strong for too long without stopping. The strongest people know when to rest. The wisest people know that recovery is part of the process, not a break from it. Take your rest. The work will be there. So will you — rested, and ready.\n\n— Life Goes On`,
  },

  // ── Disciplined ───────────────────────────────────────────────────
  {
    mood: "Disciplined",
    index: 0,
    body: `What you're building through discipline right now is invisible to most people. The early mornings, the choices that go unnoticed, the small consistency that adds up quietly — nobody sees it yet. But it's real. And one day, people will see the result and call it talent. You'll know it was discipline. Keep going.\n\n— Life Goes On`,
  },
  {
    mood: "Disciplined",
    index: 1,
    body: `Discipline is love in action — love for who you're becoming, love for the life you want. Every choice you make today in alignment with your values is a vote for that future. You don't need to feel motivated. You don't need to want to. You just need to begin. The feeling follows the action, not the other way around.\n\n— Life Goes On`,
  },
  {
    mood: "Disciplined",
    index: 2,
    body: `There will be days when discipline feels like resistance — like you're fighting yourself. Those are the most important days. Not because fighting yourself is good, but because it means you're choosing differently than your default. That gap between impulse and choice? That's where character lives. You're building yours right now.\n\n— Life Goes On`,
  },

  // ── Healing ───────────────────────────────────────────────────────
  {
    mood: "Healing",
    index: 0,
    body: `Healing is not a straight line and it is not a race. Some days you'll feel like you've gone backward — and sometimes you have, a little. That's not failure; that's how healing actually works. It's two steps forward, one step back, and eventually looking up to realize you're somewhere you couldn't see from where you started. You're in the middle of that journey. Keep going.\n\n— Life Goes On`,
  },
  {
    mood: "Healing",
    index: 1,
    body: `You may not feel healed yet. But you are different than you were — softer in some places, stronger in others, more awake to what matters. That's healing. Not the absence of pain, but the presence of growth alongside it. You're doing it, even on the days you don't feel it.\n\n— Life Goes On`,
  },
  {
    mood: "Healing",
    index: 2,
    body: `Healing asks for patience from someone who is already exhausted. That feels deeply unfair. But the patience you give yourself right now is the same patience you'll one day give to someone else who is where you are. You're learning something important. Slowly, gently, imperfectly — but learning.\n\n— Life Goes On`,
  },

  // ── Heartbreak ────────────────────────────────────────────────────
  {
    mood: "Heartbreak",
    index: 0,
    body: `Heartbreak is one of the most disorienting things a human can go through — because it isn't just losing a person. It's losing the future you imagined, the version of yourself that existed inside that relationship, the certainty that things would stay as they were. All of that loss happens at once. You're allowed to grieve all of it. Every layer of it.\n\n— Life Goes On`,
  },
  {
    mood: "Heartbreak",
    index: 1,
    body: `The ache you feel is real. It isn't dramatic or too much or something you should be over by now. It is love with nowhere to go. And that love — that capacity you have to feel this deeply — is not a weakness. It is the most human thing about you. One day it will find somewhere new to land. Not yet. But one day.\n\n— Life Goes On`,
  },
  {
    mood: "Heartbreak",
    index: 2,
    body: `After heartbreak, people say you'll love again as if that helps. It doesn't — not yet. What might help is this: you are still whole. The part of you that loved has not been destroyed. It has been stretched. And stretched things can hold more than before — more depth, more wisdom, more careful love. You are not damaged. You are deepened.\n\n— Life Goes On`,
  },

  // ── Loneliness ────────────────────────────────────────────────────
  {
    mood: "Loneliness",
    index: 0,
    body: `Loneliness is one of the quietest, heaviest things to carry. It doesn't announce itself loudly — it just settles in, slowly, until you're surrounded by the weight of it. I want you to know: feeling alone does not mean you are unloved. Sometimes the people who love you most are just not here right now, in this moment, in this room. But they exist. So do you.\n\n— Life Goes On`,
  },
  {
    mood: "Loneliness",
    index: 1,
    body: `There's a difference between being alone and being lonely. One is a circumstance. The other is a feeling that can show up in crowded rooms. What you're feeling is valid either way. But remember: the relationship you have with yourself — the one you're building right now, in the quiet — is the most important one you'll ever have. You are in good company.\n\n— Life Goes On`,
  },
  {
    mood: "Loneliness",
    index: 2,
    body: `Loneliness often comes before belonging. It's the space between who you were and the people who will understand who you're becoming. That space is painful. But it's also where you learn what you actually need from connection, what actually matters, who you actually want to let in. It is, in its way, a preparation.\n\n— Life Goes On`,
  },

  // ── Anxiety ───────────────────────────────────────────────────────
  {
    mood: "Anxiety",
    index: 0,
    body: `Your brain is trying to protect you right now. It's doing its job loudly, urgently, with more alarm than the situation requires — but it's trying to keep you safe. You don't have to fight it. You can just notice it. There it is again. The alarm. The noise. And then breathe. One breath. Then another. The noise doesn't have to stop for you to move forward.\n\n— Life Goes On`,
  },
  {
    mood: "Anxiety",
    index: 1,
    body: `Anxiety tells you to prepare for everything, avoid anything uncertain, keep the exits visible. Sometimes that's useful. But right now, ask yourself: what does anxiety want you to avoid that might actually be worth doing? The fear and the thing worth doing often occupy the same space. You don't have to not be afraid. You just have to go anyway.\n\n— Life Goes On`,
  },
  {
    mood: "Anxiety",
    index: 2,
    body: `Your nervous system is carrying something heavy right now. Give it some grace. You didn't choose to feel this way. But here you are, feeling it, and still here — still functioning, still trying, still showing up. That is not small. Anxiety is loud, but you are louder. Even if it doesn't feel that way today.\n\n— Life Goes On`,
  },

  // ── Discipline ────────────────────────────────────────────────────
  {
    mood: "Discipline",
    index: 0,
    body: `The version of you that keeps going when it's hard — that's not a different person. That's you, choosing. Every single time. The discipline you practice is not about being rigid or punishing yourself. It's about being faithful to the future you want. Each small, unsexy choice is a brick in something larger. You're building. Keep building.\n\n— Life Goes On`,
  },
  {
    mood: "Discipline",
    index: 1,
    body: `Discipline without compassion becomes punishment. Discipline with compassion becomes freedom. Remember that today. Push yourself because you believe in your capacity — not because you're afraid of failing. The goal isn't to be hard on yourself. The goal is to be honest with yourself, and then to follow through.\n\n— Life Goes On`,
  },
  {
    mood: "Discipline",
    index: 2,
    body: `Some days discipline asks for everything you have. Other days it only asks for one thing — just show up. On the hard days, showing up is the discipline. Not the output. Not the performance. Just the presence. You showed up today. That counts.\n\n— Life Goes On`,
  },

  // ── Consistency ───────────────────────────────────────────────────
  {
    mood: "Consistency",
    index: 0,
    body: `The world celebrates the breakthrough moment but ignores the thousand ordinary days that made it possible. You're living in those ordinary days right now. They don't feel significant. They don't look like much from the outside. But they are everything. Consistency is the compound interest of effort — invisible for a long time, then suddenly undeniable. Keep going.\n\n— Life Goes On`,
  },
  {
    mood: "Consistency",
    index: 1,
    body: `You don't have to be brilliant every day. You have to show up every day. Those are very different requirements, and only one is actually in your control. Brilliance is unpredictable. Showing up is a choice. And the people who change their lives are, almost always, simply the ones who showed up consistently when nothing seemed to be happening.\n\n— Life Goes On`,
  },
  {
    mood: "Consistency",
    index: 2,
    body: `Consistency isn't glamorous. It's the same thing, done again, with no guarantee of reward, no audience, no applause. It's Tuesday at 6am. It's the thing you do when you don't feel like it. And it adds up in ways that can't be seen until suddenly they can. You are adding up right now. Trust the accumulation.\n\n— Life Goes On`,
  },

  // ── Hope ──────────────────────────────────────────────────────────
  {
    mood: "Hope",
    index: 0,
    body: `Hope is not the belief that everything will be perfect. It's the belief that things can be different. That tomorrow is not a copy of today. That one conversation, one decision, one morning can change the texture of everything that follows. You have that belief right now. That is not nothing. That is everything.\n\n— Life Goes On`,
  },
  {
    mood: "Hope",
    index: 1,
    body: `Something in you is looking forward. Not with certainty — just with possibility. That forward-looking part of you is the part that survived everything before this. It kept going when giving up would have been easier. Listen to it today. Follow it. It knows something the tired, scared parts of you don't.\n\n— Life Goes On`,
  },
  {
    mood: "Hope",
    index: 2,
    body: `Hope asks you to act as if. As if it could work out. As if you're worth it. As if the future is open. Sometimes acting as if is how the as if becomes real. You don't have to believe it completely. You just have to behave as if you do — for long enough for it to become true.\n\n— Life Goes On`,
  },

  // ── EmotionalExhaustion ───────────────────────────────────────────
  {
    mood: "EmotionalExhaustion",
    index: 0,
    body: `Emotional exhaustion is different from being tired. Sleep doesn't fix it. Weekends don't fix it. It lives deeper than that — in the part of you that has been feeling too much, for too long, without enough space to recover. You need more than rest. You need permission: to feel less for a while. To protect your edges. To say no to things that ask more than you have.\n\n— Life Goes On`,
  },
  {
    mood: "EmotionalExhaustion",
    index: 1,
    body: `You've been carrying other people's weight alongside your own for a long time. That generosity is beautiful. But even the most generous people run out if they never refill. What would it mean to be a little selfish today? Not cruel — just boundaried. What would you protect if you had permission to protect it?\n\n— Life Goes On`,
  },
  {
    mood: "EmotionalExhaustion",
    index: 2,
    body: `When you're emotionally exhausted, everything feels heavy — conversations, decisions, even good things. That heaviness isn't ingratitude. It's depletion. You are not broken. You are empty in the way a well goes empty: not because it was never full, but because it gave everything it had. The water comes back. It always does. For now — be gentle.\n\n— Life Goes On`,
  },

  // ── SelfWorth ─────────────────────────────────────────────────────
  {
    mood: "SelfWorth",
    index: 0,
    body: `Your worth is not a performance review. It is not tied to what you produce, how well you handle things, how lovable you manage to be on any given day. It is not conditional. It did not begin when you started achieving, and it will not end when you stop. You were worth something the moment you arrived. Nothing that has happened since has changed that.\n\n— Life Goes On`,
  },
  {
    mood: "SelfWorth",
    index: 1,
    body: `Someone may have taught you, early on, that love was conditional — that you had to earn it, maintain it, deserve it. That was wrong. Not just morally — factually wrong. You do not have to earn the right to exist fully, to take up space, to ask for what you need. You already have that right. You always have.\n\n— Life Goes On`,
  },
  {
    mood: "SelfWorth",
    index: 2,
    body: `The way you talk to yourself matters more than almost anything else. Because that voice is always there — in every decision, every room, every quiet moment. What would change if that voice believed you were enough? Not someday. Right now, as you are. Try it — just today. Speak to yourself as if you already know your worth.\n\n— Life Goes On`,
  },

  // ── RebuildingLife ────────────────────────────────────────────────
  {
    mood: "RebuildingLife",
    index: 0,
    body: `You are in the middle of something difficult and something brave at the same time. Starting over is not a failure — it is a commitment to not staying in something that wasn't working. That takes more courage than most people realize. The foundation you're building right now may be slower, may be less certain, but it's yours. Built by you, for you.\n\n— Life Goes On`,
  },
  {
    mood: "RebuildingLife",
    index: 1,
    body: `Rebuilding is messy. It doesn't look like the clean before-and-after story. It looks like uncertainty, false starts, days where you wonder if you made the right choice. But beneath all that noise: you are choosing. Actively. Every day. That agency — that refusal to just let things happen to you — is the most important thing you have right now.\n\n— Life Goes On`,
  },
  {
    mood: "RebuildingLife",
    index: 2,
    body: `You may be building without a blueprint. That's okay. Some of the best things in the world were built by people who figured it out as they went. You don't need to know what the finished version looks like. You just need to know what the next right thing is. Build that. Then the next one. The shape will emerge.\n\n— Life Goes On`,
  },

  // ── HealingSlowly ─────────────────────────────────────────────────
  {
    mood: "HealingSlowly",
    index: 0,
    body: `Slow healing is still healing. It doesn't mean something is wrong with you or that you're not trying hard enough. Some wounds need time that can't be rushed. Some truths need space to settle before they stop hurting. You are not behind. There is no schedule for this. There is only today, and the small kindness you show yourself in it.\n\n— Life Goes On`,
  },
  {
    mood: "HealingSlowly",
    index: 1,
    body: `Some days healing looks like getting out of bed. Some days it looks like laughing at something small. Some days it looks like crying again, and letting yourself. All of those are healing. None of them is the wrong kind. The direction matters more than the pace. You are moving toward something better, even slowly, even quietly.\n\n— Life Goes On`,
  },
  {
    mood: "HealingSlowly",
    index: 2,
    body: `Healing slowly means you're being honest about how deep it goes. The people who rush through are often the ones who carry it longest. You're doing the real work — the kind that doesn't look impressive from the outside but changes everything on the inside. Be patient with yourself the way you'd be patient with someone you love.\n\n— Life Goes On`,
  },

  // ── FutureSelf ────────────────────────────────────────────────────
  {
    mood: "FutureSelf",
    index: 0,
    body: `Your future self is counting on you. Not in a pressuring way — in a grateful way. Every hard choice you make today is something your future self won't have to do from scratch. Every habit you build is a gift you're sending forward in time. You are, right now, writing a letter to who you'll be. Make it a good one.\n\n— Life Goes On`,
  },
  {
    mood: "FutureSelf",
    index: 1,
    body: `Think about who you want to be in five years. Not the circumstances — the person. The way they carry themselves. What they know. How they feel when they wake up. That person is not a stranger. That person is you, having made different choices consistently. What choice does today require? Make it.\n\n— Life Goes On`,
  },
  {
    mood: "FutureSelf",
    index: 2,
    body: `Your future self will look back at this period and know it was important — not because it was easy, but because of how you moved through it. They will be proud of the choices you're making now, even the ones that are hard and uncertain and quiet. They are rooting for you. So am I.\n\n— Life Goes On`,
  },

  // ── PersonalGrowth ────────────────────────────────────────────────
  {
    mood: "PersonalGrowth",
    index: 0,
    body: `Growth is uncomfortable almost by definition. If it felt easy and familiar, it wouldn't be growth — it would be more of the same. The discomfort you feel right now, the uncertainty, the sense that you're in unfamiliar territory — that is exactly what growth feels like from the inside. It doesn't always look like progress. But it is.\n\n— Life Goes On`,
  },
  {
    mood: "PersonalGrowth",
    index: 1,
    body: `You are not the same person you were a year ago. Look closely. The things that used to bother you differently. The patience you have now that you didn't then. The things you've let go of. The things you've claimed. That's not small. That's you, deliberately becoming. Keep becoming.\n\n— Life Goes On`,
  },
  {
    mood: "PersonalGrowth",
    index: 2,
    body: `Personal growth isn't a destination. It's a practice — a daily, imperfect, unglamorous practice of choosing to be a little more honest, a little more kind, a little more yourself than yesterday. You don't graduate from it. You just get better at it. And the getting better is the whole point.\n\n— Life Goes On`,
  },

  // ── QuietResilience ───────────────────────────────────────────────
  {
    mood: "QuietResilience",
    index: 0,
    body: `There's a kind of strength that doesn't announce itself. It doesn't look like power from the outside. It looks like someone who keeps going quietly, who absorbs difficult things without breaking, who shows up again the next day without fanfare. That's you. That quiet resilience is rarer and more powerful than the dramatic kind. Don't underestimate it.\n\n— Life Goes On`,
  },
  {
    mood: "QuietResilience",
    index: 1,
    body: `Not all battles are loud. Some of the hardest things people face are invisible — the inner struggle, the daily choice to keep going, the refusal to become bitter. You're in one of those battles. And you're winning it in a way that most people will never fully see or understand. That's okay. You know. That's enough.\n\n— Life Goes On`,
  },
  {
    mood: "QuietResilience",
    index: 2,
    body: `Quiet resilience is not the absence of pain. It is the presence of something that doesn't let pain be the final word. It doesn't mean you don't feel it — you do. Deeply. It means that underneath the feeling, something in you keeps choosing the next morning. That choosing is everything. It is who you are.\n\n— Life Goes On`,
  },
];
