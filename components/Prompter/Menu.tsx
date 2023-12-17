import { useMenu } from '@/hooks/useMenu'
import { Button } from '../controls'
import { AnimatePresence, motion } from 'framer-motion'
import { useBusy } from '@/hooks/useBusy'

function MenuOption({ onClick, disabled, children }: { onClick: (option: string) => void, disabled: boolean, children: string }) {
  return <Button onClick={() => onClick(children)} disabled={disabled}>{children}</Button>
}

export default function Menu({ onSelect }: { onSelect: (option: string) => void }) {
  const { menu } = useMenu()
  const { busy } = useBusy()

  function randomDelay() {
    return Math.random() * .25
  }

  return <div className="flex items-center gap-4">
    {menu.map((option) => <AnimatePresence key={option}>
      <motion.div key={option}
        transition={{ type: 'spring', stiffness: 2000, damping: 24, delay: randomDelay() }}
        initial={{y: 6, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: -6, opacity: 0}} >
        <MenuOption onClick={onSelect} disabled={busy}>{option}</MenuOption>
      </motion.div>
    </AnimatePresence>)}
  </div>
}
