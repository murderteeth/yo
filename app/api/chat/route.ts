import { NextRequest, NextResponse } from 'next/server'
import chat, { Message } from '.'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { sleep } from 'openai/core.mjs'

const hello = `Yo!
I\'m the bot that helps you manage your assets with Yearn Finance
I can help you with things like:
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
    return NextResponse.json({ answer: hello })
  }

  const last_message = history[history.length - 1]
  if(last_message.role !== 'user') throw 'last_message.role != user'
  last_message.content = (last_message.content as string).trim().slice(0, 280)

  const answer = await chat(history)
  return NextResponse.json({ answer })
}
