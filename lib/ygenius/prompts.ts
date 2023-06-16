import { GptFunction } from '../ai'

export const prompts = {
  search_yearn_knowledge_base_function: {
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
  } as GptFunction
}
