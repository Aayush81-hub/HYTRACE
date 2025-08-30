
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface WalletState {
  account: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  error: string | null
}

const WalletContext = createContext<WalletState | null>(null)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getEthereum = () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
      disconnectWallet();
    }
  };

  const checkIfWalletIsConnected = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
        console.log('Metamask not detected.');
        return
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        setAccount(accounts[0])
      } else {
        console.log('No authorized account found')
      }
    } catch (err) {
      setError('An error occurred while checking for wallet connection.')
    }
  }, [])

  useEffect(() => {
    checkIfWalletIsConnected()
    const ethereum = getEthereum();
     if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, [checkIfWalletIsConnected])
  
  const connectWallet = async () => {
    try {
      const ethereum = getEthereum();
      if (!ethereum) {
        setError('Metamask not detected. Please install the extension.')
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      setError(null)
    } catch (err) {
      setError('Failed to connect wallet.')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
  }

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, error }}>
      {children}
    </WalletContext.Provider>
  )
}
