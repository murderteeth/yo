'use client'

import Messenger from '@/components/Messenger'
import { A } from '@/components/controls'
import { ReactNode, useCallback } from 'react'
import Connect from '@/components/controls/Connect'
import Prompter from '@/components/Prompter'
import Yo from '@/components/Yo'
import Subjects from '@/components/Subjects'

function Panel({className, children}: {className?: string, children?: ReactNode}) {
  // bg-black/20 border border-zinc-900/40
  return <div className={`
    ${className}`}>
    {children}
  </div>
}

export default function Lander() {
  return <main className={`w-full h-full flex items-center justify-center`}>
    <Panel className={'hidden sm:block w-[30%] h-full p-8 flex flex-col items-start justify-start gap-12'}>
    </Panel>

    <div className={`relative w-full sm:w-[40%] h-full sm:pb-4 flex flex-col items-center justify-between gap-4`}>
      <Connect className={'absolute top-6 right-6 h-12'} />
      <Messenger />
      <div className={'relative w-full px-2 sm:px-6 py-4'}>
        <Prompter />
      </div>
    </div>

    <Panel className={'hidden w-[30%] h-full px-16 py-0 sm:flex flex-col items-center justify-end'}>
      <div>
        <Subjects />
      </div>
      <div className={'relative w-3/4 h-96 flex flex-col items-center'}>
        <div className={'absolute z-10 bottom-0 pb-4 flex flex-col items-center'}>
          <div className={'flex items-end gap-4'}>
            <Yo />
            <div className={'w-52 drop-shadow-lg'}>{`The bot that helps you manage your assets with Yearn Finance`}</div>
          </div>
          <div className={'py-2 flex gap-6'}>
            <A href={'https://github.com/murderteeth/yo'} target="_blank" rel="noopener noreferrer">yo.git</A>
            <A href={'https://yearn.finance'} target="_blank" rel="noopener noreferrer">yearn.fi</A>
          </div>
        </div>
      </div>
    </Panel>
  </main>
}
