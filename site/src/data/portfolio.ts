export const profile = {
  name: 'Peyton Pulliam',
  domain: 'peytonpulliam.com',
  github: 'https://github.com/PeytonPulliam',
  linkedin: 'https://www.linkedin.com/in/peyton-pulliam-132690352/',
  tagline: 'Software engineer that is currently in the making',
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
      title: 'Software Engineering (1D7X4P)',
      when: 'Starting Dec 2026',
      subtitle: 'U.S. Air Force',
      where: 'Active duty',
      bullets: [
        'Selected for the Air Force software engineering career field; Basic Military Training begins December 2026.',
        'Technical training at Keesler AFB follows basic training.',
      ],
    },
  ] satisfies ResumeEntry[],
  skills: [
    ['Languages', 'Python, C, C++, Rust, TypeScript/JavaScript, Bash, Assembly'],
    ['Frameworks', 'Astro, Tailwind CSS, Vue, Angular'],
    ['Developer tools', 'Git, Linux (WSL2 Ubuntu), Neovim, Vercel'],
    ['Security', 'Red team operations (CRTO), networking (CCNA)'],
  ],
  certifications: [
    ['Certified Red Team Operator (CRTO) · Zero-Point Security', 'Passed'],
    ['Cisco Certified Network Associate (CCNA) · Cisco', 'Passed'],
    ['CompTIA Security+', 'Planned'],
  ],
};

