import { ethers } from "ethers";
import biconomy from "../relayer/biconomy";
import * as solana from './solana';

export async function sendEVMApiBiconomy(contractAddress, abi, functionName, args, userAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.populateTransaction[functionName](...args);
  return biconomy.sendTransaction(tx, userAddress);
}

export const solanaGasless = solana;
