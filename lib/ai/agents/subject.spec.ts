import { fetchVaults } from '../functions/vaults'
import { next } from './subject'

it('Returns a vault', async () => {
  const vaults = await fetchVaults()
  const yvweth = vaults.find(vault => vault.symbol === 'yvWETH-A')
  const result = await next('The WETH-A vault (symbol: yvWETH-A) has a forward APR of 3.39%.')
  expect(result).toEqual([yvweth?.address])
})

it('Returns no vaults', async () => {
  const result = await next('dr phill was ill so he ate a pill. but then he was still ill.. so he ate another pill.')
  expect(result).toEqual([])
})
