import Groq from 'groq-sdk';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

/* GROQ counterpart to claudeJson — same signature and return contract, so the
   live demos can switch providers without changing their call sites. GROQ's
   JSON mode takes no schema object, so the schema is spelled into the prompt;
   `effort` is accepted for signature parity and ignored. Server-only. */
export async function groqJson({ system, schema, user, maxTokens = 1024 }) {
  const input = (user || '').trim();
  if (!input) return { error: 'empty' };
  if (input.length > 240) return { error: 'too_long' };
  if (!process.env.GROQ_API_KEY) return { error: 'unconfigured' };

  const jsonSystem = `${system}

Respond with ONLY a JSON object that conforms to this JSON schema (no prose, no markdown fences):
${JSON.stringify(schema)}`;

  try {
    const groq = new Groq({ maxRetries: 3 });
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: jsonSystem },
        { role: 'user', content: input },
      ],
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) return { error: 'failed' };
    return { ok: true, data: JSON.parse(text) };
  } catch (err) {
    console.error('groqJson failed:', err?.message || err);
    if (err?.status === 529 || err?.status === 429) return { error: 'busy' };
    return { error: 'failed' };
  }
}
