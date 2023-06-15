import axios from 'axios'
import { STRONG_MODEL, next_message } from '../ai'
import { prompts } from './prompts'
import { Vault, defaultVault } from './types'
import { ChatCompletionRequestMessageFunctionCall } from 'openai'
import alasql from 'alasql'
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

  const sql = message.content

  const raw = await axios.get<Vault[]>(`${endpoint}/1/vaults/all`).then(response => response.data)
  const vaults = raw.map(vault => flatten(deepUpdate(defaultVault, vault)))
  const result = alasql(sql, [vaults])
  const addresses = result.map((vault: { address: string }) => vault.address)
  const filter = vaults.filter(vault => addresses.includes(vault.address))

  return JSON.stringify(filter)
}
