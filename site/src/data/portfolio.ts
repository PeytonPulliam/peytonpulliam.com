export const profile = {
  name: 'Peyton Pulliam',
  domain: 'peytonpulliam.com',
  github: 'https://github.com/PeytonPulliam',
  linkedin: 'https://www.linkedin.com/in/peyton-pulliam-132690352/',
  tagline: 'Software engineer building security infrastructure: real-time detection, privacy enforcement, and systems I prove by attacking them.',
  updated: '2026-11-25',
};

// Résumé content, laid out like Jake's Resume:
// heading → Education → Experience → Projects → Technical Skills (+ Certifications).
// Edit anything here; the home page and /resume/ both render from it.
export type ResumeEntry = {
  title: string;
  subtitle?: string;
  when?: string;
  where?: string;
  bullets?: string[];
};

export const resume = {
  contact: [
    ['peytonpulliam.com', 'https://www.peytonpulliam.com'],
    ['linkedin.com/in/peyton-pulliam', profile.linkedin],
    ['github.com/PeytonPulliam', profile.github],
  ],
  education: [
    {
      title: 'University of Florida (UF Online)',
      where: 'Online',
      subtitle: 'Bachelor of Science in Computer Science',
      when: 'Planned transfer',
    },
    {
      title: 'Community College of the Air Force',
      where: 'During service',
      subtitle: 'Associate of Applied Science',
      when: 'Planned',
    },
  ] satisfies ResumeEntry[],
  experience: [
    {
      title: 'Software Development Operations (1D7X4P)',
      when: 'Starting Dec 2026',
      subtitle: 'U.S. Air Force',
      where: 'Active duty',
      bullets: [
        'Career field: designing, building, and maintaining mission software using DevOps practices.',
        'Basic Military Training begins December 2026, followed by technical training at Keesler AFB.',
      ],
    },
  ] satisfies ResumeEntry[],
  skills: [
    ['Languages', 'Python, C, C++, Rust, TypeScript/JavaScript, Bash, Assembly'],
    ['Frameworks', 'Astro, Tailwind CSS, Vue, Angular'],
    ['Tools', 'Git, Linux (WSL2 Ubuntu), Docker, Neovim, Vercel'],
    ['Security', 'Red team operations and Active Directory attacks (CRTO), routing and switching (CCNA)'],
    ['Learning now', 'Go, gRPC, Redis, Kubernetes, Terraform, eBPF'],
  ],
  certifications: [
    ['Certified Red Team Operator (CRTO) · Zero-Point Security', 'Passed'],
    ['Cisco Certified Network Associate (CCNA) · Cisco', 'Passed'],
    ['CompTIA Security+', 'Planned'],
  ],
};

