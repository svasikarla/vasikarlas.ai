import Anthropic from '@anthropic-ai/sdk';

/* Shared structured-output helper for the live flagship demos.
   Server-only (imported exclusively by 'use server' actions). One Claude call,
   JSON-schema-constrained output, parsed and returned. Maps transient API
   conditions to friendly error codes the widgets can display. */
export async function claudeJson({ system, schema, user, maxTokens = 1024, effort = 'low' }) {
  const input = (user || '').trim();
  if (!input) return { error: 'empty' };
  if (input.length > 240) return { error: 'too_long' };
  if (!process.env.ANTHROPIC_API_KEY) return { error: 'unconfigured' };

  try {
    const client = new Anthropic({ maxRetries: 3 });
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: maxTokens,
      system,
      output_config: { effort, format: { type: 'json_schema', schema } },
      messages: [{ role: 'user', content: input }],
    });

    if (response.stop_reason === 'refusal') return { error: 'refused' };
    const block = response.content.find((b) => b.type === 'text');
    if (!block) return { error: 'failed' };
    return { ok: true, data: JSON.parse(block.text) };
  } catch (err) {
    console.error('claudeJson failed:', err?.message || err);
    if (err?.status === 529 || err?.status === 429) return { error: 'busy' };
    return { error: 'failed' };
  }
}
