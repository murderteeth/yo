import { useSubjects } from '@/hooks/useSubjects'
import { useVaults } from '@/hooks/useVaults'
import { networks } from '@/lib/networks'
import { Vault } from '@/lib/types/vault'
import { useMemo } from 'react'
import Markdown from 'react-markdown'
import { A, Button } from '../controls'
import Image from 'next/image'
import { fEvmAddress, fPercent, fUSD } from '@/lib/format'

function sanitizeDescription(description: string) {
  return description
    .replace(/<br\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
}

function explorerUrl(vault: Vault) {
  const network = networks(137)
  return `${network.blockExplorers.default.url}/address/${vault.address}`
}

function formatPercent(value: number) {
  return value * 100
}

export default function Subjects() {
  const { vaults } = useVaults()
  const { subjects } = useSubjects()

  const filter = useMemo(() => {
    return vaults
    .filter(v => subjects.find(s => s.id === v.address))
    .map(v => ({ ...v, description: sanitizeDescription(v.description) }))
  }, [vaults, subjects])

  return <div className="flex flex-col gap-4">
    {filter.map(vault => <div key={vault.address} className={`
      p-4 flex flex-col gap-4
      border-4 border-black rounded`}>
      <div className="flex items-center gap-2">
        <Image src={vault.icon} alt={vault.name} width={32} height={32} />
        <div className="grow flex items-center justify-between">
          <div className="text-3xl">{vault.name}</div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-sky-500">polygon</div>
            <A href={explorerUrl(vault)} target="_blank" rel="noopener noreferrer">{fEvmAddress(vault.address)}</A>
          </div>
        </div>
      </div>

      <div className="my-3 px-4 flex items-end justify-between">
        <div className="flex gap-2">
          <div className="font-bold text-4xl">{fPercent(vault.apr)}</div>
          <div className="text-xs">APR</div>
        </div>
        <div className="flex gap-2">
          <div className="font-bold text-4xl">{fUSD(vault.tvl, { hideUsd: true })}</div>
          <div className="text-xs">TVL</div>
        </div>
      </div>

      <Markdown>{vault.description}</Markdown>

      <div className="flex justify-end">
        <Button>Deposit</Button>
      </div>
    </div>)}
  </div>
}
