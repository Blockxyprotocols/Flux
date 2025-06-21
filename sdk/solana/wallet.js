import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';

export function getWallet(network = WalletAdapterNetwork.Devnet) {
  const wallets = [getPhantomWallet()];
  return wallets[0];
} 