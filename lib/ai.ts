import { ChatCompletionRequestMessage, ChatCompletionRequestMessageFunctionCall, Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai'
import { AxiosResponse } from 'axios'

export const FAST_MODEL = 'gpt-3.5-turbo-0613'
export const STRONG_MODEL = 'gpt-4-0613'
export const MODELS = [FAST_MODEL, STRONG_MODEL]
export type Model = 'gpt-3.5-turbo-0613' | 'gpt-4-0613';

export interface GptFunction {
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

export async function next_message(
  messages: ChatCompletionRequestMessage[], 
  functions?: GptFunction[] | null | undefined,
  model: Model = FAST_MODEL,
  temperature = 0.4
) {
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))

  if(process.env.NODE_ENV === 'development') {
    console.log('model', model)
    console.log('messages> ---------------')
    messages.forEach(message => {
      console.log(JSON.stringify(message))
    })
    if(functions) {
      console.log('functions> ---------------')
      functions.forEach(func => console.log(JSON.stringify(func)))
    }
    console.log('-----------------------')
  }

  const result = await openai.createChatCompletion({
    messages,
    model: model,
    ...(functions ? { functions } : {}),
    temperature
  })

  return top_choice(result as AxiosResponse<CreateChatCompletionResponse, any>)
}

export function top_choice(response: AxiosResponse<CreateChatCompletionResponse, any>) {
  if(!response.data.choices.length) throw '!choices'
  if(!response.data.choices[0].message) throw '!message'
  return response.data.choices[0].message
}

export async function moderated(user_prompt: string) {
  if(!user_prompt) return false
  try {
    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))
    const result = await openai.createModeration({input: user_prompt})
    return result.data.results[0].flagged
  } catch {
    return false
  }
}