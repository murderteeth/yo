'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

interface Subject {
	type: 'vault',
	id: string
}

interface Context {
	subjects: Subject[],
	setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
}

export const context = createContext<Context>({} as Context)

export const useSubjects = () => useContext(context)

export default function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([])
	return <context.Provider value={{ subjects, setSubjects }}>
		{children}
	</context.Provider>
}
