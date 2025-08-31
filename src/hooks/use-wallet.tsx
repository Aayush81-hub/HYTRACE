
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
      setError(null)
      const provider = new ethers.BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      if(network.chainId !== BigInt(SEPOLIA_CHAIN_ID)){
          setError("Incorrect network. Please switch to Sepolia.");
          setAccount(null);
          setSigner(null);
          setContract(null);
          await switchNetwork();
          return;
      }
      
      const signer = await provider.getSigner();
      const userAccount = await signer.getAddress();
      setSigner(signer);
      setAccount(userAccount);
      
      const contract = new ethers.Contract(GHC_CONTRACT_ADDRESS, GHC_CONTRACT_ABI, signer);
      setContract(contract);
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
        const ethereum = getEthereum();
        if(ethereum) updateSignerAndContract(ethereum);
    } else {
      disconnectWallet();
    }
  };
  
  const handleChainChanged = () => {
    window.location.reload();
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

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        await updateSignerAndContract(ethereum);
      } else {
        console.log('No authorized account found')
      }
    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'An error occurred while checking for wallet connection.';
      setError(errorMessage);
      console.error(err);
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
      
      await ethereum.request({ method: 'eth_requestAccounts' })
      await updateSignerAndContract(ethereum);

    } catch (err: any) {
      const errorMessage = err.reason || err.message || 'Failed to connect wallet.';
      setError(errorMessage);
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
