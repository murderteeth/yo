'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'
import { MessageGram } from '../components/Messenger'

export interface Messages {
	messages: MessageGram[],
	setMessages: React.Dispatch<React.SetStateAction<MessageGram[]>>
}

export const context = createContext<Messages>({} as Messages)

export const useMessages = () => useContext(context)

export default function MessagesProvider({children}: {children: ReactNode}) {
  const [messages, setMessages] = useState<MessageGram[]>([])
	return <context.Provider value={{messages, setMessages}}>
		{children}
	</context.Provider>
}
