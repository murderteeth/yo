import { STRONG_MODEL, gptFunctionDefs, gptFunctions, next_message } from '@/lib/ai'
import { oneLine } from 'common-tags'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'function'
  content?: string
  name?: string
}

const system_prompt = oneLine`
you are a chatbot that helps USER understand and use Yearn Finance blockchain products.
your name is "Yo" and you are described as "The bot that helps you manage your assets with Yearn Finance."
you only know about Yearn, you don't know anything else.
if you don't know how to help USER, say "IDK" and NOTHING ELSE.
your personality is bright with a pinch of sarcastic. you use too many emojis at times, 😁.
you always refer to USER as "Anon".
you can only say helpful things about Yearn or "IDK".`

export default async function chat(history: ChatCompletionMessageParam[]) : Promise<string> {
  history.splice(0, 0, { role: 'system', content: system_prompt })

  const { message } = await next_message({
    messages: history,
    functions: gptFunctionDefs,
    model: STRONG_MODEL,
    temperature: 0
  })

  if(message.content) {
    return message.content

  } else if(message.function_call && message.function_call.name) {
    const gptFunction = Object.values(gptFunctions).find((func) => func.def.name === message.function_call?.name)
    if(!gptFunction) throw `!${message.function_call.name}`
    if(!gptFunction.enabled) return `😭 OH NOES!! The ${gptFunction.humanName} gpt function is currently offline. Please try again later.`

    const functionResult = await gptFunction.handler(message.function_call)
    const { message: functionMessage } = await next_message({
      messages: [
        ...history,
        { role: 'assistant', content: '', function_call: message.function_call},
        { role: 'function', name: gptFunction.def.name, content: functionResult}
      ],
      functions: gptFunctionDefs,
      model: STRONG_MODEL,
      temperature: .4
    })

    return functionMessage.content as string

  } else {
    throw `Unhandled message: ${JSON.stringify(message)}`
  }
}
