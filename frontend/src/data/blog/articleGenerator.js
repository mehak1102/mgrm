import { composeArticle } from "./contentComposer";

const BODY_TOPICS = {
  Abdominal: {
    region: "abdominal and core",
    supportLabel: "abdominal belts",
    focus: "core recovery after surgery, hernia care and abdominal wall strain",
    loadContext: "coughing, laughing, sit-to-stand and light lifting",
    sportContext: "return to household activity and walking programmes",
  },
  "Ankle And Foot": {
    region: "ankle and foot",
    supportLabel: "ankle binders and walkers",
    focus: "sprain recovery, instability and safe weight-bearing",
    loadContext: "walking on uneven pavement, stairs and prolonged standing",
    sportContext: "court sports, running and hiking",
  },
  Arm: {
    region: "arm",
    supportLabel: "slings and arm supports",
    focus: "fracture immobilisation and soft-tissue healing",
    loadContext: "reaching, carrying bags and sleeping positions",
    sportContext: "throwing sports and gym pulling movements",
  },
  Back: {
    region: "lower and mid back",
    supportLabel: "lumbar belts and posture supports",
    focus: "desk strain, lifting mechanics and chronic lumbar discomfort",
    loadContext: "sitting, bending and lifting at home or work",
    sportContext: "golf, cricket and gym compound lifts",
  },
  Chest: {
    region: "chest and rib cage",
    supportLabel: "rib belts",
    focus: "rib injury comfort and breathing-related pain",
    loadContext: "coughing, deep breaths and turning in bed",
    sportContext: "contact sport return after clearance",
  },
  Elbow: {
    region: "elbow",
    supportLabel: "elbow braces",
    focus: "tennis elbow, golfer's elbow and repetitive strain",
    loadContext: "gripping, typing adjunct strain and carrying",
    sportContext: "racket sports, cricket and weight training",
  },
  Finger: {
    region: "finger",
    supportLabel: "finger splints",
    focus: "mallet finger, trigger finger and sports finger injuries",
    loadContext: "fine motor tasks, keyboard use and gripping",
    sportContext: "ball sports and climbing",
  },
  Knee: {
    region: "knee",
    supportLabel: "knee caps and hinged braces",
    focus: "patellar pain, ligament recovery and arthritis-friendly walking",
    loadContext: "stairs, squatting and long walks",
    sportContext: "running, football and gym leg training",
  },
  Leg: {
    region: "leg",
    supportLabel: "compression sleeves",
    focus: "circulation support, muscle fatigue and varicose discomfort",
    loadContext: "standing jobs and travel",
    sportContext: "endurance sport and post-match recovery",
  },
  Neck: {
    region: "neck and cervical spine",
    supportLabel: "cervical collars",
    focus: "stiffness, spondylosis care and screen-time strain",
    loadContext: "desk work, driving and sleeping posture",
    sportContext: "cycling and overhead sport",
  },
  "Shin And Calf": {
    region: "shin and calf",
    supportLabel: "calf supports",
    focus: "shin splints, calf strains and runner's lower-leg care",
    loadContext: "running volume and hard surfaces",
    sportContext: "track, road running and field sports",
  },
  Shoulder: {
    region: "shoulder",
    supportLabel: "immobilizers and slings",
    focus: "rotator cuff care, dislocation recovery and clavicle injuries",
    loadContext: "overhead reach, sleep positions and carrying",
    sportContext: "swimming, cricket and racquet sports",
  },
  Thigh: {
    region: "thigh",
    supportLabel: "thigh supports",
    focus: "hamstring and quadriceps strain management",
    loadContext: "lunging, sprinting and squatting",
    sportContext: "football, athletics and gym training",
  },
  Wrist: {
    region: "wrist",
    supportLabel: "wrist splints and wraps",
    focus: "typing strain, gym loading and wrist sprains",
    loadContext: "keyboard use, mobile scrolling and lifting",
    sportContext: "yoga, badminton and weight training",
  },
  "Orthopedic Aids": {
    region: "mobility",
    supportLabel: "walking aids",
    focus: "safe ambulation during rehab and balance challenges",
    loadContext: "walking at home, clinics and community outings",
    sportContext: "return to activity after lower-limb injury",
  },
};

