import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { COVERAGE, ICON_NAMES, artifactCategoryIds, toolCategoryIds } from './lib/taxonomy';

/**
 * Content model — V2, operational ("I have this in front of me. What now?").
 *
 * Content principles:
 * - Do not add content merely to increase the number of pages. Every artifact,
 *   tool or playbook must have operational value for a Blue Team / DFIR analyst.
 * - Prefer "what should I do next?" over encyclopedic explanations.
 * - Only document tools, artifacts and workflows that are well understood,
 *   useful, and relevant to the author's actual workflow.
 *
 * Cross references (tools, related_artifacts, complements...) are plain
 * strings. If a string matches the slug, name or alias of an entry it is
 * rendered as a link; otherwise it is shown as plain text. See
 * src/lib/content.ts → resolveRef().
 *
 * `coverage` is the author's knowledge level of the entry (basic /
 * intermediate / advanced) — honesty over completeness.
 * `review: true` flags content that still needs verification.
 */

// Coerce so that bare YAML numbers (e.g. an event ID like 4104) are accepted as strings.
const list = z.array(z.coerce.string()).default([]);

const command = z.object({ label: z.string(), command: z.string() });

const common = {
  name: z.string(),
  summary: z.string().max(240),
  tags: list,
  coverage: z.enum(COVERAGE),
  review: z.boolean().default(false),
  updated: z.coerce.date().optional(),
};

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    ...common,
    aliases: list,
    category: z.enum(toolCategoryIds),
    type: z.string(),
    platforms: z.array(z.string()).min(1),
    license: z.string().optional(),
    homepage: z.url().optional(),
    use_when: list,
    /** "Start here": first commands to run. */
    examples: z.array(command).default([]),
    look_for: list,
    outputs: list,
    /** "Combine with": tools and artifacts that complete the result. */
    complements: list,
    /** "Common mistakes": what not to misinterpret. */
    mistakes: list,
    related_artifacts: list,
  }),
});

const artifacts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artifacts' }),
  schema: z.object({
    ...common,
    aliases: list,
    category: z.enum(artifactCategoryIds),
    /** "Start here / first 5 minutes": ordered first actions. */
    start_here: list,
    start_commands: z.array(command).default([]),
    /** "Why investigate it": real situations that bring you here. */
    why: list,
    /** "First questions" the artifact helps answer (optional). */
    questions: list,
    locations: z
      .array(z.object({ label: z.string().optional(), path: z.string() }))
      .default([]),
    look_for: list,
    /** Tools split by depth; `tool_questions` says what each one answers. */
    tools_start: list,
    tools_deeper: list,
    tool_questions: z.array(z.object({ tool: z.string(), question: z.string() })).default([]),
    /** "Correlate": chain to the next data sources (rendered as a flow). */
    correlate: list,
    /** "What to extract": IOCs and facts to record. */
    extract: list,
    mistakes: list,
    related_artifacts: list,
  }),
});

const decision = z.enum(['close', 'escalate', 'isolate', 'deeper']);

const playbooks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/playbooks' }),
  schema: z.object({
    ...common,
    order: z.number().default(100),
    /** Short "I have…" label shown on playbook cards. */
    scenario: z.string(),
    icon: z.enum(ICON_NAMES),
    trigger: z.string(),
    objective: z.string(),
    /** Initial triage: first actions (the playbook's "Start here"). */
    initial_triage: list,
    /** Evidence: data you need to collect. */
    evidence: list,
    /** Questions the analysis should answer (BTLO / CTF-style, optional). */
    questions: list,
    /** Investigation: recommended order. */
    steps: z
      .array(
        z.object({
          title: z.string(),
          goal: z.string(),
          actions: list,
          tools: list,
          artifacts: list,
          escalate: z.string().optional(),
        }),
      )
      .min(1),
    /** Correlation: artifacts to chain together (rendered as a flow). */
    correlation: list,
    iocs: list,
    decision_points: z.array(z.object({ decision, when: z.string() })).default([]),
    /** Output: what the analyst should produce. */
    output: list,
    related_playbooks: list,
  }),
});

/**
 * Detections: "I think this attack is happening. How do I find it in the logs?"
 * One attack per entry — the pattern, the log sources and copy-paste hunts.
 */
const detections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/detections' }),
  schema: z.object({
    ...common,
    aliases: list,
    order: z.number().default(100),
    /** Where the hunts run (Windows, Linux, Web, SIEM…). */
    platforms: z.array(z.string()).min(1),
    /** MITRE ATT&CK technique ids (e.g. T1110). */
    mitre: list,
    /** "Start here": first checks, in order. */
    start_here: list,
    /** "What it looks like": the pattern in the data. */
    signs: list,
    /** "Where to look": log source and the events / lines that matter in it. */
    sources: z.array(z.object({ source: z.string(), look: z.string() })).default([]),
    /** "Hunt": commands grouped by where they run. */
    hunts: z
      .array(z.object({ source: z.string(), note: z.string().optional(), commands: z.array(command).min(1) }))
      .min(1),
    /** "Did it succeed?": what turns noise into an incident. */
    confirm: list,
    false_positives: list,
    /** "What to extract": IOCs and facts to record. */
    extract: list,
    mistakes: list,
    tools: list,
    related_artifacts: list,
    related_playbooks: list,
  }),
});

export const collections = { tools, artifacts, playbooks, detections };
