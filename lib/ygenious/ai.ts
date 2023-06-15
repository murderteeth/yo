import axios from 'axios'
import { prompts } from './prompts'
import { ChatCompletionRequestMessageFunctionCall } from 'openai'

const endpoint = 'https://ygenius-brain.yearn.network/ask'

interface Question {
  query: string
}

export { prompts }

export async function handle_gpt_function_call(call: ChatCompletionRequestMessageFunctionCall) {
  if(!call.arguments) throw '!call.arguments'
  const args = JSON.parse(call.arguments) as Question
  const url = `${endpoint}?history=&query=${args.query}`
  const functionResponse = await axios(url)
  return functionResponse.data
}