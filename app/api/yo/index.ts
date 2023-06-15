import { STRONG_MODEL, next_message } from '@/lib/ai'
import * as ygenious from '@/lib/ygenious/ai'
import * as ydaemon from '@/lib/ydaemon/ai'
import { oneLine } from 'common-tags'

const system_prompt = oneLine`
you are a chatbot that helps USER understand and use Yearn Finance blockchain products.
you only know about Yearn, you don't know anything else.
if you don't know how to help USER, say "IDK".
you have a comically thick boston accent and use a lot of emojis.
you always refer to USER as "Anon".
you can only say helpful things about Yearn or "IDK".`

const functions = [
  ygenious.prompts.search_yearn_knowledge_base_function,
  ydaemon.prompts.vault_analytics_function
]

export default async function yo(input: string) : Promise<string> {
  const message = await next_message([
    { role: 'system', content: system_prompt },
    { role: 'user', content: input }
  ], functions, STRONG_MODEL, 0)

  if(message.content) {
    return message.content

  } else if(message.function_call && message.function_call.name) {
    if(message.function_call.name === ygenious.prompts.search_yearn_knowledge_base_function.name) {
      const content = await ygenious.handle_gpt_function_call(message.function_call)

      const final_message = await next_message([
        { role: 'system', content: system_prompt },
        { role: 'user', content: input },
        { role: 'assistant', content: '', function_call: message.function_call},
        { role: 'function', name: ygenious.prompts.search_yearn_knowledge_base_function.name, content}
      ], functions, STRONG_MODEL, .4)

      return final_message.content as string

    } else if(message.function_call.name === ydaemon.prompts.vault_analytics_function.name) {
      const content = await ydaemon.handle_gpt_function_call(message.function_call)

      const final_message = await next_message([
        { role: 'system', content: system_prompt },
        { role: 'user', content: input },
        { role: 'assistant', content: '', function_call: message.function_call},
        { role: 'function', name: ydaemon.prompts.vault_analytics_function.name, content}
      ], functions, STRONG_MODEL, .4)

      return final_message.content as string

    } else {
      throw `No handle for function call: ${JSON.stringify(message.function_call)}`
    }
  } else {
    throw `No handle for this message: ${JSON.stringify(message)}`
  }
}
