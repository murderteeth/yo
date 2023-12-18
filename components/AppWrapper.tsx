'use client'

import BusyProvider from '@/hooks/useBusy'
import MenuProvider from '@/hooks/useMenu'
import MessagesProvider from '@/hooks/useMessages'
import SubjectsProvider from '@/hooks/useSubjects'
import { RainbowKitProvider, darkTheme, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { polygon } from 'viem/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [polygon], [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: process.env.WALLETCONNECT_PROJECT_NAME || '',
  projectId: process.env.WALLETCONNECT_PROJECT_ID || '',
  chains
})

const wagmiConfig = createConfig({ autoConnect: true, connectors, publicClient })

export default function AppWrapper ({ children }: { children: React.ReactNode }) {
  return <BusyProvider>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <MessagesProvider>
          <MenuProvider>
            <SubjectsProvider>
              {children}
            </SubjectsProvider>
          </MenuProvider>
        </MessagesProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </BusyProvider>
}
