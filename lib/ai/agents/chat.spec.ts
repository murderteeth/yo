import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { next } from './chat'

const timeout = 60_000

it.skip('answers knowledge questions', async () => {
  const history = [{ 
    role: 'user', content: 'what is yearn finance?' 
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  console.log(result)
  expect(result.includes('Yearn Finance')).toBeTruthy()
}, timeout)

it.skip('answers analytical questions', async () => {
  const history = [{ 
    role: 'user', content: 'which vault has the highest TVL?' 
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  console.log(result)
  expect(result.toLowerCase().includes('weth')).toBeTruthy()
}, timeout)

it('Answers questions about apy', async () => {
  const history = [{
    role: 'user', content: 'what is the apy of the yvWETH-A vault'
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  expect(result).not.toBe('IDK')
}, timeout)

it('IDKs anything else', async () => {
  const history = [{ 
    role: 'user', content: 'who is satoshi nakamoto?' 
  }] as ChatCompletionMessageParam[]
  const result = await next(history)
  expect(result).toBe('IDK')
}, timeout)
