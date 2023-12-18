import axios from 'axios'
import { OpenAI } from 'openai'
import { GptFunction, GptFunctionDef } from '..'
import path from 'path'
import fs from 'fs'

const vaults = {
  humanName: 'Vaults',

  enabled: true,

  def: {
    name: 'search_yearn_vaults',
    description: 'returns a list of vaults',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'criteria to search for vaults. it may just be the word "vaults"'
        }
      },
      required: ['query']
    }
  } as GptFunctionDef,

  handler: async function(call: OpenAI.Chat.ChatCompletionMessage.FunctionCall) {
    if(!call.arguments) throw '!call.arguments'
    const result = fetchVaults()
    return JSON.stringify(result)
  }
} as GptFunction

export default vaults

export async function fetchVaults() {
  if(process.env.NODE_ENV === 'development') {
    return transformYDaemonVaults(await fetchMocks())
  } else {
    return transformYDaemonVaults(await fetchYDaemon())
  }
}

async function fetchYDaemon() {
  const url = `${process.env.YDAEMON}/137/vaults/all`
  const functionResponse = await axios(url)
  return functionResponse.data
}

async function fetchMocks() {
  const filePath = path.join(path.dirname(__filename), '../../.local', 'vaults.json')
  if(!fs.existsSync(filePath)) throw `!fs.existsSync(filePath) ${filePath}. Try\n\n${MAKE_MOCKS}\n\n`
  const fileData = await fs.promises.readFile(filePath, 'utf8')
  return JSON.parse(fileData)
}

const MAKE_MOCKS = `
import fs from 'fs'
import path from 'path'

async function main() {
  const url = \`${process.env.YDAEMON}/137/vaults/all\`
  const json = await (await fetch(url)).json()
  const filePath = path.join('.local', 'vaults.json')
  await fs.promises.writeFile(filePath, JSON.stringify(json))
}

main()
`

function transformYDaemonVaults(ydaemonVaults: any[]) {
  return ydaemonVaults.map((v: any) => ({
    address: v.address,
    name: v.display_name,
    symbol: v.display_symbol,
    icon: v.icon,
    description: v.description,
    decimals: v.decimals,
    token: {
      address: v.token.address,
      name: v.token.display_name,
      symbol: v.token.display_symbol
    },
    tvl: v.tvl.tvl,
    apr: v.apr.netAPR,
    forwardapr: v.apr.forwardAPR.netAPR,
    strategies: v.strategies.length
  }))
}