export const projects = [
  {
    id: 'P-01', slug: 'weight-vault', title: 'Weight Vault', status: 'Design draft',
    summary: 'Controls which workloads can open protected model weights.',
    intro: 'A proposed artifact gateway that lets authorized workloads load model weights without handing every deployer a reusable download credential.',
    stack: 'Python, object storage, KMS',
    problem: 'Model weights are often stored with other deployment artifacts. Once a long-lived storage credential or unrestricted download link is available, it can outlive the deployment that needed it. The design separates the right to deploy a service from the right to read a specific model version.',
    note: 'The boundary ends at release. A runtime that legitimately loads plaintext weights still needs its own isolation.',
    goals: ['Bind access to a workload identity and an immutable artifact digest.', 'Make each request short-lived, scoped, and auditable.', 'Fail closed when identity or policy cannot be verified.'],
    nonGoals: ['Prevent memory inspection of an already compromised inference host.', 'Replace training-time controls or model watermarking.'],
    threatIntro: 'Assume callers can reach the gateway and might retain outdated credentials. Artifact decryption remains behind a separate service identity.',
    threats: [
      ['Stale access', 'Former or rotated workload', 'Expiring identity and an explicit release policy', 'Exposure until expiry'],
      ['Wrong artifact', 'Buggy or overprivileged deployer', 'Match the exact artifact digest to the grant', 'Policy mistakes'],
      ['Runtime compromise', 'Attacker on a permitted inference host', 'Isolate runtimes and minimize plaintext lifetime', 'Plaintext may be readable'],
    ],
    flow: [['Inference worker', 'Presents workload identity'], ['Release gateway', 'Checks identity, scope and digest'], ['Encrypted store', 'Returns the approved artifact']],
    caption: 'The gateway records the decision before admitting an artifact read. The model bytes are not part of the audit record.',
    alternatives: [
      ['Direct object-store roles', 'Fewer services, but it couples deployment access to raw artifact access.'],
      ['Static signed links', 'Simple for handoffs, but a copied link can be reused until it expires.'],
      ['Scoped release gateway', 'Adds a dependency to startup but gives the release request one enforcement point.'],
    ],
    alternativeNote: 'If startup latency dominates, test a local cache of encrypted artifacts before relaxing policy checks.',
    filename: 'prototypes/weight_vault/release.py',
    snippetIntro: 'Proposed release predicate. Identity and grant signatures must already be verified by the caller.',
    code: `def may_release(grant, verified_workload, artifact_digest, now):
    if grant is None or verified_workload is None:
        return False

    return (
        grant.workload_id == verified_workload.id
        and grant.artifact_digest == artifact_digest
        and grant.not_before <= now < grant.expires_at
    )`,
    failure: 'A grant outlives a workload identity rotation.',
    nextTest: 'Rotate a workload identity and verify an older grant is rejected within the documented revocation window.',
    metrics: ['Denied reads by reason', 'Additional cold-start latency', 'Revocation propagation time'],
  },
  {
    id: 'P-02', slug: 'anti-distillation', title: 'Anti-Distillation', status: 'Design draft',
    summary: 'Flags unusual patterns of repeated model probing.',
    intro: 'A proposed monitoring layer that looks for sustained model-query patterns worth reviewing without treating every heavy user as hostile.',
    stack: 'Python, SQL, inference logs',
    problem: 'A simple request ceiling catches volume but says little about why an account is making requests. Evaluation jobs and ordinary batch traffic can look suspicious. A review signal should explain what changed relative to expected usage without pretending it can infer intent.',
    note: 'A flag is a lead for investigation. It is not evidence that a user extracted a model.',
    goals: ['Combine request volume, category diversity, and account-specific baselines.', 'Make each alert explainable to a reviewer.', 'Use minimized telemetry and start with alert-only enforcement.'],
    nonGoals: ['Prevent all model extraction or infer a caller’s intent.', 'Store raw prompts in detection logs by default.'],
    threatIntro: 'Assume customers can send permitted requests through authenticated accounts. The detector can see summarized activity but cannot establish intent.',
    threats: [
      ['Sustained probing', 'Abusive account', 'Compare aggregate behavior with a known baseline', 'Slow changes may blend in'],
      ['False positive', 'Legitimate evaluation team', 'Separate declared evaluation traffic and require review', 'Unknown batch jobs may alert'],
      ['Sensitive logs', 'Overprivileged log reader', 'Collect derived counts and limit retention', 'Aggregates still need protection'],
    ],
    flow: [['Inference endpoint', 'Emits minimal request metadata'], ['Rolling aggregator', 'Computes account-level signals'], ['Review queue', 'Records reasons for each flag']],
    caption: 'The hot path emits counters. The detector reviews a rolling window asynchronously and does not automatically block traffic.',
    alternatives: [
      ['One global rate limit', 'Good for capacity control but blind to differences in normal usage.'],
      ['Raw-prompt classification', 'May add context, but it expands collection and complicates privacy review.'],
      ['Explainable aggregate signals', 'Preserves data minimization at the cost of lower confidence about individual requests.'],
    ],
    alternativeNote: 'Tune against known legitimate evaluations before turning telemetry into enforcement.',
    filename: 'prototypes/anti_distillation/review.py',
    snippetIntro: 'Illustrative alert reasons with thresholds supplied by policy. A flag routes to a human reviewer.',
    code: `def review_reasons(window, baseline, policy):
    if not baseline.ready:
        return []

    reasons = []
    if window.requests > baseline.request_ceiling:
        reasons.append("volume_above_baseline")
    if window.topic_diversity > policy.diversity_ceiling:
        reasons.append("unusual_topic_diversity")

    return reasons if len(reasons) >= policy.minimum_signals else []`,
    failure: 'A new customer has too little history for a meaningful baseline.',
    nextTest: 'Replay synthetic traffic and labeled evaluation sessions, then compare early-account alert quality with mature accounts.',
    metrics: ['Precision on labeled test sessions', 'False alerts on evaluation jobs', 'Time from activity to review'],
  },
  {
    id: 'P-03', slug: 'agent-control-plane', title: 'Agent Control Plane', status: 'Design draft',
    summary: 'Checks proposed agent actions before tools can execute them.',
    intro: 'A proposed policy gateway that checks an agent’s tool calls against user authority, resource scope, and approval requirements.',
    stack: 'TypeScript, Python, audit log',
    problem: 'A model can propose an action, but it should not be the authority that grants the action. If a tool accepts the model’s proposal as authorization, an error or untrusted input can turn into a real write. Enforcement belongs between the agent and the tool.',
    note: 'A human approval should apply to the exact action reviewed, not the next action with the same name.',
    goals: ['Bind every tool call to a user, tool, and target resource.', 'Require scoped, one-time approval for sensitive writes.', 'Record decisions separately from the model transcript.'],
    nonGoals: ['Detect every kind of malicious or misleading input.', 'Secure tools callable outside the controlled execution path.'],
    threatIntro: 'Treat model output and retrieved text as untrusted proposals. The gateway trusts only verified identities and approvals issued for a specific action.',
    threats: [
      ['Scope escalation', 'Untrusted agent input', 'Default-deny policy keyed to the user and resource', 'Bad policy configuration'],
      ['Approval reuse', 'Compromised agent session', 'Atomically consume an approval bound to canonical action fields', 'Canonicalization bugs'],
      ['Direct tool call', 'Caller outside the gateway', 'Keep tool credentials and network access behind the executor', 'Integration misconfiguration'],
    ],
    flow: [['Agent', 'Proposes a typed tool call'], ['Policy gateway', 'Checks scope and consumes approval'], ['Tool executor', 'Runs only admitted actions']],
    caption: 'A denied proposal is logged without being forwarded. An allowed proposal reaches the executor through a separate trusted channel.',
    alternatives: [
      ['Prompt-only instruction', 'Useful as guidance but not a trusted control on tool execution.'],
      ['Approval for every call', 'Easy to reason about, but routine confirmations can become easy to overlook.'],
      ['Policy with selective approvals', 'Adds policy maintenance but keeps ordinary reads distinct from consequential writes.'],
    ],
    alternativeNote: 'Test resource and argument changes between approval and execution before trusting the approval flow.',
    filename: 'prototypes/agent_control/admit.py',
    snippetIntro: 'Illustrative admission check. The exact action digest is computed from validated, canonical tool arguments.',
    code: `def admit(principal, action, policy, approvals):
    rule = policy.rule_for(principal.id, action.tool, action.resource)
    if rule is None or not rule.allows(action):
        return False

    if rule.requires_approval:
        return approvals.consume(principal.id, action.digest)

    return True`,
    failure: 'An approved action can change after the user reviews it.',
    nextTest: 'Change the target or arguments after approval and verify denial. Send the same approved action twice and verify only one admission.',
    metrics: ['Denied out-of-scope actions', 'Duplicate approvals rejected', 'Additional tool-call latency'],
  },
  {
    id: 'P-04', slug: 'consent-enforcement', title: 'Consent Enforcement', status: 'Design draft',
    summary: 'Checks permitted data use when a dataset is actually read.',
    intro: 'A proposed data-access checkpoint that checks whether a declared training or evaluation purpose is permitted before returning records.',
    stack: 'Python, SQL, policy store',
    problem: 'Recording consent at collection time does not guarantee that later data use is covered. Purpose can change, and a previously valid grant can be revoked. The read path needs a decision that reflects current policy, not just a tag copied with the original dataset.',
    note: 'Blocking future access after revocation does not remove an example from an already trained model.',
    goals: ['Check identity, purpose, scope, and current grant state before access.', 'Track the policy version behind each decision.', 'Make revocation behavior testable and explicit.'],
    nonGoals: ['Offer a legal conclusion about which consent obligations apply.', 'Promise deletion from previously trained model weights.'],
    threatIntro: 'Assume a pipeline can request data with a missing, incorrect, or outdated purpose. Enforcement occurs at the broker used by registered workloads.',
    threats: [
      ['Purpose mismatch', 'Misconfigured pipeline', 'Deny when the requested purpose is not in the current grant', 'Intent cannot be inferred from a tag'],
      ['Revocation delay', 'Pipeline using a stale decision', 'Version grants and expire cached decisions quickly', 'A bounded propagation delay'],
      ['Access bypass', 'Job reading storage directly', 'Restrict data access to the controlled broker', 'Legacy exceptions need audit'],
    ],
    flow: [['Dataset job', 'Requests records for a purpose'], ['Consent broker', 'Checks current grant and scope'], ['Dataset store', 'Returns only permitted records']],
    caption: 'The broker records the purpose and policy version used for a decision. It fails closed when it cannot resolve a grant.',
    alternatives: [
      ['Consent tags on exports', 'Easy to carry through ETL, but they can become stale after export.'],
      ['A reviewed allowlist per pipeline', 'Clear for narrow flows, but slow to react to per-record changes.'],
      ['Access-time broker', 'Centralizes enforcement but adds a dependency and requires a clear caching policy.'],
    ],
    alternativeNote: 'Prefer testing the revocation delay against an explicit bound over relying on a periodic sync.',
    filename: 'prototypes/consent_enforcement/decision.py',
    snippetIntro: 'Illustrative rule for an authenticated job and its current grant. The broker owns grant lookup.',
    code: `def can_read(job, grant, resource_id, purpose, now):
    if grant is None or grant.revoked:
        return False

    return (
        job.id == grant.job_id
        and resource_id in grant.resources
        and purpose in grant.purposes
        and now < grant.expires_at
    )`,
    failure: 'A helper caches an allow decision after the source grant is revoked.',
    nextTest: 'Revoke a grant mid-run, audit the last allowed read, and measure how long it takes all broker instances to deny.',
    metrics: ['Time from revocation to denial', 'Reads denied by purpose', 'Added latency per access decision'],
  },
];

