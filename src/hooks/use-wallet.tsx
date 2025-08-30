
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

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
      checkNetwork();
    } else {
      setAccount(null);
      disconnectWallet();
    }
  };
  
  const handleChainChanged = () => {
    // Reload the page to ensure the app is in sync with the new network
    window.location.reload();
  };

  const checkNetwork = async () => {
    const ethereum = getEthereum();
    if (!ethereum) return false;

    try {
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        setError('Incorrect network. Please switch to Sepolia.');
        await switchNetwork();
        return false;
      }
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError('Could not get network information.');
      return false;
    }
  };
  
  const switchNetwork = async () => {
      const ethereum = getEthereum();
      if (!ethereum) return;
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            setError("Sepolia network not found in your MetaMask. Please add it manually.");
        } else {
            setError("Failed to switch network. Please do it manually in MetaMask.");
        }
      }
  }

  const checkIfWalletIsConnected = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
        console.log('Metamask not detected.');
        return
    }

    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) return;

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
      ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
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

      const isCorrectNetwork = await checkNetwork();
      if (!isCorrectNetwork) {
          // The error is already set by checkNetwork/switchNetwork
          return;
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
