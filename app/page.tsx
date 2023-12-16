'use client'

import Messenger, { MessageGram } from '@/components/Messenger'
import useKeypress from 'react-use-keypress'
import { RiSendPlane2Line } from 'react-icons/ri'
import { A, Button, Input } from '@/components/controls'
import { useBusy } from '@/hooks/useBusy'
import { useMessages } from '@/hooks/useMessages'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Connect from '@/components/controls/Connect'

function Panel({className, children}: {className?: string, children?: ReactNode}) {
  return <div className={`
    border border-zinc-900
    ${className}`}>
    {children}
  </div>
}

const AHOY_TIMEOUT = 3000
let AHOY_TIMEOUT_ID: NodeJS.Timeout | undefined
function useAhoy() {
  const { setBusy } = useBusy()
  const { setMessages } = useMessages()

  const ahoy = `
Yo!
I\'m the bot that helps you manage your assets with Yearn Finance
I can help you with things like:
• Checking your balances
• Deposits and withdrawals
• Managing your own vault 👀
lfg 🤘
`

  useEffect(() => {
    if(!AHOY_TIMEOUT_ID) {
      setBusy(true)
      setMessages(current => [...current, {role: 'assistant', contentType: 'busy'}])
    } else {
      clearTimeout(AHOY_TIMEOUT_ID)
    }

    AHOY_TIMEOUT_ID = setTimeout(() => {
      setMessages(current => {
        const message: MessageGram = { role: 'assistant', contentType: 'text', content: ahoy }
        const result = [...current.slice(0, -1), message]
        return result
      })
      setBusy(false)
    }, AHOY_TIMEOUT)
  }, [setBusy, setMessages])
}

export default function Lander() {
  const { busy, setBusy } = useBusy()
  const { messages, setMessages } = useMessages()
  const promptInput = useRef<HTMLInputElement>(null)
  const [prompterFocus, setPrompterFocus] = useState(false)
  const mediumBreakpoint = useMediaQuery({ minWidth: 768 })

  useAhoy()
  useEffect(() => promptInput.current?.focus(), [])

  const focusPrompter = useCallback(() => {
    if(!mediumBreakpoint) return
    setTimeout(() => promptInput.current?.focus(), 50)
  }, [mediumBreakpoint, promptInput])

  const onPrompt = useCallback(async () => {
    if(!promptInput.current) return
    let userPrompt = promptInput.current?.value

    if(!userPrompt) {
      const lastMessage = messages[messages.length - 1]
      if(lastMessage.contentType === 'options') {
        userPrompt = (lastMessage.content as string[])[0]
      } else {
        userPrompt = '..'
      }
    }

    setMessages(current => {
      return [...current, 
        {role: 'user', content: userPrompt}
      ]
    })

    setBusy(true)
    setMessages(current => [...current, {role: 'assistant', contentType: 'busy'}])

    try {
      const response = await fetch('/api/yo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: userPrompt })
      })

      if(response.status !== 200) throw new Error('Bad response')

      const { answer } = await response.json()

      setMessages(current => {
        return [...current.slice(0, -1), 
          {role: 'assistant', content: answer }
        ]
      })

    } catch(error) {
      console.error(error)
      setMessages(current => {
        return [...current.slice(0, -1), 
          {role: 'assistant', contentType: 'error' }
        ]
      })
    }

    setBusy(false)

    promptInput.current.value = ''
    focusPrompter()
  }, [promptInput, messages, setMessages, focusPrompter])

  useKeypress(['/'], () => focusPrompter())
  useKeypress(['Enter'], useCallback(() => {
    if(!prompterFocus) return
    onPrompt()
  }, [prompterFocus, onPrompt]))

  return <main className={`w-full h-full flex items-center justify-center`}>
    <Panel className={'hidden sm:block w-[30%] h-full p-8 flex flex-col items-start justify-start gap-12'}>
    </Panel>

    <div className={`relative w-full sm:w-[40%] h-full sm:pb-4 flex flex-col items-center justify-between gap-4`}>
      <Connect className={'absolute top-6 right-6 h-12'} />

      <Messenger />
      <div className={'relative w-full px-2 sm:px-6 py-4'}>
        <div className={'w-full flex items-center gap-2 sm:gap-4'}>
          <Input 
            ref={promptInput} 
            type={'text'} 
            disabled={busy}
            onFocus={() => setPrompterFocus(true)}
            onBlur={() => setPrompterFocus(false)}
            maxLength={280} 
            className={'grow w-64 h-12'} />
          <Button onClick={onPrompt} disabled={busy} className={'h-12'}>
            <RiSendPlane2Line size={20} />
          </Button>
        </div>
      </div>
    </div>

    <Panel className={'hidden w-[30%] h-full py-0 sm:flex flex-col items-center justify-end'}>
      <div className={'relative w-3/4 h-96 flex flex-col items-center'}>
        <div className={'absolute z-10 bottom-0 pb-4 flex flex-col items-center '}>
          <div className={'flex items-end gap-4'}>
            <div className={'font-bold text-8xl'}>{'Yo'}</div>
            <div className={'w-52 drop-shadow-lg'}>{`The bot that helps you manage your assets with Yearn Finance`}</div>
          </div>
          <div className={'py-2 flex items-center gap-6'}>
            <A href={'https://github.com/murderteeth/yo'} target={'_blank'} rel={'noreferrer'}>{'yo.git'}</A>
            <A href={'https://yearn.finance'} target={'_blank'} rel={'noreferrer'}>{'yearn.fi'}</A>
          </div>
        </div>
      </div>
    </Panel>
  </main>
}