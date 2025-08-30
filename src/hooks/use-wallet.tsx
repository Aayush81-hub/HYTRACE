
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { GHC_CONTRACT_ADDRESS, GHC_CONTRACT_ABI } from '@/lib/blockchain'

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

interface WalletState {
  account: string | null
  signer: ethers.Signer | null
  contract: ethers.Contract | null
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
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<string | null>(null)

  const getEthereum = () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  }
  
  const updateSignerAndContract = async (ethereum: any) => {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      
      const contract = new ethers.Contract(GHC_CONTRACT_ADDRESS, GHC_CONTRACT_ABI, signer);
      setContract(contract);
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      updateSignerAndContract(getEthereum());
      checkNetwork();
    } else {
      disconnectWallet();
    }
  };
  
  const handleChainChanged = () => {
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
        await updateSignerAndContract(ethereum);
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
          return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      await updateSignerAndContract(ethereum);
      setError(null)
    } catch (err) {
      setError('Failed to connect wallet.')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setSigner(null)
    setContract(null);
  }

  return (
    <WalletContext.Provider value={{ account, signer, contract, connectWallet, disconnectWallet, error }}>
      {children}
    </WalletContext.Provider>
  )
}
