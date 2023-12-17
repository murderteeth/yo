import { useEffect, useMemo, useState } from 'react'
import colors from 'tailwindcss/colors'

export default function Typer({ children }: { children?: string }) {
  const speed = 20
  const [index, setIndex] = useState(0)
  const length = useMemo(() => children?.length || 0, [children])
  const typed = useMemo(() => children?.slice(0, index) || '', [children, index])
  const [typing, setTyping] = useState(false)

  useEffect(() => { 
    let intervals = 0
    setTyping(true)
    const interval = setInterval(() => {
      setIndex(current => current + 1)
      intervals++
      if(intervals === length) {
        clearInterval(interval)
        setTyping(false)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [length, setIndex, setTyping])

  return <div>
    {typed}
    {typing && <Cursor />}
  </div>
}

export function Cursor({ char = '░' }) {
  const palette = [
    colors.white,
    colors.purple[300],
    colors.red[300],
    colors.green[300],
    colors.yellow[300],
    colors.blue[300],
    colors.violet[300],
    colors.orange[300]
  ]

  const [color, setColor] = useState(palette[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(palette[Math.floor(Math.random() * palette.length)])
    }, 250)
    return () => clearInterval(interval)
  }, [setColor])

  return <div style={{ color: color }} className={`inline animate-flicker`}>{char}</div>
}
