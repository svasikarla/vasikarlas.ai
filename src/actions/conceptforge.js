'use server';

import { claudeJson } from '@/lib/claudeJson';
import { groqJson } from '@/lib/groqJson';

const SYSTEM = `You are the adaptive engine inside ConceptForge — an IIT-JEE prep product.
For the user's topic, generate ONE exam-style multiple-choice question:
- exactly 4 short options,
- the 0-based index of the single correct option in \`answer_index\`,
- a worked solution in \`solution\` — at most 4 short steps, under 70 words total,
- and the single most important PREREQUISITE concept a student must master first in \`prerequisite\` (a few words).
Write all math as plain text (use / for division, ^ for powers, no LaTeX). Be concise; keep every field short.
If the topic is not a valid JEE physics, chemistry, or mathematics topic, set is_valid_request to false and explain in \`note\`.`;

const SCHEMA = {
  type: 'object',
  properties: {
    is_valid_request: { type: 'boolean' },
    topic: { type: 'string' },
    prerequisite: { type: 'string' },
    question: { type: 'string' },
    options: { type: 'array', items: { type: 'string' } },
    answer_index: { type: 'integer' },
    solution: { type: 'string' },
    note: { type: 'string' },
  },
  required: ['is_valid_request', 'topic', 'prerequisite', 'question', 'options', 'answer_index', 'solution', 'note'],
  additionalProperties: false,
};

export async function generateQuestion(topic, provider = 'claude') {
  const run = provider === 'groq' ? groqJson : claudeJson;
  // GROQ's JSON mode counts the whole document toward max_tokens and needs more
  // headroom than Claude's structured output, so this is sized for the longer path.
  const res = await run({ system: SYSTEM, schema: SCHEMA, user: topic, maxTokens: 2600, effort: 'medium' });
  if (res.error) return { error: res.error };

  const parsed = res.data;
  if (!parsed.is_valid_request) {
    return { ok: false, note: parsed.note || 'Pick a JEE physics, chemistry, or math topic.' };
  }
  return {
    ok: true,
    topic: parsed.topic,
    prerequisite: parsed.prerequisite,
    question: parsed.question,
    options: parsed.options || [],
    answerIndex: parsed.answer_index,
    solution: parsed.solution,
  };
}
