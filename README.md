<p align="center">
  <img src="./public/favicon.svg" alt="CertChain Logo" width="96" height="96" />
</p>

<div align="center">

# CertChain

FHE-powered quota/certificate issuance and on-chain verification

[![Zama fhEVM](https://img.shields.io/badge/Zama%20fhEVM-v0.9.1-blue)](https://docs.zama.ai/fhevm)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)

**[Live Demo](https://certchain.vercel.app)** | **[Contract on Sepolia](https://sepolia.etherscan.io/address/0x50e9710E49991EBc748fdC7D95eE87c8bAcb55Cf)**

</div>

---

## Overview

CertChain provides an end-to-end solution for issuing and verifying quotas/permissions/certificates on-chain with full privacy using Fully Homomorphic Encryption (FHE).

### Use Cases

- **Airdrop Allocations** - Per-user limits with encrypted amounts
- **Ticketing/Eligibility** - Verifiable proofs without revealing limits
- **Membership Tiers** - Private allowance tracking and consumption
- **Private Gifts & Rewards** - Confidential token distribution

### Key Benefits

| Feature | Description |
|---------|-------------|
| **Verifiable** | Anyone can validate correctness of actions |
| **Computable** | Compare/add/update on ciphertext without decryption |
| **Minimal Disclosure** | Sensitive numeric data remains hidden |

---

## How FHE Works

### Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Issue   │────▶│  2. Store   │────▶│  3. Claim   │
│  Encrypted  │     │  On-Chain   │     │  Privately  │
│  Quota      │     │  Ciphertext │     │  Verified   │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. **Issuance** - Client encrypts quota amount using FHE, contract stores ciphertext
2. **Storage** - Encrypted values stored on-chain, no plaintext leakage
3. **Claiming** - Contract performs encrypted checks (`C_quota - C_spent >= C_req`)
4. **Output** - Events expose validity only, not actual amounts

### FHE Primitives (Zama fhEVM v0.9.1)

| Operation | Description |
|-----------|-------------|
| `FHE.fromExternal` | Convert external encrypted input to euint64 |
| `FHE.add` | Add two encrypted values |
| `FHE.sub` | Subtract encrypted values |
| `FHE.le` | Less than or equal comparison |
| `FHE.select` | Conditional selection based on encrypted boolean |
| `FHE.asEuint64` | Convert plaintext to encrypted uint64 |
| `FHE.allowThis` | Grant contract permission to access value |
| `FHE.allow` | Grant address permission to access value |

---

## Smart Contract

### Deployed Contract

| Network | Address | Explorer |
|---------|---------|----------|
| Sepolia | `0x50e9710E49991EBc748fdC7D95eE87c8bAcb55Cf` | [View](https://sepolia.etherscan.io/address/0x50e9710E49991EBc748fdC7D95eE87c8bAcb55Cf) |

### Contract Functions

```solidity
// Set allocation for a recipient (encrypted amount)
function setAllocation(address recipient, externalEuint64 encryptedAmt, bytes inputProof)

// Batch set allocations for multiple recipients
function batchSetAllocation(address[] recipients, externalEuint64 encryptedAmt, bytes inputProof)

// Claim from allocation (encrypted amount)
function claim(externalEuint64 encryptedAmt, bytes inputProof)

// View functions (returns encrypted values)
function getMyAllocation() returns (euint64)
function getMyClaimed() returns (euint64)
function getMyRemaining() returns (euint64)
```

### Events

- `AllocationSet(address indexed creator, address indexed recipient)`
- `AllocationBatchSet(address indexed creator, uint256 count)`
- `Claimed(address indexed user)`

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | UI Framework |
| TypeScript | 5.8 | Type Safety |
| Vite | 5.4 | Build Tool |
| wagmi | 2.19 | Ethereum Hooks |
| viem | 2.40 | Ethereum Client |
| RainbowKit | 2.2 | Wallet Connection |
| shadcn/ui | - | UI Components |
| Tailwind CSS | 3.4 | Styling |

### FHE Integration

| Package | Version | Purpose |
|---------|---------|---------|
| Zama fhEVM | 0.9.1 | FHE Smart Contracts |
| Relayer SDK | 0.3.0-5 | Client-side Encryption |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| Vitest | 4.0 | Test Runner |
| jsdom | 27.0 | DOM Environment |

---

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Sepolia ETH for gas

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/CertChain.git
cd CertChain

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## Usage Guide

### For Administrators (Creating Allocations)

1. Connect wallet to the platform
2. Navigate to "Create Allocation" page (`/admin`)
3. Enter recipient address and quota amount
4. Confirm transaction - amount encrypted automatically
5. View allocation history

### For Recipients (Claiming Quotas)

1. Connect wallet to the platform
2. Navigate to "Claim Quota" page (`/claim`)
3. Check your allocation status
4. Enter amount to claim and confirm transaction
5. Transaction validates encrypted amount on-chain

---

## Project Structure

```
CertChain/
├── contracts/              # Solidity contracts (fhEVM)
│   ├── src/               # Contract source files
│   └── scripts/           # Deployment scripts
├── public/                # Static assets
│   ├── favicon.svg        # App icon
│   └── demo—vedio.mp4     # Demo video
├── src/                   # Frontend source
│   ├── components/        # React components
│   │   ├── Layout/       # Header, Footer, etc.
│   │   └── ui/           # shadcn components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   │   ├── contracts.ts  # Contract addresses & ABIs
│   │   ├── fhe.ts        # FHE helpers
│   │   └── wagmi.ts      # Wallet config
│   └── pages/            # Route pages
├── tests/                 # Unit tests
│   ├── allocation.test.ts # Allocation logic tests
│   ├── fhe.test.ts       # FHE module tests
│   └── utils.test.ts     # Utility tests
└── package.json
```

---

## Security & Privacy

### Design Principles

- No plaintext storage of sensitive numeric fields
- Minimal disclosure in events to prevent inference
- Fail-closed design - claims fail if amount exceeds allocation
- Permission system for encrypted value access

### Recommendations

- Third-party audits before mainnet deployment
- Rate-limiting on critical paths
- Governance switches for emergency situations

---

## Roadmap

| Version | Features |
|---------|----------|
| v0.1 (Current) | Core create/claim with FHE, wallet integration |
| v0.2 | Enhanced events, role-based permissions |
| v0.3 | Third-party integrations, batch operations |
| v0.4 | Advanced FHE ops, performance optimization |

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with Zama fhEVM for privacy-preserving blockchain applications

</div>
