import yo from '.'

const timeout = 60_000

test('answers knowledge questions', async () => {
  const result = await yo('what is yearn finance?')
  console.log(result)
  expect(result.includes('Yearn Finance')).toBeTruthy()
}, timeout)

test('answers analytical questions', async () => {
  const result = await yo('which vault has the highest TVL?')
  console.log(result)
  expect(result.toLowerCase().includes('weth')).toBeTruthy()
}, timeout)

test('IDKs anything else', async () => {
  const result = await yo('who is satoshi nakamoto?')
  expect(result).toBe('IDK')
}, timeout)