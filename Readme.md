# 🚀 SolanaWeb3 Toolkit | Next.js + Solana

A modern, user-friendly toolkit for Solana blockchain interactions built with Next.js 14. Seamlessly create tokens, manage airdrops, transfer SOL, and more - all with a beautiful dark-themed UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)

## ✨ Features

- 🏗️ **Token Launchpad**: Create and deploy custom tokens without coding
- 💸 **Bulk Airdrop**: Efficiently distribute SOL to multiple wallets
- 💱 **Transfer System**: Seamless SOL transfers across the network
- 💰 **Balance Checker**: Real-time SOL balance monitoring
- 📝 **Message Signing**: Secure wallet signature verification
- 🎨 **NFT Creation**: Mint unique digital assets (Coming Soon)

## 🛠️ Tech Stack

- Next.js 14
- Solana Web3.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- Solana CLI (optional)
- A Solana wallet (Phantom recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/solana-web3-toolkit.git
cd solana-web3-toolkit
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 Usage

### Token Launchpad

- Connect your Solana wallet
- Fill in token details (name, symbol, supply)
- Deploy with one click

### Airdrop Feature

- Upload wallet addresses (CSV supported)
- Set SOL amount per wallet
- Execute batch distribution

### Transfer System

- Enter recipient's wallet address
- Specify SOL amount
- Confirm transaction

### Balance Checker

- Enter wallet address
- View real-time SOL balance
- Track transaction history

### Message Signing

- Type your message
- Sign with connected wallet
- Verify signatures

## 🔐 Security

- All transactions require wallet confirmation
- Client-side signature verification
- No private keys stored
- Secure RPC endpoints
