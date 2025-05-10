import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Wallet = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      
      setAccount(accounts[0]);
      setBalance(ethers.utils.formatEther(balance));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
          setBalance('');
        }
      });
    }
  }, []);

  return (
    <div className="wallet-container">
      {!account ? (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected Account: {account}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Wallet; 