const ACTIVITY_TOPICS = {
  Aerobics: { focus: "low-impact aerobics and joint-friendly cardio classes", joints: "knee, ankle and wrist", demand: "repetitive stepping and arm work" },
  Athletics: { focus: "track and field training", joints: "knee, ankle and hamstring", demand: "sprinting, jumping and explosive landings" },
  Badminton: { focus: "badminton footwork and racket control", joints: "knee, ankle, wrist and elbow", demand: "rapid direction changes" },
  Basketball: { focus: "basketball jumps and cuts", joints: "ankle and knee", demand: "repeated landings and lateral shuffles" },
  Cricket: { focus: "cricket batting, bowling and fielding", joints: "back, knee and elbow", demand: "long innings and repetitive throwing" },
  Cycling: { focus: "road and indoor cycling", joints: "knee and lower back", demand: "sustained flexion and pedalling load" },
  Football: { focus: "football on natural and artificial turf", joints: "ankle, knee and thigh", demand: "sprinting, tackling and twisting" },
  Golf: { focus: "golf swing mechanics", joints: "back, wrist and elbow", demand: "rotational repetition and practice volume" },
  Gym: { focus: "gym strength and conditioning", joints: "wrist, back and knee", demand: "loaded lifts and HIIT circuits" },
  Running: { focus: "road and trail running", joints: "knee, shin and ankle", demand: "impact repetition and mileage progression" },
  Tennis: { focus: "tennis serves and rallies", joints: "elbow, wrist and knee", demand: "overhead motion and court sprints" },
  Volleyball: { focus: "volleyball jumps and blocks", joints: "knee and ankle", demand: "high jump volume per match" },
  Walking: { focus: "daily walking for health and commute", joints: "knee and ankle", demand: "steady mileage on varied surfaces" },
  Yoga: { focus: "yoga practice and mobility work", joints: "knee, wrist and neck", demand: "sustained poses and transitions" },
  Sleep: { focus: "night-time posture and restful alignment", joints: "neck and lumbar spine", demand: "prolonged static positioning" },
  Office: { focus: "desk work and computer use", joints: "lumbar spine, neck and wrist", demand: "hours of sitting and typing" },
};

function expandCause(item, region) {
  return `${item} This is a frequent contributor to ${region} overload in Indian clinics because daily routines—commuting, household work and sport—often change faster than tissues adapt.`;
}

function expandSymptom(item) {
  return `${item} Note when it appears: first steps in the morning, after sport, or during desk work. Timing helps clinicians separate mechanical from inflammatory patterns.`;
}

function expandPrevention(item, region) {
  return `${item} Applied consistently, this reduces flare frequency for ${region} patients more reliably than buying a new support alone.`;
}

function expandRecovery(item) {
  return `${item} Progress only when the previous step feels stable for several days—not after a single good session.`;
}

