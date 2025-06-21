require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';

// In-memory store for nonces
const nonces = {};

// EVM Authentication
app.post('/auth/evm/request-message', (req, res) => {
    const { address } = req.body;
    const nonce = Math.floor(Math.random() * 1000000).toString();
    nonces[address] = nonce;
    const message = `Sign this message to authenticate: ${nonce}`;
    res.json({ message });
});

app.post('/auth/evm/verify-signature', async (req, res) => {
    const { address, signature } = req.body;
    const nonce = nonces[address];
    if (!nonce) {
        return res.status(400).json({ error: 'Invalid address or no nonce requested' });
    }

    const message = `Sign this message to authenticate: ${nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        delete nonces[address]; // Nonce should be used only once
        const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Signature verification failed' });
    }
});

// Solana Authentication
app.post('/auth/solana/request-message', (req, res) => {
    const { publicKey } = req.body;
    const nonce = Math.floor(Math.random() * 1000000).toString();
    nonces[publicKey] = nonce;
    const message = `Sign this message to authenticate: ${nonce}`;
    res.json({ message });
});

app.post('/auth/solana/verify-signature', (req, res) => {
    const { publicKey, signature } = req.body;
    const nonce = nonces[publicKey];
    if (!nonce) {
        return res.status(400).json({ error: 'Invalid public key or no nonce requested' });
    }
    
    const message = `Sign this message to authenticate: ${nonce}`;
    const messageBytes = new TextEncoder().encode(message);
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);

    const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (verified) {
        delete nonces[publicKey];
        const token = jwt.sign({ publicKey }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Signature verification failed' });
    }
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
}); 