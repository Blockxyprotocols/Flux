# Flux SDK

## Overview
Flux SDK enables gasless transactions for Web3 applications, allowing users to interact with blockchain networks without paying gas fees. It supports both EVM chains (like Ethereum and Polygon) and Solana.

For EVM chains, it integrates with meta-transaction relayers like Biconomy. For Solana, it uses a custom relayer to sponsor transactions.

## Features
- Gasless transactions using meta-transactions (EVM) or a relayer (Solana)
- Supports Ethereum, Polygon, and other EVM-compatible chains
- Supports Solana (Devnet)
- Easy frontend integration
- NPM package for simplified deployment

## Folder Structure
```
flux-sdk/
│── contracts/          # Smart contracts for relaying transactions (EVM)
│── relayer/            # Biconomy client configuration (EVM)
│── solana-relayer/     # Node.js service for relaying Solana transactions
│── sdk/                # JavaScript SDK for frontend integration
│   ├── solana/         # Solana-specific SDK modules
│   └── ...
│── dashboard/          # Admin dashboard with GraphQL support
│── docs/               # Documentation
│── frontend/           # Example frontend integration
│── package.json        # NPM configuration
│── README.md           # SDK overview
```

## Installation
Clone the repository and install dependencies:
```sh
npm install
```

## Usage

### EVM (Ethereum, Polygon, etc.)

Import the SDK in your JavaScript application:
```js
import { sendEVMApiBiconomy } from 'flux-sdk/sdk';

// ... connect to wallet ...

// Example of calling a smart contract
sendEVMApiBiconomy(contractAddress, abi, 'functionName', [arg1, arg2], userAddress);
```

### Solana

Import the Solana part of the SDK:
```js
import { solanaGasless } from 'flux-sdk/sdk';
import { Connection, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

// ... connect to solana wallet (e.g. Phantom) ...

const connection = new Connection('https://api.devnet.solana.com');
const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: otherPublicKey,
    lamports: 1000,
  })
);

const signature = await solanaGasless.sendGaslessTransaction(connection, wallet, transaction);
console.log('Transaction signature:', signature);
```

## Running the Solana Relayer
To enable gasless transactions on Solana, you need to run the Solana relayer.

First, you need to configure the relayer with a secret key. Create a `.env` file in the `solana-relayer` directory with the following content:
```
RELAYER_SECRET_KEY=YOUR_SOLANA_SECRET_KEY_IN_BS58_FORMAT
```
You can generate a new keypair using the Solana CLI: `solana-keygen new`. Make sure your relayer account has enough SOL to pay for transaction fees.

Navigate to the root directory and start the relayer service:
```sh
npm run start:solana-relayer
```

## Frontend Example
Open `frontend/index.html` in a browser to test the gasless transaction flow. You will need to update it to include Solana examples.

## License
MIT License.
