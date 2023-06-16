import axios from 'axios'
import { STRONG_MODEL, next_message } from '../ai'
import { prompts } from './prompts'
import { Vault, defaultVault } from './types'
import { ChatCompletionRequestMessageFunctionCall } from 'openai'
import jmespath from 'jmespath'
import deepUpdate from '../deepUpdate'
import flatten from '../flatten'

const endpoint = 'https://ydaemon.yearn.finance'

interface Question {
  query: string
}

export { prompts }

export async function handle_gpt_function_call(call: ChatCompletionRequestMessageFunctionCall) {
  if(!call.arguments) throw '!call.arguments'
  const args = JSON.parse(call.arguments) as Question
  const message = await next_message([
    { role: 'system', content: prompts.system },
    { role: 'user', content: prompts.user(args.query) }
  ], null, STRONG_MODEL, 0)

  if(message.content === 'IDK') return 'I don\'t know how to answer that.'

  const jmesExpression = message.content
  console.log('jmesExpression', jmesExpression)

  const raw = await axios.get<Vault[]>(`${endpoint}/1/vaults/all`).then(response => response.data)
  const vaults = raw.map(vault => flatten(deepUpdate(defaultVault, vault)))
  const result = jmespath.search({ vaults }, jmesExpression as string)
  const results = (Array.isArray(result) ? result.flat() : [result])
  const sortedAndTrimmed = results.sort((a, b) => b.tvl_tvl - a.tvl_tvl).slice(0, 3)
  const addresses = sortedAndTrimmed.map((vault: { address: string }) => vault.address)
  const filter = vaults.filter(vault => addresses.includes(vault.address))

  return JSON.stringify(filter)
}
