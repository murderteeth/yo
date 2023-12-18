import React, { forwardRef, AnchorHTMLAttributes } from 'react'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const A = forwardRef<HTMLAnchorElement, AnchorProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={`
  decoration-4 decoration-dashed decoration-black underline underline-offset-8
  hover:text-red-500 hover:decoration-red-500
  active:text-red-700 active:decoration-red-700
  ${className}`}>
    {children}
  </a>
))

A.displayName = 'A'

export default A
