import { bytesToHex, getAddress } from "viem";
import type { Address } from "viem";
import { CONTRACTS } from "@/lib/contracts";

declare global {
  interface Window {
    RelayerSDK?: any;
    relayerSDK?: any;
    ethereum?: any;
    okxwallet?: any;
  }
}

let fheInstance: any = null;

/**
 * Get the Relayer SDK from window (loaded via CDN in index.html)
 * Updated for v0.3.0-5 (FHEVM v0.9.1)
 */
const getSDK = () => {
  if (typeof window === "undefined") {
    throw new Error("FHE SDK requires a browser environment");
  }
  const sdk = window.RelayerSDK || window.relayerSDK;
  if (!sdk) {
    throw new Error("Relayer SDK not loaded. Ensure the CDN script tag is present in index.html.");
  }
  return sdk;
};

/**
 * Initialize FHE instance with Sepolia network configuration
 * Updated for FHEVM v0.9.1 - uses self-relaying decryption model
 */
export const initializeFHE = async (provider?: any) => {
  if (fheInstance) return fheInstance;
  if (typeof window === "undefined") {
    throw new Error("FHE SDK requires browser environment");
  }

  const ethereumProvider =
    provider || window.ethereum || window.okxwallet?.provider || window.okxwallet;
  if (!ethereumProvider) {
    throw new Error("No wallet provider detected. Connect a wallet first.");
  }

  console.log('🔌 Using Ethereum provider:', {
    isOKX: !!window.okxwallet,
    isMetaMask: !!(window.ethereum as any)?.isMetaMask,
  });

  const sdk = getSDK();
  const { initSDK, createInstance, SepoliaConfig } = sdk;
  await initSDK();
  const config = { ...SepoliaConfig, network: ethereumProvider };
  fheInstance = await createInstance(config);
  console.log('✅ FHE instance initialized for Sepolia (v0.9.1)');
  return fheInstance;
};

const getInstance = async (provider?: any) => {
  if (fheInstance) return fheInstance;
  return initializeFHE(provider);
};

/**
 * Encrypt a quota amount (euint64) for contract submission
 * @param amount - The amount to encrypt
 * @param userAddress - The user's wallet address
 * @param provider - Optional ethereum provider
 */
export const encryptQuotaAmount = async (
  amount: bigint,
  userAddress: Address,
  provider?: any
): Promise<{
  encryptedAmount: `0x${string}`;
  proof: `0x${string}`;
}> => {
  console.log('[FHE] Encrypting quota amount:', amount.toString());

  const instance = await getInstance(provider);
  const contractAddr = getAddress(CONTRACTS.ConfAirdrop);
  const userAddr = getAddress(userAddress);

  console.log('[FHE] Creating encrypted input for:', {
    contract: contractAddr,
    user: userAddr,
  });

  const input = instance.createEncryptedInput(contractAddr, userAddr);
  input.add64(amount);

  console.log('[FHE] Encrypting...');
  const { handles, inputProof } = await input.encrypt();
  console.log('[FHE] ✅ Encryption complete, handles:', handles.length);

  if (handles.length < 1) {
    throw new Error('FHE SDK returned insufficient handles');
  }

  return {
    encryptedAmount: bytesToHex(handles[0]) as `0x${string}`,
    proof: bytesToHex(inputProof) as `0x${string}`,
  };
};

/**
 * Decrypt a euint64 value using the new self-relaying model (v0.9.1)
 * Note: In v0.9.1, the contract must first call FHE.makePubliclyDecryptable
 * Then client uses publicDecrypt from relayer-sdk
 */
export const decryptQuotaAmount = async (
  handle: string,
  userAddress: Address,
  provider?: any
): Promise<bigint> => {
  console.log('[FHE] Decrypting handle:', handle);

  const instance = await getInstance(provider);
  const contractAddr = getAddress(CONTRACTS.ConfAirdrop);
  const userAddr = getAddress(userAddress);

  console.log('[FHE] Requesting decryption (v0.9.1 self-relay)...');
  const decrypted = await instance.decrypt(contractAddr, handle, userAddr);

  console.log('[FHE] ✅ Decryption complete');
  return BigInt(decrypted);
};

/**
 * Check if FHE SDK is loaded and ready
 */
export const isFHEReady = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(window.RelayerSDK || window.relayerSDK);
};

/**
 * Check if FHE instance is initialized
 */
export const isFheReady = (): boolean => {
  return fheInstance !== null;
};

export const isSDKLoaded = isFHEReady;

/**
 * Wait for FHE SDK to be loaded (with timeout)
 */
export const waitForFHE = async (timeoutMs: number = 10000): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (isFHEReady()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return false;
};

/**
 * Get FHE status for debugging
 */
export const getFHEStatus = (): {
  sdkLoaded: boolean;
  instanceReady: boolean;
} => {
  return {
    sdkLoaded: isFHEReady(),
    instanceReady: fheInstance !== null,
  };
};
