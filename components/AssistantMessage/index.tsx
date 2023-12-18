import React, { useCallback, useMemo } from 'react'
import { Button } from '../controls'
import { useMessages } from '../../hooks/useMessages'
import { MessageGram } from '../Messenger'
import Typer, { Cursor } from '../controls/Typer'

const errorMessage = 'An arcane glitch befalls our adventure! Gather your wits, try again!'

export default function AssistantMessage({message, latestMessage}: {message: MessageGram, latestMessage: boolean}) {
  const {setMessages} = useMessages()

  const contentType = useMemo(() => {
    return message.contentType || 'text'
  }, [message])

  const factory = useCallback((component: string) => {
    switch(component) {
      default:
        return <>{'component' + component}</>
    }
  }, [])

  const onOption = useCallback((option: string) => {
    setMessages(current => [...current, {role: 'user', content: option}])
  }, [setMessages])

  return <div className={'w-64 sm:w-96 flex flex-col gap-4'}>
    {contentType === 'text' && <Typer className="whitespace-pre-line">{message.content as string}</Typer>}

    {contentType === 'options' && (message.content as string[]).map((option, index) => {
      return <Button disabled={!latestMessage} key={index} onClick={() => onOption(option)}>{option}</Button>
    })}

    {contentType === 'component' && <div>
      {factory(message.content as string)}
    </div>}

    {contentType === 'busy' && <Cursor />}

    {contentType === 'error' && <div className={'text-red-700'}>{errorMessage}</div>}
  </div>
}