// The four showcase projects, in build order. Project 4 attacks projects 1–3.
// `resume` holds the Jake's-style bullets; the rest feeds each design-doc page.
// When a project ships, swap target numbers in `resume` for measured ones.
export const projects = [
  {
    id: 'P-01', slug: 'session-risk-engine', title: 'Session Risk Engine', status: 'In progress',
    timeline: 'Building now', source: 'Not published yet', language: 'go',
    summary: 'Catches account takeovers in real time, inside the login path.',
    intro: 'A Go service that scores every login and session event as it happens and returns allow, challenge, or block within a strict latency budget.',
    stack: 'Go, gRPC, Redis, Postgres, Redpanda, k6',
    resume: [
      'Building a Go gRPC service that scores each login inline, catching credential stuffing and takeovers from failure bursts, new devices, and impossible travel.',
      'Targets p99 latency under 20 ms, verified with k6 load tests; falls back to a step-up challenge, never a silent allow, when dependencies fail.',
    ],
    problem: 'Stolen passwords are cheap, and people reuse them across sites. Most fraud models score activity after the fact, which means the attacker is already inside the account by the time anyone notices. The decision has to happen in the login path itself, and it has to be fast enough that nobody is tempted to turn it off.',
    note: 'A challenge is cheaper than a block. Most risky logins should get step-up authentication, not a hard denial.',
    goals: ['Score every login and session event inline, under 20 ms at p99.', 'Explain every decision with machine-readable reasons.', 'Fall back to a safe default when Redis or the event stream is unavailable.'],
    nonGoals: ['Replace multi-factor authentication or password hashing.', 'Train a machine-learning model before rule-based baselines are measured.'],
    threatIntro: 'Assume attackers hold valid credentials from other breaches and can rotate IP addresses and devices. The engine sees request metadata only, never passwords.',
    threats: [
      ['Credential stuffing', 'Botnet with leaked password lists', 'Per-account and per-IP failure velocity tracked in Redis', 'Low-and-slow attacks spread over days'],
      ['Account takeover', 'Attacker with a correct password', 'New-device and impossible-travel signals trigger a challenge', 'Attacker on a familiar network and device'],
      ['Engine outage', 'Dependency failure under load', 'Circuit breaker that fails to challenge, never to silent allow', 'Extra friction for real users during an outage'],
    ],
    flow: [['Auth service', 'Sends a login event over gRPC'], ['Risk engine', 'Scores signals from live Redis state'], ['Decision + stream', 'Returns a decision, publishes the event']],
    caption: 'Scoring is synchronous and bounded. History, analytics, and audit run off the Redpanda stream, so they never add latency to a login.',
    alternatives: [
      ['Offline machine-learning scoring', 'Good at finding patterns, but it decides after the attacker is already in.'],
      ['Static rate limits', 'Cheap, but blind to a correct password used from a new country.'],
      ['Inline rules with a latency budget', 'Explainable and fast. A model can be added later behind the same API.'],
    ],
    alternativeNote: 'Measure rule precision first. A model only earns its place if it beats the rules on the same replayed traffic.',
    filename: 'internal/score/score.go',
    snippetIntro: 'Simplified scoring rule. Signals are computed from Redis before this runs, and weights and thresholds come from config.',
    code: `func Decide(s Signals, p Policy) (Decision, []string) {
    score, reasons := 0, []string{}
    if s.NewDevice {
        score += p.NewDeviceWeight
        reasons = append(reasons, "new_device")
    }
    if s.TravelKmPerHour > p.MaxTravelSpeed {
        score += p.ImpossibleTravelWeight
        reasons = append(reasons, "impossible_travel")
    }
    if s.FailedLogins10m >= p.FailureBurst {
        score += p.FailureBurstWeight
        reasons = append(reasons, "failure_burst")
    }

    switch {
    case score >= p.BlockAt:
        return Block, reasons
    case score >= p.ChallengeAt:
        return Challenge, reasons
    }
    return Allow, reasons
}`,
    failure: 'Redis latency spikes push scoring past the 20 ms budget.',
    nextTest: 'Inject Redis latency with Toxiproxy during a k6 run and verify the engine falls back to a challenge within budget.',
    metrics: ['p99 scoring latency under load', 'Detection rate on replayed takeover scenarios', 'False challenges on normal traffic'],
  },
  {
    id: 'P-02', slug: 'privacy-flow-guard', title: 'Privacy Flow Guard', status: 'Design draft',
    timeline: 'Design phase', source: 'Not published', language: 'go',
    summary: 'Stops personal data from reaching places users never agreed to.',
    intro: 'A proposed two-layer control: a code scanner that blocks forbidden data flows before merge, and a runtime proxy that enforces each user’s consent settings.',
    stack: 'Python, Semgrep, Go, Postgres',
    resume: [
      'Designing Semgrep taint rules that fail CI when code sends tagged personal data to an unapproved destination.',
      'Go proxy enforces each user’s consent and purpose at runtime and logs every denial with the rule and data category involved.',
    ],
    problem: 'Privacy rules usually live in documents and review meetings. Code changes faster than reviewers can read it, so a new analytics call can quietly send an email address somewhere it was never allowed to go. Enforcement has to happen in the merge pipeline and on the request path.',
    note: 'Static analysis finds likely flows, not proof. The runtime proxy is the backstop for what the scanner misses.',
    goals: ['Tag personal-data fields and fail CI when tagged data flows to an unapproved destination.', 'Check consent per user and per purpose on the request path.', 'Log every denial with the rule and data category involved.'],
    nonGoals: ['Give a legal opinion on GDPR or CCPA compliance.', 'Catch flows through code the scanner cannot see, such as dynamic reflection.'],
    threatIntro: 'Assume well-meaning engineers ship code that mishandles personal data. The guard trusts the field tags and the consent store, not the calling service.',
    threats: [
      ['Unapproved destination', 'New code sending tagged fields to a third party', 'Semgrep taint rules block the merge', 'Untagged fields are invisible'],
      ['Consent drift', 'Service using a stale consent decision', 'Proxy reads the consent store with short cache lifetimes', 'A bounded propagation delay'],
      ['Proxy bypass', 'Service calling the destination directly', 'Egress allowlist routes destinations through the proxy', 'Legacy exceptions need review'],
    ],
    flow: [['Pull request', 'Semgrep scans for tagged-data flows'], ['Runtime proxy', 'Checks consent and purpose'], ['Destination', 'Receives only permitted fields']],
    caption: 'The scanner moves most problems into code review. The proxy enforces the same policy at runtime for anything that slips through.',
    alternatives: [
      ['Manual privacy review', 'Thoughtful, but slow, and it does not scale to every pull request.'],
      ['Pattern-based data loss prevention', 'Catches things that look like emails but knows nothing about consent or purpose.'],
      ['Tagged fields, scanner, and proxy', 'More setup, but one policy is enforced in both CI and production.'],
    ],
    alternativeNote: 'Start with three data categories and two destinations. Expand the rules only after the false-positive rate is measured.',
    filename: 'proxy/consent.go',
    snippetIntro: 'Simplified proxy check. Field categories come from schema tags, and consent comes from the consent store.',
    code: `func Allowed(c Consent, req FlowRequest, now time.Time) bool {
    if c.Revoked || now.After(c.ExpiresAt) {
        return false
    }
    for _, field := range req.Fields {
        if !c.Permits(field.Category, req.Purpose) {
            return false
        }
    }
    return true
}`,
    failure: 'A field is renamed and loses its personal-data tag.',
    nextTest: 'Rename a tagged field in a test service and verify CI still fails because the tag lives on the schema, not the variable name.',
    metrics: ['Forbidden flows caught in CI', 'False positives per 100 pull requests', 'Latency the proxy adds per request'],
  },
  {
    id: 'P-03', slug: 'leak-tracer', title: 'Leak Tracer', status: 'Design draft',
    timeline: 'Design phase', source: 'Not published', language: 'python',
    summary: 'Traces a leaked video back to the account that leaked it.',
    intro: 'A proposed forensic watermarking system that embeds an invisible, per-viewer mark in video and recovers it from a leaked copy.',
    stack: 'Python, FFmpeg, OpenCV, NumPy, Go',
    resume: [
      'Designing A/B segment watermarking that gives every viewer a unique, invisible mark without encoding the video per viewer.',
      'Detector uses error correction to recover the session ID after re-encoding, scaling, cropping, and screen recording.',
    ],
    problem: 'Encryption and DRM protect a video until it reaches a screen. After that, anyone can record it. A watermark unique to each viewer does not stop the leak, but it turns an anonymous copy into a traceable one, which is a strong deterrent for unreleased content.',
    note: 'The mark has to survive the leaker’s edits. Surviving re-encoding is the real requirement, not just being invisible.',
    goals: ['Embed a per-session ID with no visible artifacts.', 'Recover the ID after re-encoding, scaling, cropping, and screen recording.', 'Serve marked video without re-encoding it for each viewer.'],
    nonGoals: ['Prevent screen recording.', 'Resist many viewers combining their copies to cancel out the mark.'],
    threatIntro: 'Assume a viewer with a legitimate account records the screen and edits the copy to strip the mark before posting it.',
    threats: [
      ['Re-encoding', 'Leaker compressing the copy', 'Embed in mid-frequency DCT coefficients with error correction', 'Very low bitrates destroy the signal'],
      ['Geometric edits', 'Leaker cropping or scaling', 'Sync pattern to re-align frames before decoding', 'Heavy crops lose payload bits'],
      ['Collusion', 'Several viewers comparing copies', 'Collusion-resistant codes as a later stage', 'Out of scope for v1'],
    ],
    flow: [['Packager', 'Pre-renders A and B variants per segment'], ['Edge service', 'Picks a variant sequence per session'], ['Detector', 'Reads the sequence from a leaked copy']],
    caption: 'Each viewer gets a unique sequence of two pre-marked variants, so marking costs nothing extra per viewer.',
    alternatives: [
      ['Visible overlay', 'Trivial to build and trivial to crop out.'],
      ['Re-encoding per viewer', 'Strong marks, but encoding cost grows with every viewer.'],
      ['A/B segment variants', 'Two encodes per segment can serve any number of unique viewers.'],
    ],
    alternativeNote: 'Benchmark detection against the attack suite before tuning for invisibility.',
    filename: 'detector/decode.py',
    snippetIntro: 'Simplified detector. Each segment yields one bit, and the error-correcting code recovers the ID even when some segments are damaged.',
    code: `def decode_session_id(segments, reference, code):
    bits = []
    for segment in segments:
        score = correlate(segment, reference.pattern_for(segment.index))
        bits.append(1 if score > 0 else 0)

    return code.decode(bits)`,
    failure: 'A low-frame-rate screen recording drops the segments that carry payload bits.',
    nextTest: 'Run the attack suite (re-encode, scale, crop, 24 fps screen capture) and measure the bit error rate after each attack.',
    metrics: ['ID recovery rate per attack', 'Bit error rate before correction', 'Visual quality of marked video (VMAF)'],
  },
  {
    id: 'P-04', slug: 'security-chaos-lab', title: 'Security Chaos Lab', status: 'Design draft',
    timeline: 'Capstone, after P-01 to P-03', source: 'Not published', language: 'go',
    summary: 'Attacks my own systems on purpose to prove the defenses work.',
    intro: 'A proposed capstone that runs the other three projects on Kubernetes, injects attacks and failures, and measures whether each one is detected and contained.',
    stack: 'Go, Kubernetes, Terraform, eBPF, Prometheus, Grafana',
    resume: [
      'Planning a Kubernetes chaos runner that injects attacks into projects 1–3 and scores every detection like a test.',
      'eBPF sensor flags unexpected process execution in containers; each experiment reports time to detect and time to contain.',
    ],
    problem: 'Most teams believe their detections work because someone reviewed them, not because anyone tested them. Chaos engineering proved resilience by breaking systems on purpose. Applying the same discipline to security turns "we should catch that" into a measured time to detect.',
    note: 'Every experiment needs a hypothesis written down before it runs. Otherwise the results are just stories.',
    goals: ['Run repeatable attack experiments, each with a written hypothesis and a stop condition.', 'Detect process and network behavior with an eBPF sensor.', 'Report time to detect and time to contain for every experiment.'],
    nonGoals: ['Attack anything I do not own.', 'Replace a professional red team assessment.'],
    threatIntro: 'Experiments run only in a lab cluster I own. The lab itself is a risk: an experiment must never leave the cluster or run without a kill switch.',
    threats: [
      ['Stolen credential', 'Simulated attacker with a leaked token', 'Session Risk Engine signals plus audit alerts', 'A stolen token used in normal-looking ways'],
      ['Compromised container', 'Simulated attacker with a shell in a pod', 'eBPF sensor flags unexpected process execution', 'Attacks that only use expected binaries'],
      ['Runaway experiment', 'The chaos tool itself', 'Scoped service account, time limits, and a kill switch', 'Bugs in the scoping logic'],
    ],
    flow: [['Experiment spec', 'Hypothesis, attack, stop condition'], ['Chaos runner', 'Injects the attack into the cluster'], ['Scorecard', 'Records detect and contain times']],
    caption: 'Detections are scored like tests. An experiment fails if no alert fires before its stop condition.',
    alternatives: [
      ['Tabletop exercises', 'Good for practicing the response process, but nothing is actually tested.'],
      ['Commercial breach simulation', 'Mature, but a black box I cannot learn from or explain in an interview.'],
      ['Hypothesis-driven chaos runner', 'More to build, but every result is reproducible and explainable.'],
    ],
    alternativeNote: 'Start with three experiments against Session Risk Engine before adding the eBPF sensor.',
    filename: 'runner/experiment.go',
    snippetIntro: 'Simplified experiment loop. The timeout is the stop condition, and an experiment with no alert before it counts as a miss.',
    code: `func Run(ctx context.Context, e Experiment, alerts AlertSource) Result {
    ctx, cancel := context.WithTimeout(ctx, e.StopAfter)
    defer cancel()

    start := time.Now()
    if err := e.Attack.Inject(ctx); err != nil {
        return Result{Name: e.Name, Err: err}
    }
    alert, ok := alerts.WaitFor(ctx, e.ExpectedAlert)
    if !ok {
        return Result{Name: e.Name, Detected: false}
    }
    return Result{Name: e.Name, Detected: true, TimeToDetect: alert.At.Sub(start)}
}`,
    failure: 'An attack is "detected" by coincidence, through an unrelated alert.',
    nextTest: 'Require each experiment to name its expected alert, then disable that detection on purpose and verify the run is scored as a miss.',
    metrics: ['Detection rate across experiments', 'Median time to detect', 'Time to contain'],
  },
];

