export const PROVIDERS = [
  'claude',
  'gpt',
  'gemini',
  'huggingface',
  'local',
  'quantum',
] as const

export type Provider = typeof PROVIDERS[number]

export function isProvider(x: unknown): x is Provider {
  return typeof x === 'string' && (PROVIDERS as readonly string[]).includes(x)
}
