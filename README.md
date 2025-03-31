# Flux SDK

## Overview
Flux SDK enables gasless transactions for Web3 applications, allowing users to interact with blockchain networks without paying gas fees. It integrates with meta-transaction relayers like Biconomy.

## Features
- Gasless transactions using meta-transactions
- Supports Ethereum, Polygon, and other EVM-compatible chains
- Easy frontend integration
- NPM package for simplified deployment

## Folder Structure
```
flux-sdk/
│── contracts/          # Smart contracts for relaying transactions
│── relayer/            # Node.js service for relaying transactions
│── sdk/                # JavaScript SDK for frontend integration
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
Import the SDK in your JavaScript application:
```js
import { sendGaslessTransaction } from 'flux-sdk/sdk';
```

## Running the Relayer
Navigate to the `relayer` directory and start the relayer service:
```sh
node index.js
```

## Frontend Example
Open `frontend/index.html` in a browser to test the gasless transaction flow.

## License
MIT License.
