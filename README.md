<p align="center">
  <img src="./public/favicon.svg" alt="CertChain Logo" width="96" height="96" />
</p>

<div align="center">

# CertChain

FHE-powered quota/certificate issuance and on-chain verification

</div>

---

## 1. Overview (What & Why)

CertChain provides an end-to-end solution for issuing and verifying quotas/permissions/certificates on-chain. Typical use cases:

- Airdrop allocations with per-user limits (e.g., each address can claim X)
- Ticketing/eligibility proofs (verifiable without revealing personal limits)
- Web3 membership tiers with allowance tracking (consumption/accumulation)

Unlike plain-text storage, CertChain stores and computes over encrypted amounts using Fully Homomorphic Encryption (FHE), achieving verifiable, computable, and minimal-disclosure properties.

Key benefits:

- Verifiable: anyone can validate the correctness of actions
- Computable: compare/add/update on ciphertext without revealing plaintext
- Minimal disclosure: keep sensitive numeric data hidden

---

## 2. How FHE Works Here (Flow)

1) Issuance
- Client/backend provides encrypted allowance `C_quota`
- Contract stores `C_quota` without plaintext leakage

2) Claim/Spend
- User submits required parameters (minimal plaintext + ciphertext)
- Contract performs encrypted checks via fhEVM primitives (e.g., `C_quota - C_spent >= C_req`)
- If valid, update on-chain ciphertext state (`C_spent' = C_spent + C_req`)

3) Outputs
- Events/states expose validity only; not the actual amounts

Common primitives (via Zama fhEVM; see `src/lib/fhe.ts` and contracts):

- Encrypted add/subtract
- Encrypted compare
- Encrypted select (conditional)

These enable allowance verification and updates without decryption.

---

## 3. Smart Contract Architecture

Main entry: `contracts/src/CertChain.sol`

Modules:

- Quota/Certificate Management
  - Store user encrypted quotas and states
  - Create/update/spend interfaces
- Verification & Execution
  - Encrypted comparisons and updates on-chain
  - Monotonicity guarantees (no underflow/invalid states)
- Events & Observability
  - Minimal, privacy-preserving events for UI/analytics

Security boundaries:

- No plaintext storage of sensitive numeric fields
- Minimal disclosure in events to avoid inference
- Role-based control for issuer/admin (extensible)

Deployment & artifacts:

- `contracts/scripts/deploy.js` — deployment routine
- `contracts/artifacts` — compiled outputs
- `contracts/deployment.json` — last deployment info

Tests: see `tests/` (e.g., `fhe.test.ts`, `allocation.test.ts`).

---

## 4. System Architecture (Stack)

Frontend (`src/`):

- React + Vite + TypeScript
- UI: shadcn-ui, Tailwind CSS
- Wallet & chain: RainbowKit + wagmi + viem
- FHE helpers: `src/lib/fhe.ts`

Contracts/Tooling:

- Solidity (fhEVM-compatible)
- Hardhat project under `contracts/`
- Zama fhEVM primitives (add/compare/select)

Run/Config:

- Network/addresses: see `src/lib/wagmi.ts` and `contracts/deployment.json`

```bash
npm i
npm run dev
```

Build/preview:

```bash
npm run build
npm run preview
```

---

## 5. Usage Guide

1) Admin issues quotas/certificates
- Use `/admin` to create entries and submit the transaction
- Contract stores encrypted amounts and metadata

2) User claims/consumes
- Initiate "claim/spend" in the UI
- Contract validates in ciphertext and updates state; UI reflects result

3) History & audit
- View/export records under `/history` without disclosing plaintext amounts

---

## 6. Roadmap

- v0.1 Core
  - Create/claim/spend with encrypted checks and updates
  - Basic UI and wallet integration
- v0.2 Observability & Governance
  - Finer-grained events and dashboards
  - Roles and permissions (issuer, reviewer, multisig)
- v0.3 Composability
  - Interfaces for 3rd-party dapps (whitelist, tickets, membership)
  - Batch ops and subgraph/indexer support
- v0.4 Advanced FHE
  - Richer encrypted ops (range checks, thresholds)
  - Performance and cost optimizations

---

## 7. Security & Privacy Notes

- Compute only what’s necessary on ciphertext to reduce leakage
- Design events carefully to avoid side-channel inference
- Add rate-limiting/governance switches on critical paths
- Third-party audits recommended before mainnet

---

## 8. Repository Layout

```
CertChain/
  contracts/            # Hardhat project & contracts
  public/               # Static assets (favicon, videos)
  src/                  # Frontend (React + TS)
    components/         # UI components
    lib/                # FHE, wagmi utilities
    pages/              # Routes
  tests/                # Unit/integration tests (TS)
```

---

## 9. Development & Deployment

Local dev:

```bash
npm i
npm run dev
```

Frontend build:

```bash
npm run build
```

Contracts (example):

```bash
cd contracts
npm i
npx hardhat compile
npx hardhat run scripts/deploy.js --network <your_network>
```

---

## 10. License

MIT License (see `LICENSE`).
