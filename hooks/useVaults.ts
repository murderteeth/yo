'use client'

import { transformYDaemonVaults } from '@/lib/types/vault'
import useSWR from 'swr'

export function useVaults() {
  const { data } = useSWR(
    'https://ydevmon.ycorpo.com/137/vaults/all',
    (...args) => fetch(...args, { method: 'GET' }).then(res => res.json()),
    { refreshInterval: 30_000 }
  )
  return { vaults: transformYDaemonVaults(data || []) }
}
