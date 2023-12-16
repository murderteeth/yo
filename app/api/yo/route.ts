import { NextRequest, NextResponse } from 'next/server'
import yo from '.'

export async function POST(request: NextRequest) {
  const { question } = await request.json()
  if(!question) throw '!question'
  const safe_question = question.slice(0, 180)
  const answer = await yo(safe_question)
  return NextResponse.json({ answer })
}