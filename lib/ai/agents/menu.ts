import { FAST_MODEL, gptFunctionDefs, next_message } from '@/lib/ai'
import { oneLine } from 'common-tags'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export const DEFAULT_MENU = ['Vaults', 'Balances', 'Deposits', 'Chef']

const system_prompt = oneLine`
ASSIGNMENT
- review the assistant's message and respond with a list of relevant menu options.
- use the MENUS structure to inform your response.

MENUS
[
  {
    name: "DEFAULT_MENU",
    description: "The default menu is used when the assistant is not sure which menu to use.",
    options: ["${DEFAULT_MENU.join('", "')}"]
  }
]

SPECIAL_CASE
if the message seems 

OUTPUT_FORMAT
comma separated list of options. NO OTHER TEXT!

OUTPUT_EXAMPLE
Option One, Option Two, Option Three
`

export async function next(assistantMessage: string) : Promise<string[]> {
  const messages = [
    { role: 'system', content: system_prompt },
    { role: 'assistant', content: assistantMessage },
  ] as ChatCompletionMessageParam[]
 
  const { message } = await next_message({
    messages,
    functions: gptFunctionDefs,
    model: FAST_MODEL,
    temperature: 0
  })

  if(message.content) {
    return message.content.split(', ')

  } else {
    throw `Unhandled message: ${JSON.stringify(message)}`
  }
}
