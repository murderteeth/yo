import './globals.css'
import { Space_Mono as Font } from 'next/font/google'
import BusyProvider from '@/hooks/useBusy'
import MessagesProvider from '@/hooks/useMessages'

const font = Font({ weight: "400", subsets: ["latin"] })

export const metadata = {
  title: 'Yo',
  description: 'An ai powered chatbot that can help anyone use Yearn Finance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <html lang="en">
    <head>
      <title>{metadata.title}</title>
      <meta name='description' content={metadata.description} />
      <link rel="icon" href="/favicon.png" />
    </head>
    <body className={`relative w-screen h-screen ${font.className}`}>
      <div className={'absolute inset-0 z-10 text-white bg-transparent'}>
        <BusyProvider>
          <MessagesProvider>
            {children}
          </MessagesProvider>
        </BusyProvider>
      </div>
    </body>
  </html>
}