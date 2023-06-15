import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // const { source } = await request.json()
  // if(!source) throw '!source'

  return NextResponse.json({ status: 'queued' })
}
