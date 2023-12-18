import axios from 'axios'
import { OpenAI } from 'openai'
import { GptFunction, GptFunctionArgs, GptFunctionDef } from '..'

const endpoint = 'https://ygenius-brain.yearn.network/ask'

const knowledge = {
  humanName: 'Knowledge',

  enabled: false,

  def: {
    name: 'search_yearn_knowledge_base',
    description: 'answers general knowledge questions about Yearn Finance, its products, ecosystem, and members',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'a general knowledge question about Yearn Finance'
        }
      },
      required: ['query']
    }
  } as GptFunctionDef,

  handler: async function(call: OpenAI.Chat.ChatCompletionMessage.FunctionCall) {
    if(!call.arguments) throw '!call.arguments'
    const { query } = JSON.parse(call.arguments) as GptFunctionArgs
    const url = `${endpoint}?history=&query=${query}`
    const functionResponse = await axios(url)
    return functionResponse.data
  }
} as GptFunction

export default knowledge
