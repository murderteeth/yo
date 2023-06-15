import { GptFunction } from '../ai'

export const prompts = {
  system: `you are a savant at using the AlaSQL npm package 
to write sql queries to get data form json objects.
you only know how to write sql queries for AlaSQL, you don't know anything else.
your inputs are REQUEST and VAULT_INTERFACE.
examine USER input and respond with an AlaSQL sql query that satisfies REQUEST.

in your SELECT clause, only select address and any other properties that appear elsewhere in your query.
in your FROM clause, you must use "?" to indicate the table name.
in your ORDER BY clause, you must use a number instead of a property name to specify column, the number corresponds to the property's position in the SELECT clause, starting at 1.

if you're not sure how to satisfy REQUEST, say "IDK".
you can only respond with sql or "IDK".`,

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
    description: 'answers analytical questions about Yearn Finance vaults',
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
