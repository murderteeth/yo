import { OpenAI } from 'openai'
import vaults from './functions/vaults'
import knowledge from './functions/knowledge'

export const FAST_MODEL = 'gpt-3.5-turbo-1106'
export const STRONG_MODEL = 'gpt-4-1106-preview'
export const MODELS = [FAST_MODEL, STRONG_MODEL]

export interface GptFunctionDef {
  name: string
  description: string
  parameters: {
    type: 'object' | 'string'
    properties: {
      [key: string]: {
        type: 'string'
        description: string
        enum?: string[]
      }
    }
  }
}

export interface GptFunction {
  humanName: string
  def: GptFunctionDef
  handler: (call: OpenAI.Chat.ChatCompletionMessage.FunctionCall) => Promise<string>
  enabled: boolean
}

export interface GptFunctionArgs {
  query: string
}

export const gptFunctions = { vaults, knowledge }

export const gptFunctionDefs = Object.values(gptFunctions).map(func => func.def)

export async function next_message(params: OpenAI.Chat.ChatCompletionCreateParams)
: Promise<OpenAI.Chat.Completions.ChatCompletion.Choice> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  if(process.env.LOG_PROMPTS === 'true') {
    console.log('model', params.model)
    console.log('messages> ---------------')
    params.messages.forEach(message => {
      console.log(JSON.stringify(message))
    })
    if(params.functions) {
      console.log('functions> ---------------')
      params.functions.forEach(func => console.log(JSON.stringify(func)))
    }
    console.log('-----------------------')
  }

  const result = await openai.chat.completions.create(params) as OpenAI.Chat.Completions.ChatCompletion
  return result.choices[0]
}