export const notes = [
  {
    id: 'N-01', slug: 'prompt-is-not-a-policy', title: 'The prompt is not a policy', project: 'agent-control-plane',
    intro: 'A useful distinction when designing an agent that can do more than answer questions.',
    sections: [
      ['Separate proposals from decisions', 'A prompt tells a model how to behave. A policy tells a trusted component which actions are allowed. That difference matters the moment an agent can write to a system of record. Treat a tool call from the model as a proposal and check it against the identity and resource involved.'],
      ['Approve what actually runs', 'An approval for “send a message” is too broad if the recipient or body can change after review. Bind approval to the action the user saw. If the action changes, check it again. Test the mismatch path and the duplicate-submission path before calling the design complete.'],
    ],
  },
  {
    id: 'N-02', slug: 'model-weight-release-boundary', title: 'Where model-weight protection ends', project: 'weight-vault',
    intro: 'A release gateway narrows who can read an artifact. It does not make the receiving runtime safe.',
    sections: [
      ['Draw the boundary at release', 'Encryption at rest helps before the weights are loaded. Once an authorized runtime holds plaintext, an attacker inside that runtime is a different problem. Document that boundary in the threat model so the gateway is not credited with protection it cannot provide.'],
      ['Measure the trade-off', 'A gateway adds a network hop to startup. Measure its contribution to cold-start time and test what happens during identity rotation. If caching is needed, compare encrypted-artifact caching with caching the release decision. They have different effects on revocation.'],
    ],
  },
  {
    id: 'N-03', slug: 'revocation-is-a-latency-budget', title: 'Revocation is a latency budget', project: 'consent-enforcement',
    intro: '“Revocable” is only useful when you can say how long an old decision survives.',
    sections: [
      ['Pick a measurable point', 'Measure from when the grant changes to when every broker instance denies a fresh read. Track accesses already admitted separately. Otherwise a test can pass by observing one instance while another still accepts the stale grant.'],
      ['Be precise about what changed', 'Revocation can stop future reads through the broker. It does not undo copies already released or remove influence from a trained model. Design docs should spell out what is blocked, what remains, and which parts of that promise are measured.'],
    ],
  },
];

export type Project = (typeof projects)[number];
export type FieldNote = (typeof notes)[number];

export const projectPath = (project: Project) => `/projects/${project.slug}/`;
export const notePath = (note: FieldNote) => `/writing/${note.slug}/`;
