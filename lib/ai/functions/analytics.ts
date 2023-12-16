import { OpenAI } from 'openai'
import { GptFunction, GptFunctionDef } from '..'

const analytics = {
  humanName: 'Analytics',

  enabled: false,

  def: {
    name: 'query_yearn_analytics',
    description: 'answers any analytical, quantitative, or numerical questions about Yearn Finance vaults',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'an analytical question about Yearn Finance vaults'
        }
      },
      required: ['query']
    }
  } as GptFunctionDef,

  handler: async function(call: OpenAI.Chat.ChatCompletionMessage.FunctionCall) {
    throw 'coming soon'
  }
} as GptFunction

export default analytics
