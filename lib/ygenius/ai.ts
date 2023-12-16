import axios from 'axios'
import { prompts } from './prompts'
import { OpenAI } from 'openai'

const endpoint = 'https://ygenius-brain.yearn.network/ask'

interface Question {
  query: string
}

export { prompts }

export async function handle_gpt_function_call(call: OpenAI.Chat.ChatCompletionMessage.FunctionCall) {
  if(!call.arguments) throw '!call.arguments'
  const args = JSON.parse(call.arguments) as Question
  const url = `${endpoint}?history=&query=${args.query}`
  const functionResponse = await axios(url)
  return functionResponse.data
}