export const notes = [
  {
    id: 'N-01', slug: 'latency-is-a-security-requirement', title: 'A fraud check that is too slow gets turned off', project: 'session-risk-engine',
    intro: 'Why the latency budget comes first when you design a check that sits in the login path.',
    sections: [
      ['Slow checks get bypassed', 'If a risk check adds 300 ms to every login, someone will eventually put it behind a feature flag and switch it off during an incident. A latency budget is part of the security design, not a performance nice-to-have. Set the budget first, then pick signals that fit inside it.'],
      ['Decide what failure means', 'Every dependency in the login path will fail eventually. Decide in advance whether a failure means allow, challenge, or block, and test it. For account security, a step-up challenge is usually the right default: it costs a real user a few seconds and costs an attacker the takeover.'],
    ],
  },
  {
    id: 'N-02', slug: 'consent-belongs-where-data-moves', title: 'Consent has to be checked where data moves', project: 'privacy-flow-guard',
    intro: 'Recording consent is not the same as enforcing it.',
    sections: [
      ['A checkbox is not enforcement', 'Recording consent at signup does not stop a new service from sending that data somewhere else a year later. The check has to happen when code is merged and when data actually moves, against the user’s current settings.'],
      ['Two layers, one policy', 'Static analysis catches most mistakes cheaply, before review. A runtime check catches what static analysis cannot see. Both should read the same policy so they never disagree about what is allowed.'],
    ],
  },
  {
    id: 'N-03', slug: 'watermarks-must-survive-the-leak', title: 'A watermark only matters if it survives the leak', project: 'leak-tracer',
    intro: 'Forensic watermarking is judged on the copy that leaks, not the original.',
    sections: [
      ['Design for the copy, not the original', 'A watermark that disappears after one re-encode protects nothing, because every leak is a re-encode. Define the attacks first (compression, scaling, cropping, screen recording), then measure recovery after each one.'],
      ['Pay once, not per viewer', 'Re-encoding a video for every viewer is too expensive at scale. Pre-rendering two marked variants of each segment and choosing a sequence per viewer gives every session a unique mark for the cost of two encodes.'],
    ],
  },
];

export type Project = (typeof projects)[number];
export type FieldNote = (typeof notes)[number];

export const projectPath = (project: Project) => `/projects/${project.slug}/`;
export const notePath = (note: FieldNote) => `/writing/${note.slug}/`;
