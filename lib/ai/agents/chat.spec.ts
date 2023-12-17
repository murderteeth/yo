import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { next } from './chat'

const timeout = 60_000

test.skip('answers knowledge questions', async () => {
  const history = [{ 
    role: 'user', content: 'what is yearn finance?' 
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  console.log(result)
  expect(result.includes('Yearn Finance')).toBeTruthy()
}, timeout)

test.skip('answers analytical questions', async () => {
  const history = [{ 
    role: 'user', content: 'which vault has the highest TVL?' 
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  console.log(result)
  expect(result.toLowerCase().includes('weth')).toBeTruthy()
}, timeout)

test('IDKs anything else', async () => {
  const history = [{ 
    role: 'user', content: 'who is satoshi nakamoto?' 
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  expect(result).toBe('IDK')
}, timeout)
