import axios from 'axios'
import { OpenAI } from 'openai'
import { GptFunction, GptFunctionDef } from '..'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { transformYDaemonVaults } from '@/lib/types/vault'

const vaults = {
  humanName: 'Vaults',

  enabled: true,

  def: {
    name: 'search_yearn_vaults',
    description: 'find vaults and return their information',
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
    const result = await fetchVaults()
    return JSON.stringify(result)
  }
} as GptFunction

export default vaults

export async function fetchVaults() {
  if(!process.env.VERCEL_ENV) { // if dev
    console.warn('fetch mock vaults')
    return transformYDaemonVaults(await fetchMocks(), true)
  } else {
    return transformYDaemonVaults(await fetchYDaemon(), true)
  }
}

async function fetchYDaemon() {
  const url = `${process.env.YDAEMON}/137/vaults/all`
  const functionResponse = await axios(url)
  return functionResponse.data
}

async function fetchMocks() {
  const filePath = path.join(os.homedir(), 'git/yo/.local', 'vaults.json')
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
