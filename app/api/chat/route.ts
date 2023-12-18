import { NextRequest, NextResponse } from 'next/server'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { sleep } from 'openai/core.mjs'
import { next } from '@/lib/ai/agents/chat'
import { next as nextMenu } from '@/lib/ai/agents/menu'
import { next as nextVaults } from '@/lib/ai/agents/subject'
import { DEFAULT_MENU } from '@/lib/ai/agents/menu'

const hello = `Yo!
I\'m the bot that helps you manage your assets with Yearn Finance. I can help you with things like:

• Checking your balances
• Deposits and withdrawals
• Managing your own vault 👀

lfg 🤘
`

export async function POST(request: NextRequest) {
  const { history } = await request.json() as { history?: ChatCompletionMessageParam[] }
  if(!history) throw '!history'

  if(history.length === 0) {
    await sleep(Math.random() * 2000 + 2000)
    return NextResponse.json({ next: hello, menu: DEFAULT_MENU })
  }

  const last_message = history[history.length - 1]
  if(last_message.role !== 'user') throw 'last_message.role != user'
  last_message.content = (last_message.content as string).trim().slice(0, 280)

  const assistantResponse = await next(history)
  const agentResponses = await Promise.all([await nextMenu(assistantResponse), await nextVaults(assistantResponse)])
  const menu = agentResponses[0]
  const vaults = agentResponses[1]

  return NextResponse.json({ next: assistantResponse, menu, vaults })
}