function expandFaqAnswer(q, region, supportLabel) {
  const answers = {
    default: `For ${region} care, combine ${supportLabel} with pacing and strengthening. If symptoms worsen despite sensible self-care, book a clinical review rather than tightening the support. Bring a short symptom diary—what provokes pain, what relieves it, and how sleep is affected.`,
  };
  if (q.includes("How long")) {
    return `Many people use ${supportLabel} during the active recovery phase—often several weeks—and wean as pain and control improve. Duration should follow function, not calendar alone. If you still feel dependent after eight weeks while avoiding strengthening work, shift focus to exercise progression with your therapist rather than tighter compression.`;
  }
  if (q.includes("Can I wear")) {
    return `Daytime wear during loading is common. Remove for skin checks and sleep unless your clinician advises continuous use after surgery. Night wear without indication can irritate skin and may reduce the natural movement that helps long-term recovery.`;
  }
  if (q.includes("size")) {
    return `Measure according to the product chart at the same time of day swelling is typical. Snug without numbness is the target. If the edge leaves an imprint or toes or fingers change colour, loosen immediately and remeasure after a walk when swelling is more representative.`;
  }
  if (q.includes("replace")) {
    return `Replace when elasticity drops, seams fray, or support feels ineffective—usually after months of daily use depending on care. Hand-wash products as labelled; dryer heat breaks down elastic faster in humid climates.`;
  }
  if (q.includes("doctor")) {
    return `See a doctor for severe pain, numbness, fever with injury, joint deformity, or symptoms that persist beyond two weeks of appropriate self-care. Early assessment often shortens total downtime because plans are clearer.`;
  }
  if (q.includes("sport")) {
    return `Supports can accompany return-to-sport when pain is mild and stability is the main concern. Do not mask sharp pain or instability that needs assessment. Use a graded return: technique sessions before full intensity, and compare how the ${region} feels the morning after each step.`;
  }
  return answers.default;
}

function editorialDepth(region, supportLabel, loadContext) {
  return {
    understandingExtra: [
      `Patients often ask whether imaging is required before buying a support. For gradual onset pain without trauma, a trial of load modification and a well-fitted ${supportLabel} is reasonable while you arrange review if symptoms persist. After falls, twists, or visible deformity, examination comes first.`,
      `Cultural context matters: floor sitting, temple steps, two-wheeler posture and monsoon slips are real load events. Planning recovery around these—not only around gym sessions—produces more durable outcomes for ${region} care.`,
    ],
    recoveryExtra: [
      `Document weekly goals in plain language: ‘walk 20 minutes without next-day flare’, ‘carry one grocery bag per hand’, ‘sleep through without waking from ache’. Supports should make those goals achievable, not replace them.`,
      `If you work at a desk, stack recovery with micro-breaks during the same weeks you wear support for commuting. The ${region} experiences the sum of work and home load.`,
    ],
    supportsExtra: [
      `When comparing products, stiffness is not always better. Mild compression that you will actually wear beats a rigid brace abandoned in a drawer. For ${loadContext}, comfort over hours matters as much as peak support.`,
      `MGRM sizing charts are built for Indian body ranges—take measurements standing, with normal clothing thickness you will wear under the product.`,
    ],
    routineExtra: [
      `Weekends often spike activity after quiet weekdays. If that is your pattern, plan Saturday outings with the same pacing rules as weekday walks—support worn preventively is fine when it helps you avoid boom-bust cycles.`,
    ],
  };
}

function bodyCauses(region) {
  return [
    `Sudden load increases—extra walking, festival errands, or sport without preparation—commonly irritate the ${region}.`,
    "Occupational postures held for years often precede flare-ups; supports help while ergonomics and strength catch up.",
    "Previous injury with rushed return-to-activity leaves tissue vulnerable to repeat strain.",
    "Footwear, flooring and commute surfaces change mechanics in ways people underestimate.",
    "Deconditioning after illness reduces tissue tolerance for ordinary tasks.",
    "Fear-driven movement avoidance weakens stabilisers, increasing future injury risk.",
    "Direct trauma or twist injuries need assessment before bracing assumptions.",
    "Age-related tissue change benefits from consistent low-impact activity and sensible support.",
  ].map((c) => expandCause(c, region));
}

function bodySymptoms(region) {
  return [
    `Local ache during ${region} loading that eases with brief rest.`,
    "Morning stiffness under 30–45 minutes in mechanical patterns.",
    "Predictable pain with specific tasks—stairs, lifting, reaching.",
    "Swelling or fullness after longer activity days.",
    "Guarding and reduced confidence on uneven ground.",
    "Night pain that interrupts sleep—always worth clinical review.",
    "Numbness, tingling or weakness beyond the painful area.",
  ].map(expandSymptom);
}

