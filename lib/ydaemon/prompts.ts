import { GptFunction } from '../ai'

export const prompts = {
  system: `you are a savant at creating JMESPath expressions to query json objects.
you only know JMESPath expressions and how to apply them, you don't know anything else.
your inputs are REQUEST and VAULT_INTERFACE.
examine USER input and respond with a JMESPath expression that satisfies REQUEST.
if you're not sure how to satisfy REQUEST, say "IDK".
you can only respond with a JMESPath expression or "IDK".`,

  user: (query: string) => `
I have a typscript object of type Vault[] called vaults.

REQUEST: ${query}

VAULT_INTERFACE
interface Vault {
  address: string;
  name: string;
  version: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  inception: number;
  details_management_fee: number;
  details_performance_fee: number;
  apy_gross_apr: number;
  apy_net_apy: number;
  tvl_tvl: number;
}

only respond in sql.
no conversation. 
no natural language.
`,

  vault_analytics_function: {
    name: 'get_yearn_vault_analytics',
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
  } as GptFunction
}
