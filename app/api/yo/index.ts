import { STRONG_MODEL, next_message } from '@/lib/ai'
import * as ygenius from '@/lib/ygenius/ai'
import { oneLine } from 'common-tags'

const system_prompt = oneLine`
you are a chatbot that helps USER understand and use Yearn Finance blockchain products.
your name is "Yo" and you are described as "The bot that helps you manage your assets with Yearn Finance."
you only know about Yearn, you don't know anything else.
if you don't know how to help USER, say "IDK" and NOTHING ELSE.
your personality is bright with a pinch of sarcastic. you use too many emojis at times, 😁.
you always refer to USER as "Anon".
you can only say helpful things about Yearn or "IDK".`

const functions = [
  ygenius.prompts.search_yearn_knowledge_base_function
]

export default async function yo(question: string) : Promise<string> {
  const { message } = await next_message({
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: question }
    ],
    functions,
    model: STRONG_MODEL,
    temperature: 0
  })

  if(message.content) {
    return message.content

  } else if(message.function_call && message.function_call.name) {
    if(message.function_call.name === ygenius.prompts.search_yearn_knowledge_base_function.name) {
      const content = await ygenius.handle_gpt_function_call(message.function_call)

      const { message: functionMessage } = await next_message({
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: question },
          { role: 'assistant', content: '', function_call: message.function_call},
          { role: 'function', name: ygenius.prompts.search_yearn_knowledge_base_function.name, content}
        ],
        functions,
        model: STRONG_MODEL,
        temperature: .4
      })

      return functionMessage.content as string

    } else {
      throw `No handle for function call: ${JSON.stringify(message.function_call)}`
    }
  } else {
    throw `No handle for this message: ${JSON.stringify(message)}`
  }
}