function activityCauses(activity, joints, demand) {
  return [
    `${activity} training volume often rises faster than ${joints} tissues adapt—classic overload.`,
    `Poor warm-up before ${demand} leaves joints stiff and shock absorption reduced.`,
    "Equipment change—shoes, racket, bike fit—without transition weeks.",
    "Hard surfaces and heat combined increase fatigue-related form breakdown.",
    "Incomplete rehab from a prior niggle that was ‘good enough’ to play.",
    "Weekend-only intensity spikes compared to sedentary weekdays.",
    "Inadequate sleep and hydration magnify perceived joint stress.",
    "Ignoring early warning stiffness until it becomes sharp pain.",
  ];
}

function activitySymptoms(activity, joints) {
  return [
    `Dull ${joints} ache during or after ${activity} sessions.`,
    "Stiffness the morning after harder training blocks.",
    "Local tenderness when pressing along tendons or joint lines.",
    "Swelling that settles with rest but returns with sport.",
    "Instability sensations on cutting or landing—do not ignore.",
    "Pain that alters technique—compensation spreads load elsewhere.",
    "Fatigue-related form loss in the last third of a session.",
  ];
}

function buildBodyBrief(name, topic) {
  const { region, supportLabel, focus, loadContext, sportContext } = topic;
  const depth = editorialDepth(region, supportLabel, loadContext);

  return {
    heroIntro: [
      `Pain and instability around the ${region} rarely arrive without context. For many patients, symptoms follow a recognizable chain: a busier week, a new activity, a long commute, or a return to sport before tissues were ready. Understanding that chain is the first step toward durable recovery—not just temporary relief.`,
      `Orthopedic supports for the ${region} are tools for graded movement. ${supportLabel} from MGRM are used across India in homes, clinics and on fields to make ${loadContext} tolerable while strength and coordination return. They do not replace diagnosis when injury is significant, but they often bridge the gap between ‘complete rest’ and real life.`,
      `This guide focuses on ${focus}. We walk through what is happening anatomically, why symptoms appear, how to prevent repeat flare-ups, and how rehabilitation pacing works in practice. You will also find product guidance, a sample daily rhythm, and answers to questions patients ask in pharmacy and physiotherapy rooms.`,
      `Use it like a healthcare publication feature: read the sections that match your stage—acute, subacute, or maintenance—and bring notes to your clinician. Recovery is rarely linear, but it should be directional.`,
    ],
    understanding: {
      lead: `The ${region} is asked to stabilise, absorb force and repeat movement thousands of times per day. When any structure—muscle, tendon, ligament, joint surface or nerve pathway—is irritated, the whole region can feel unreliable even if imaging looks unremarkable.`,
      paragraphs: [
        `Clinicians often distinguish mechanical pain (linked to movement and posture) from inflammatory pain (more constant, sometimes nocturnal). Most ${region} presentations in primary care are mechanical and respond to load modification, education and selective support.`,
        `Compression and bracing change proprioception—your sense of position—which can reduce awkward compensations. Mechanical supports also limit extreme ranges when healing tissues should not yet be stressed.`,
        `Supports work best alongside active recovery: breathing, alignment, endurance, and gradual reloading. The product holds; the programme rebuilds.`,
      ],
      listTitle: `When ${supportLabel} are commonly discussed`,
      list: [
        `Early return to walking after ${region} strain`,
        `Occupational tasks involving ${loadContext}`,
        `Sport re-entry involving ${sportContext}`,
        "Post-injury confidence on uneven surfaces",
        "Flare management during physiotherapy blocks",
        "Seasonal activity increases (festivals, treks, sport leagues)",
      ],
      quote: {
        text: `Recovery is not the absence of a brace—it is the return of trust in your ${region} when the brace is off.`,
        attribution: "Rehabilitation medicine",
      },
      paragraphsAfter: depth.understandingExtra,
    },
    causes: {
      paragraphs: [
        `Most ${region} problems are multifactorial. A single bad step might trigger pain, but baseline stiffness, weak endurance, or sudden workload change often set the stage.`,
        `Indian urban routines mix long sitting, stair climbing, two-wheeler posture and weekend sport bursts—a pattern that challenges ${region} tolerance without deliberate preparation.`,
      ],
      listTitle: "Common contributing factors",
      list: bodyCauses(region),
    },
    symptoms: {
      paragraphs: [
        `Symptoms should be described by location, depth, timing and triggers. ‘Ache after walking’ suggests a different plan than ‘sharp pain with twist and immediate swelling’.`,
        `Supports are inappropriate when red-flag symptoms appear—see the callout below. Otherwise, matching support stiffness to instability and pain pattern is reasonable while you pursue assessment if needed.`,
        `Keep a one-week log: morning stiffness minutes, distance walked, desk hours, support worn (yes/no), night pain (0–10). Patterns become obvious quickly and make clinical visits more productive.`,
      ],
      list: bodySymptoms(region),
      callout: {
        title: "When to seek medical assessment",
        text: `Consult a doctor or physiotherapist if ${region} pain is severe, follows major trauma, includes numbness or weakness, wakes you repeatedly at night, or does not improve with two weeks of sensible self-care.`,
        variant: "warning",
      },
    },
    prevention: {
      paragraphs: [
        `Prevention for ${region} health is mostly pacing. Increase ${loadContext} gradually; avoid ‘hero days’ that cost the rest of the week.`,
        `Sleep, hydration and protein intake support tissue repair more than any single purchase. Supports enter when load is unavoidable or early symptoms appear.`,
        `Think in seasons, not single days: monsoon slips, festival travel, school sports terms and tax-season desk marathons all shift load. Planning ${supportLabel} use around those seasons is more realistic than expecting one brace to fix a chaotic calendar.`,
        `Education beats fear. Understanding what provokes your symptoms lets you modify tasks—how you carry bags, which stair rail you use, how long you sit cross-legged—while keeping the parts of life that matter.`,
      ],
      tips: [
        {
          title: "Measure, do not guess",
          text: "Use the sizing chart at a consistent time of day. Swelling changes fit more than people expect.",
        },
        {
          title: "Pair support with strength",
          text: `Two or three short strength sessions weekly protect the ${region} more than wearing a brace without exercise.`,
        },
        {
          title: "Respect surfaces",
          text: "Uneven roads, temple steps and sport courts load joints differently—adjust volume when switching environments.",
        },
      ],
    },
    recovery: {
      paragraphs: [
        `Acute phase: protect, calm symptoms, maintain safe range. Subacute phase: restore endurance and alignment. Return phase: sport-specific or work-specific loading with supports only as needed.`,
        `Physiotherapy for the ${region} often includes manual therapy, motor control drills and progressive resistance. Wear support during sessions if it improves movement quality.`,
        `Weaning is intentional: remove the brace for easy tasks first, then for longer walks, then for sport. Each step should feel boringly stable before the next.`,
      ],
      listTitle: "Recovery milestones",
      list: [
        "Pain-controlled sleep and household mobility",
        "Full comfortable range for daily tasks",
        "Strength symmetry side to side",
        `Confidence with ${loadContext}`,
        `Return toward ${sportContext} without next-day setback`,
      ].map(expandRecovery),
      tip: {
        title: "Skin care under supports",
        text: "Wash and dry skin daily; rotate wear periods; choose breathable fabrics in humid weather.",
      },
      paragraphsAfter: depth.recoveryExtra,
    },
    products: {
      paragraphsAfter: depth.supportsExtra,
      recommendation: `Start with the least restrictive ${supportLabel} that lets you complete daily tasks with mild or no pain. Escalate stiffness only if instability or higher load demands it—and step down again as control improves.`,
    },
    dailyRoutine: {
      intro: `Build days around predictable loading for the ${region} rather than reactive bracing only after pain spikes.`,
      paragraphs: [
        "Cluster demanding tasks when you feel best—often late morning—and protect recovery windows after exercise or long commutes.",
        "Log symptoms briefly: what you did, how it felt, what support you wore. Patterns emerge within a week.",
      ],
      scheduleTitle: "Sample daily structure",
      schedule: [
        { time: "Morning", action: `Gentle mobility and warm shower; light walk with support if stiffness is your pattern.` },
        { time: "Midday", action: `Work or errands involving ${loadContext}; micro-breaks every 45–60 minutes.` },
        { time: "Afternoon", action: "Strength or physiotherapy exercises; support during sets if prescribed." },
        { time: "Evening", action: "Lower-demand chores; elevate if swelling follows long standing." },
        { time: "Night", action: "Support off for skin rest unless surgeon advised otherwise; sleep position pillows as needed." },
      ],
      paragraphsAfter: depth.routineExtra,
    },
    faqs: [
      { q: `How long should I wear ${supportLabel}?`, a: expandFaqAnswer("How long", region, supportLabel) },
      { q: "Can I wear support while sleeping?", a: expandFaqAnswer("Can I wear", region, supportLabel) },
      { q: "How do I choose the correct size?", a: expandFaqAnswer("size", region, supportLabel) },
      { q: "When should I see a doctor?", a: expandFaqAnswer("doctor", region, supportLabel) },
      { q: `Can I continue sport with ${region} pain?`, a: expandFaqAnswer("sport", region, supportLabel) },
      { q: "When should I replace my support?", a: expandFaqAnswer("replace", region, supportLabel) },
      { q: "Will support weaken my muscles?", a: `Only if you avoid exercise entirely. Use ${supportLabel} as a temporary tool while you rebuild strength and control.` },
      { q: "Can supports cure the underlying problem?", a: "No product cures all causes. Supports reduce load and improve confidence while you address strength, ergonomics and medical issues when present." },
    ],
    takeaways: [
      `${region} recovery is a load-management project, not a single purchase.`,
      `Match ${supportLabel} to instability and phase of healing.`,
      "Track triggers and timing; they guide clinical conversations.",
      "Wean support as control returns—aim for independence.",
      "Escalate care for red-flag symptoms without delay.",
    ],
  };
}

