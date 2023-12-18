import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input } from '../controls'
import { useBusy } from '@/hooks/useBusy'
import { useMediaQuery } from 'react-responsive'
import { useMessages } from '@/hooks/useMessages'
import { RiSendPlane2Line } from 'react-icons/ri'
import useKeypress from 'react-use-keypress'
import Menu from './Menu'
import { useMenu } from '@/hooks/useMenu'
import { useSubjects } from '@/hooks/useSubjects'

let hello_timeout_handle: NodeJS.Timeout | undefined = undefined

export default function Prompter({ className }: { className?: string }) {
  const { busy, setBusy } = useBusy()
  const { messages, setMessages } = useMessages()
  const { setMenu } = useMenu()
  const { setSubjects } = useSubjects()
  const promptInput = useRef<HTMLInputElement>(null)
  const [prompterFocus, setPrompterFocus] = useState(false)
  const mediumBreakpoint = useMediaQuery({ minWidth: 768 })

  const focusPrompter = useCallback(() => {
    if(!mediumBreakpoint) return
    setTimeout(() => promptInput.current?.focus(), 50)
  }, [mediumBreakpoint, promptInput])

  const onPrompt = useCallback(async () => {
    if(!promptInput.current) return
    let userPrompt = promptInput.current?.value

    if(!userPrompt) {
      const lastMessage = messages[messages.length - 1]
      if(lastMessage && lastMessage.contentType === 'options') {
        userPrompt = (lastMessage.content as string[])[0]
      }
    }

    const history = userPrompt ? [
      ...messages.filter(m => m.contentType === 'text')
      .map(m => ({ role: m.role, content: m.content })), 
      { role: 'user', content: userPrompt }
    ] : []

    setMessages(current => {
      return userPrompt ? [...current, 
        { role: 'user', content: userPrompt }
      ] : current
    })

    setBusy(true)
    setMessages(current => [...current, {role: 'assistant', contentType: 'busy'}])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      })

      if(response.status !== 200) throw new Error('Bad response')

      const { next, menu, vaults } = await response.json()

      setMessages(current => {
        return [...current.slice(0, -1), 
          {role: 'assistant', content: next }
        ]
      })

      setMenu(menu)
      setSubjects(current => [...current, ...(vaults || []).map((v: any) => ({ type: 'vault', id: v }))])

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
  }, [promptInput, messages, setMessages, setMenu, setSubjects, setBusy, focusPrompter])

  useEffect(() => {
    if(hello_timeout_handle) { clearTimeout(hello_timeout_handle) }
    hello_timeout_handle = setTimeout(() => {
      if(messages.length === 0) {
        promptInput.current?.focus()
        onPrompt()
      }
    }, 50)
  }, [promptInput, messages, onPrompt])

  const onMenuSelect = useCallback((option: string) => {
    if(!promptInput.current) return
    promptInput.current.value = option
    onPrompt()
  }, [promptInput, onPrompt])

  useKeypress(['/'], () => focusPrompter())
  useKeypress(['Enter'], useCallback(() => {
    if(!prompterFocus) return
    onPrompt()
  }, [prompterFocus, onPrompt]))

  return <div className={`w-full flex flex-col gap-2 sm:gap-4 ${className}`}>
    <Menu onSelect={onMenuSelect} />
    <div className={`w-full flex items-center gap-2 sm:gap-4`}>
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
}
