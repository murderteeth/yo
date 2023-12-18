
export interface Vault {
  address: `0x${string}`
  name: string
  symbol: string
  icon: string
  decimals: number
  description: string
  token: {
    address: string
    name: string
    symbol: string
  }
  tvl: number
  apr: number
  forwardapr: number
  strategies: number
}

export function transformYDaemonVaults(ydaemonVaults: any[], skipLongFields = false): Vault[] {
  return ydaemonVaults.map((v: any) => ({
    address: v.address,
    name: v.display_name,
    symbol: v.display_symbol,
    icon: v.icon,
    decimals: v.decimals,
    description: skipLongFields ? '' : v.description,
    token: {
      address: v.token.address,
      name: v.token.display_name,
      symbol: v.token.display_symbol
    },
    tvl: v.tvl.tvl,
    apr: v.apr.netAPR,
    forwardapr: v.apr.forwardAPR.netAPR,
    strategies: v.strategies.length
  }))
}
