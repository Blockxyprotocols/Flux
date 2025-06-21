import { Transaction, PublicKey } from '@solana/web3.js';
import { sendTransaction as sendRelayedTransaction } from './utils';
import { RELAYER_PUBLIC_KEY } from './config';

export async function sendGaslessTransaction(connection, wallet, transaction) {
  const relayerPublicKey = new PublicKey(RELAYER_PUBLIC_KEY);
  
  // Set the fee payer to be the relayer
  transaction.feePayer = relayerPublicKey;
  
  // Get a recent blockhash
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  
  // The wallet signs the transaction
  const signedTransaction = await wallet.signTransaction(transaction);

  // The signed transaction is sent to the relayer
  const signature = await sendRelayedTransaction(signedTransaction);

  // Return the signature of the relayed transaction
  return signature;
} 