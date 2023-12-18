'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

interface Context {
	menu: string[],
	setMenu: React.Dispatch<React.SetStateAction<string[]>>
}

export const context = createContext<Context>({} as Context)

export const useMenu = () => useContext(context)

export default function MenuProvider({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState<string[]>([])
	return <context.Provider value={{ menu, setMenu }}>
		{children}
	</context.Provider>
}
