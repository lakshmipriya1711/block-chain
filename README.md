# Academic Verifier

A full-stack academic credential verification demo inspired by the Veridoc reference UI. It includes a React/Vite frontend, Express API, and Hardhat Solidity contract.

## Run locally

From this folder (`block-chain`):

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173. The API runs at `http://localhost:4000`.

## Validate

```bash
npm run build
npm test
```

## Structure

- `contracts/AcademicVerifier.sol`: issue, verify, and revoke on-chain credentials.
- `scripts/deploy.js`: Hardhat deployment script.
- `test/AcademicVerifier.test.js`: contract behavior tests.
- `frontend/`: responsive Veridoc-style React interface.
- `backend/`: Express health and credential verification endpoints.
- `uploads/`: reserved for document uploads.

The UI works in demo mode with credential `VD-2024-8842`; replace the backend model and deployment address when connecting a live chain.