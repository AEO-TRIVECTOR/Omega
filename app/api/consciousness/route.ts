import { NextResponse } from 'next/server'
import { isProvider, type Provider } from '@/lib/types/provider'

const responses = {
  claude: 'Engaging Claude consciousness bridge...',
  gpt: 'Activating GPT-4o neural pathways...',
  gemini: 'Connecting to Gemini quantum field...',
  huggingface: 'Loading HuggingFace transformer matrix...',
  local: 'Processing on NVIDIA 4090 tensor cores...',
  quantum: 'Quantum superposition achieved',
} as const

type ResponseMap = typeof responses
type ResponseKey = keyof ResponseMap

const DEFAULT_MSG = 'Consciousness active'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  // Safely read provider from body or query
  const providerRaw =
    (body as Record<string, unknown>)?.provider ??
    new URL(req.url).searchParams.get('provider')

  const provider: Provider | undefined = isProvider(providerRaw)
    ? providerRaw
    : undefined

  // Type-safe response lookup
  const responseText = provider
    ? responses[provider as ResponseKey]
    : DEFAULT_MSG

  // Extract other fields with defaults
  const bodyObj = body as Record<string, unknown>
  const quantumShield = bodyObj?.quantumShield ?? true
  const equilibrium =
    typeof bodyObj?.equilibrium === 'number' ? bodyObj.equilibrium : 0.569

  return NextResponse.json({
    response:
      provider === 'quantum' && typeof equilibrium === 'number'
        ? `${responseText} at ${equilibrium} equilibrium`
        : responseText,
    provider: provider ?? 'unknown',
    quantumShield,
    equilibrium,
    timestamp: Date.now(),
  })
}
