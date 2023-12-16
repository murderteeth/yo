import chat from '.'

const timeout = 60_000

test.skip('answers knowledge questions', async () => {
  const result = await chat('what is yearn finance?')
  console.log(result)
  expect(result.includes('Yearn Finance')).toBeTruthy()
}, timeout)

test.skip('answers analytical questions', async () => {
  const result = await chat('which vault has the highest TVL?')
  console.log(result)
  expect(result.toLowerCase().includes('weth')).toBeTruthy()
}, timeout)

test('IDKs anything else', async () => {
  const result = await chat('who is satoshi nakamoto?')
  expect(result).toBe('IDK')
}, timeout)
