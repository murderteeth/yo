'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react'

interface IBusy {
  busy: boolean,
  setBusy: React.Dispatch<React.SetStateAction<boolean>>
}

const	context = createContext({} as IBusy)

export const useBusy = () => useContext(context)

export default function BusyProvider({ children } : { children: ReactNode }) {
  const [busy, setBusy] = useState(false)
  return <context.Provider value={{ busy, setBusy }}>
    {children}
  </context.Provider>
}
