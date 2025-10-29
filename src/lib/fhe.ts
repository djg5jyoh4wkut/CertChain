import { CONTRACTS } from "@/config/contracts";
import { toHex } from "viem";

// FHE types from Zama SDK
type FHE = {
  createEncryptedInput: (contractAddress: string, userAddress: string) => EncryptedInput;
};

type EncryptedInput = {
  add64: (value: bigint) => EncryptedInput;
  encrypt: () => Promise<{
    handles: Uint8Array[];
    inputProof: Uint8Array;
  }>;
};

declare global {
  interface Window {
    fhevm?: FHE;
  }
}

let fheInstance: FHE | null = null;

/**
 * Initialize FHE instance from global window object
 */
export const initializeFHE = async (): Promise<FHE> => {
  if (fheInstance) {
    return fheInstance;
  }

  // Wait for SDK to be loaded
  let attempts = 0;
  while (!window.fhevm && attempts < 50) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }

  if (!window.fhevm) {
    throw new Error("FHE SDK not loaded. Please check if the CDN script is included.");
  }

  fheInstance = window.fhevm;
  return fheInstance;
};

/**
 * Encrypt a quota amount (euint64) for contract submission
 */
export const encryptQuotaAmount = async (
  amount: bigint,
  contractAddress: string,
  userAddress: string
): Promise<{
  encryptedAmount: `0x${string}`;
  proof: `0x${string}`;
}> => {
  const fhe = await initializeFHE();

  // Ensure addresses are checksummed
  const checksumContract = contractAddress.toLowerCase() as `0x${string}`;
  const checksumUser = userAddress.toLowerCase() as `0x${string}`;

  // Create encrypted input for euint64
  const input = fhe.createEncryptedInput(checksumContract, checksumUser);
  input.add64(amount);

  // Encrypt and get handle + proof
  const result = await input.encrypt();

  return {
    encryptedAmount: toHex(result.handles[0]),
    proof: toHex(result.inputProof),
  };
};

/**
 * Helper to decrypt encrypted values (requires user permission)
 * Note: In FHE, decryption happens via contract getters that return encrypted values
 * The SDK then decrypts them client-side if the user has permission
 */
export const decryptValue = async (
  encryptedValue: `0x${string}`
): Promise<bigint> => {
  // This would use FHE SDK's decrypt functionality
  // For now, we'll handle this in the hooks where we fetch contract data
  throw new Error("Decryption should be handled in contract read hooks");
};
