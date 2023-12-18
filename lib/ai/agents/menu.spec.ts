import { DEFAULT_MENU, next } from './menu'

it('Returns default menu', async () => {
  const result = await next('Can you handle the yield, anon? We can browse vaults, make deposits, check balances, and design vaults!')
  expect(result).toEqual(DEFAULT_MENU)
})
