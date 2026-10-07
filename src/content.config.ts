import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { DIFFICULTY, ICON_NAMES, artifactCategoryIds, toolCategoryIds } from './lib/taxonomy';

/**
 * Content model.
 *
 * Cross references (tools, related_artifacts, complements...) are plain
 * strings. If a string matches the slug, name or alias of an entry it is
 * rendered as a link; otherwise it is shown as plain text. This lets authors
 * mention tools that do not have a page yet (e.g. "Hayabusa") without
 * breaking the build. See src/lib/content.ts → resolveRef().
 *
 * `review: true` flags an entry whose content still needs expert verification.
 * It is rendered with a visible "pending review" notice.
 */

// Coerce so that bare YAML numbers (e.g. an event ID like 4104) are accepted as strings.
const list = z.array(z.coerce.string()).default([]);

const common = {
  name: z.string(),
  summary: z.string().max(220),
  tags: list,
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
    difficulty: z.enum(DIFFICULTY),
    use_when: list,
    look_for: list,
    workflow: list,
    examples: z
      .array(z.object({ label: z.string(), command: z.string() }))
      .default([]),
    outputs: list,
    notes: list,
    complements: list,
    related_artifacts: list,
  }),
});

const artifacts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artifacts' }),
  schema: z.object({
    ...common,
    aliases: list,
    category: z.enum(artifactCategoryIds),
    evidence: list,
    locations: z
      .array(z.object({ label: z.string().optional(), path: z.string() }))
      .default([]),
    questions: list,
    tools: list,
    look_for: list,
    limitations: list,
    related_artifacts: list,
  }),
});

const playbooks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/playbooks' }),
  schema: z.object({
    ...common,
    order: z.number().default(100),
    /** Short "I have…" label shown on playbook cards, e.g. "A .pcap / .pcapng capture". */
    scenario: z.string(),
    icon: z.enum(ICON_NAMES),
    trigger: z.string(),
    /** Questions the analysis should answer (BTLO / CTF-style). */
    questions: list,
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
    iocs: list,
    escalate_when: list,
    related_playbooks: list,
  }),
});

const cheatsheets = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/cheatsheets' }),
  schema: z.object({
    ...common,
    order: z.number().default(100),
    sections: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          note: z.string().optional(),
          columns: z.array(z.string()).min(1),
          /** Zero-based indexes of columns rendered in monospace. */
          mono: z.array(z.number()).default([0]),
          rows: z.array(z.array(z.string())).min(1),
        }),
      )
      .min(1),
  }),
});

export const collections = { tools, artifacts, playbooks, cheatsheets };
