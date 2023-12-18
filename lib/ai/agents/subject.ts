import { FAST_MODEL, next_message } from '@/lib/ai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { fetchVaults } from '../functions/vaults'

const system_prompt = `
# assignment
- review the assistant's message
- determine which vaults are mentioned in the message, if any
- respond with an array of each vault's ethereum addresses
- you don't have much time! it's ok to return an empty array

## output format
a json array of ethereum addresses or just an empty array. NO OTHER TEXT!

## output example
["0x90c1f9220d90d3966fbee24045edd73e1d588ad5", "0x83d95e0D5f402511dB06817Aff3f9eA88224B030", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]

## vault data
\`\`\`
{vaults}
\`\`\`
`

export async function next(assistantMessage: string) : Promise<string[]> {
  const _vaults = await fetchVaults()
  const vaults = _vaults.map(v => ({ address: v.address, name: v.name, symbol: v.symbol }))

  const messages = [
    { role: 'system', content: system_prompt.replace('{vaults}', JSON.stringify(vaults)) },
    { role: 'assistant', content: assistantMessage },
  ] as ChatCompletionMessageParam[]
 
  const { message } = await next_message({
    messages,
    model: FAST_MODEL,
    temperature: 0
  })

  if(message.content) {
    try {
      return JSON.parse(message.content)
    } catch(error) {
      console.warn('JSON.parse(message.content) failed', error)
      return JSON.parse('[]')
    }
  } else {
    throw `Unhandled message: ${JSON.stringify(message)}`
  }
}
