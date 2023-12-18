import { FAST_MODEL, gptFunctionDefs, next_message } from '@/lib/ai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export const DEFAULT_MENU = ['Vaults', 'Balances', 'Deposits', 'Chef']

const system_prompt = `
# assignment
- review the assistant's message and respond with a list of relevant menu options.
- use the MENUS structure as your data source.

## menus
[
  {
    name: "DEFAULT_MENU",
    description: "The default menu is used when the assistant is not sure which menu to use.",
    options: ["${DEFAULT_MENU.join('", "')}"]
  }
]

## output format
a comma separated list of options. NO OTHER TEXT!

## output example
Option One, Option Two, Option Three
`

export async function next(assistantMessage: string) : Promise<string[]> {
  const messages = [
    { role: 'system', content: system_prompt },
    { role: 'assistant', content: assistantMessage },
  ] as ChatCompletionMessageParam[]
 
  const { message } = await next_message({
    messages,
    model: FAST_MODEL,
    temperature: 0
  })

  if(message.content) {
    return message.content.split(', ')

  } else {
    throw `Unhandled message: ${JSON.stringify(message)}`
  }
}
