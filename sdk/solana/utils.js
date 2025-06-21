const RELAYER_URL = 'http://localhost:3001/relay';

export async function sendTransaction(signedTransaction) {
  const response = await fetch(RELAYER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transaction: signedTransaction.serialize().toString('base64'),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send transaction to relayer');
  }

  const { signature } = await response.json();
  return signature;
} 