function buildActivityBrief(name, topic) {
  const { focus, joints, demand } = topic;
  const activity = name;
  const activityLower = name.toLowerCase();
  const depth = editorialDepth(joints, "sport supports", demand);

  return {
    heroIntro: [
      `${activity} sits at the intersection of performance and tissue tolerance. Most injuries in recreational athletes are not mysterious—they follow identifiable jumps in volume, surface change, or return-from-break enthusiasm. The joint does not ‘fail’; it responds to load beyond current capacity.`,
      `Supports are part of a prevention-and-recovery kit, not a badge of weakness. Runners, gym members, office workers who train at night, and weekend cricketers across India use compression and bracing to stay consistent while tissues adapt.`,
      `This article covers ${focus}: how ${joints} are stressed during ${demand}, warning signs that precede injury, and how to structure training weeks with realistic recovery. Recommended MGRM products appear where they commonly help—not as universal requirements.`,
      `Read with your calendar open. Adjust next week’s plan using the prevention and daily routine sections; bring persistent symptoms to a sports medicine or physiotherapy review.`,
    ],
    understanding: {
      lead: `${activity} loads the ${joints} through repetition. Unlike acute trauma, overuse problems whisper before they shout—stiffness, dull ache, technique change. Listening early keeps you in sport.`,
      paragraphs: [
        `Injury prevention is mostly arithmetic: total sessions, intensity, surface hardness, footwear age, sleep hours. When the sum exceeds tolerance, ${joints} complain.`,
        `Supports add proprioception and sometimes limit harmful ranges during return-to-play. They work best with warm-up discipline and cool-down habits—not as replacements.`,
        `Recovery between sessions is when collagen and tendon tissue respond to load. Skimping here while adding support is a losing trade.`,
      ],
      listTitle: `Why ${activity} athletes reach for supports`,
      list: [
        "Early-season niggles when mileage or court time rises",
        "Return after 2–4 weeks off",
        "Hard tournament weekends with multiple matches",
        "Transition to new shoes or equipment",
        "Occupational sitting plus evening sport combo",
        "Confidence after prior sprain or tendinopathy",
      ],
      quote: {
        text: "Train the pattern, protect the joint—good technique with modest support beats heroic sessions that cost the month.",
        attribution: "Sports physiotherapy",
      },
      paragraphsAfter: depth.understandingExtra,
    },
    causes: {
      paragraphs: [
        `${activity}-related discomfort usually traces to training errors more than bad luck. The body adapts slowly; programmes often do not.`,
        `Environmental factors—heat, dehydration, poor sleep—lower movement quality in the final third of sessions when injuries cluster.`,
      ],
      listTitle: "Common drivers of injury",
      list: activityCauses(activity, joints, demand),
    },
    symptoms: {
      paragraphs: [
        `Watch for symptoms that change mechanics: limping, shortened stride, guarded landing, or avoiding overhead motion. Compensation spreads load to the ${joints} and spine.`,
        `Pain that warms up then worsens after activity suggests tissue irritability that needs load review—not just more support.`,
      ],
      list: activitySymptoms(activity, joints),
      callout: {
        title: "Stop and assess if you notice",
        text: "Sharp pain, joint giving way, visible swelling within an hour, or pain that rises week over week despite rest—these need clinical review before continuing the season.",
        variant: "warning",
      },
    },
    prevention: {
      paragraphs: [
        `Prevention for ${activity} is structured variety: easy days, hard days, and true rest days. Support sleeves on easy days can reduce cumulative irritability for some athletes.`,
        `Warm-up should include movement prep for ${demand}, not only static stretching. Cool-down with walking and hydration aids next-day readiness.`,
        `Cross-training is underrated: swimmers can cycle, runners can strength train, court players can walk on rest days. Variety maintains fitness while ${joints} recover from repetitive patterns.`,
        `Tournament weekends need a plan B—shorter warm-up sets, earlier substitution, ice or elevation between matches. Supports are part of plan B, not a licence to ignore volume.`,
      ],
      tips: [
        {
          title: "10% is a ceiling, not a target",
          text: "Increase weekly time or distance modestly. Jumps after festivals or vacations are high risk.",
        },
        {
          title: "Footwear and fit audits",
          text: "Replace running shoes on schedule; check bike fit; verify court shoe lateral support.",
        },
        {
          title: "Sleep as training",
          text: "Seven to eight hours improves tendon recovery more than any sleeve worn in session.",
        },
      ],
    },
    recovery: {
      paragraphs: [
        `Acute flare: reduce volume 40–60%, keep easy movement if pain allows, use ice or elevation if swollen. Subacute: restore strength in ${joints} and hips/core proxies.`,
        `Return-to-${activityLower} protocols should be symptom-gated: no more than mild discomfort that settles within 24 hours after a session.`,
        `Supports taper with confidence: full sessions with brace, then partial, then none on easy days first.`,
      ],
      listTitle: "Return markers",
      list: [
        "Pain-free warm-up routine",
        "Single-leg balance and hop symmetry",
        "No next-morning stiffness beyond mild",
        "Technique feels automatic again",
        "Coach or self-video shows no compensation",
      ].map(expandRecovery),
      recommendation: `For ${activity}, pair product use with a written week plan—sessions, rest, and strength—so support is one line in the programme, not the whole strategy.`,
      paragraphsAfter: depth.recoveryExtra,
    },
    products: {
      paragraphsAfter: depth.supportsExtra,
      recommendation: `Choose supports that stay comfortable for the full ${activityLower} session. If you adjust constantly, size or style is likely wrong.`,
    },
    dailyRoutine: {
      intro: `Weekly rhythm matters more than any single ${activity} day. Stack hard sessions with recovery tools—not consecutive hard days without planning.`,
      paragraphs: [
        "Log RPE (effort 1–10) and morning stiffness. Trends predict injury earlier than one bad workout.",
        "On rest days, walking and mobility maintain circulation without loading sport patterns heavily.",
      ],
      scheduleTitle: `Sample week around ${activity}`,
      schedule: [
        { time: "Mon", action: `Moderate ${activityLower} session; support if prior niggle present.` },
        { time: "Tue", action: "Strength for hips, core and sport-specific muscles." },
        { time: "Wed", action: "Easy technique or short session; focus on form." },
        { time: "Thu", action: "Rest or walk; skin check if daily compression used." },
        { time: "Fri–Sun", action: "Harder session or match; ice or elevate if swollen; plan next week volume." },
      ],
      paragraphsAfter: depth.routineExtra,
    },
    faqs: [
      { q: `Should I wear support for every ${activityLower} session?`, a: `Not necessarily. Many athletes use supports during higher-load weeks or return phases only. Easy technique days are useful without bracing to rebuild natural stability—alternate based on stiffness and confidence.` },
      { q: "Will a brace make me dependent?", a: "Dependency is behavioural—avoiding strength work. Combine bracing with exercises that rebuild capacity." },
      { q: "Can I prevent all injuries?", a: "No. You can reduce risk with pacing, sleep, and early symptom response." },
      { q: "Heat or ice after sessions?", a: "Ice for acute swelling; heat for chronic stiffness before mobility work. Individual preference varies." },
      { q: "How do I pick MGRM products for this sport?", a: "Match product to joint and instability—sleeves for mild ache, hinged braces when giving-way is present." },
      { q: "When to see a sports doctor?", a: "Pain persisting beyond two weeks, instability, swelling, or performance collapse despite rest—all warrant examination before the season intensifies." },
      { q: `Can beginners use the same supports as advanced ${activityLower} athletes?`, a: "Yes for basic compression sleeves when fit is correct. Advanced braces for instability are usually unnecessary until injury history or clinician advice indicates." },
      { q: "Should I train through DOMS?", a: "Mild muscle soreness differs from joint line pain. Train upper body or easy cardio if legs are sore; do not push through sharp joint symptoms." },
    ],
    takeaways: [
      `${activity} longevity is built on arithmetic, not adrenaline.`,
      `Respect ${joints} warning signs early.`,
      "Supports complement training; they do not replace it.",
      "Plan rest days as seriously as match days.",
      "Seek assessment when symptoms trend wrong despite smart self-care.",
    ],
  };
}

export function generateArticleForBlog(blog) {
  let brief;
  if (blog.type === "activity") {
    const topic = ACTIVITY_TOPICS[blog.activity || blog.category];
    if (!topic) return null;
    brief = buildActivityBrief(blog.activity || blog.category, topic);
  } else {
    const topic = BODY_TOPICS[blog.category];
    if (!topic) return null;
    brief = buildBodyBrief(blog.category, topic);
  }
  return composeArticle(brief, blog);
}

export function getBriefForBlog(blog) {
  if (blog.type === "activity") {
    const topic = ACTIVITY_TOPICS[blog.activity || blog.category];
    return topic ? buildActivityBrief(blog.activity || blog.category, topic) : null;
  }
  const topic = BODY_TOPICS[blog.category];
  return topic ? buildBodyBrief(blog.category, topic) : null;
}
