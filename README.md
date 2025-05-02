# SuiDuBai Real

## Project Overview

SuiDuBai Real is a decentralized real estate investment platform that tokenizes the annual profits of premium Dubai properties, providing global investors with low barrier access to the booming Dubai real estate market. Built on the Sui blockchain, the platform enables users to invest in property profit tokens, stake their tokens for additional rewards, and participate in protocol governance.

## Problem Statement

Traditional real estate investment in Dubai:
- Requires significant capital outlays (minimum $100,000+)
- Involves complex legal and regulatory processes
- Lacks liquidity and flexibility
- Is often inaccessible to international investors

## Solution

SuiDuBai Real democratizes access to Dubai's premium real estate market by:
- Tokenizing annual property profits rather than the property itself
- Providing low minimum investment requirements
- Distributing annual profits directly to token holders in USDC
- Creating a liquid secondary market for tokens
- Ensuring transparency through on-chain verification of property performance

## Key Features

### Property Marketplace
- Browse and purchase tokens representing annual profits from various Dubai properties
- Filter properties by location, type, and expected yield
- View detailed property information and performance history
- Purchase tokens directly with wallet integration

### Portfolio Management
- Track all your property investments in one dashboard
- Monitor total value and performance over time
- View upcoming profit distributions
- Analyze historical yield performance

### Staking
- Stake RWAS platform tokens to earn additional rewards
- Participate in governance with staked tokens
- Claim rewards on a regular schedule
- View staking history and performance

### Governance
- Vote on protocol improvement proposals
- Propose changes to platform parameters
- Participate in property selection decisions
- Transparent on-chain voting process

## Technical Architecture

### Frontend
- Next.js 13 (React framework)
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI component library
- Recharts for data visualization

### Blockchain Integration
- Sui blockchain for smart contracts
- Mysten Labs' dapp-kit for wallet integration
- Sui.js for blockchain interaction
- Testnet deployment with plans for mainnet launch

### Smart Contracts (Move)
- Property tokenization contracts
- Staking and rewards distribution
- Governance voting mechanism
- Treasury management

### Authentication & Security
- Wallet-based authentication
- Smart contract audits
- Role-based access controls
- Secure transaction handling

## User Flow

1. Connect Sui-compatible wallet (Suiet, Sui Wallet, etc.)
2. Browse available properties in the marketplace
3. Purchase property tokens with SUI or USDC
4. Track investments in portfolio dashboard
5. Stake tokens to earn rewards and participate in governance
6. Vote on proposals and receive annual profit distributions in USDC

## Future Roadmap

- Expand to other prime real estate markets (London, New York, Singapore)
- Implement fractional NFTs for property ownership
- Introduce lending and borrowing against tokenized property assets
- Add multi-chain support
- Develop mobile application for iOS and Android

## Hackathon Achievements

- Fully functional property marketplace with filtering and discovery
- Complete portfolio tracking and visualization
- Operational staking and governance modules
- Seamless wallet integration with the Sui blockchain
- Beautiful and intuitive user interface

## Build Instructions

To build the project locally:

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm run dev

# Build for production
pnpm run build
```

### Known Build Issues

If you encounter build errors, here are the solutions to common issues:

1. **TypeScript Errors**: We've fixed several TypeScript errors by adding proper types to array mapping functions. If you encounter more, please add explicit typing.

2. **Wallet API Compatibility**: The Sui wallet API may have compatibility issues. We've included a fallback mechanism for transaction handling.

3. **UI Component Errors**: Some UI components like Progress may cause build errors. We've replaced problematic instances with custom implementations.

4. **Next.js Configuration**: We're using static export (`output: 'export'`) in next.config.js to improve build compatibility.

## Team

[Add team member information here]

## Demo

[Add demo link here]

## Repository

https://github.com/yourusername/SuiDuBaiReal 