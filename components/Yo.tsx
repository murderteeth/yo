import { useMenu } from '@/hooks/useMenu'
import { useMessages } from '@/hooks/useMessages'
import { useSubjects } from '@/hooks/useSubjects'
import { useCallback, HTMLAttributes, forwardRef } from 'react'
import { useLongPress } from 'use-long-press'

type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string
  disabled?: boolean
}

const Yo = forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
  const { setMessages } = useMessages()
  const { setMenu } = useMenu()
  const { setSubjects } = useSubjects()

  const onLongPress = useCallback(() => {
    if(props.disabled == true) return
    setMessages([])
    setMenu([])
    setSubjects([])
  }, [props, setMessages, setMenu, setSubjects])

  const bindClicks = useLongPress(onLongPress, {
    onCancel: useCallback(() => {
      if(props.disabled == true) return;
    }, [props])
  })

  return <div {...bindClicks()} ref={ref} {...props} className={`
    font-bold text-8xl
    ${className}`}>Yo</div>
})

Yo.displayName = 'Yo'

export default Yo
