require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Connection, Transaction, Keypair, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');

const app = express();
app.use(cors());
app.use(express.json());

// The relayer's secret key is loaded from environment variables
const RELAYER_SECRET_KEY = process.env.RELAYER_SECRET_KEY;
if (!RELAYER_SECRET_KEY) {
  throw new Error("RELAYER_SECRET_KEY not found in .env file");
}
const relayerKeypair = Keypair.fromSecretKey(bs58.decode(RELAYER_SECRET_KEY));

const connection = new Connection('https://api.devnet.solana.com');

app.post('/relay', async (req, res) => {
  try {
    const { transaction } = req.body;
    const transactionBuffer = Buffer.from(transaction, 'base64');
    const deserializedTx = Transaction.from(transactionBuffer);

    // The relayer, as the fee payer, partially signs the transaction
    deserializedTx.partialSign(relayerKeypair);

    const rawTransaction = deserializedTx.serialize();
    
    const signature = await connection.sendRawTransaction(rawTransaction);

    await connection.confirmTransaction(signature, 'confirmed');

    res.json({ signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to relay transaction' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Solana relayer listening on port ${PORT}`);
}); 