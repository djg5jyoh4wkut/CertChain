import { describe, it, expect, beforeAll, vi } from 'vitest';
import { initializeFHE, encryptQuotaAmount, decryptQuotaAmount } from '../src/lib/fhe';

// Mock window.relayerSDK
const mockRelayerSDK = {
  initSDK: vi.fn().mockResolvedValue(undefined),
  createInstance: vi.fn().mockResolvedValue({
    createEncryptedInput: vi.fn().mockReturnValue({
      add64: vi.fn().mockReturnThis(),
      encrypt: vi.fn().mockResolvedValue({
        handles: [new Uint8Array([1, 2, 3, 4])],
        inputProof: new Uint8Array([5, 6, 7, 8]),
      }),
    }),
    decrypt: vi.fn().mockResolvedValue(1000n),
  }),
  SepoliaConfig: {
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
  },
};

describe('FHE Module', () => {
  beforeAll(() => {
    // Mock window.relayerSDK
    (global as any).window = {
      relayerSDK: mockRelayerSDK,
      ethereum: {},
    };
  });

  describe('initializeFHE', () => {
    it('should initialize FHE SDK successfully', async () => {
      const fheInstance = await initializeFHE();
      
      expect(fheInstance).toBeDefined();
      expect(mockRelayerSDK.initSDK).toHaveBeenCalled();
      expect(mockRelayerSDK.createInstance).toHaveBeenCalled();
    });

    it('should reuse existing FHE instance', async () => {
      const firstInstance = await initializeFHE();
      const secondInstance = await initializeFHE();
      
      expect(firstInstance).toBe(secondInstance);
    });

    it('should throw error when ethereum provider not found', async () => {
      const tempWindow = (global as any).window;
      (global as any).window = {
        relayerSDK: mockRelayerSDK,
      };

      await expect(initializeFHE()).rejects.toThrow('Ethereum provider not found');

      (global as any).window = tempWindow;
    });
  });

  describe('encryptQuotaAmount', () => {
    it('should encrypt quota amount successfully', async () => {
      const amount = 1000000n; // 1 token with 6 decimals
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      const result = await encryptQuotaAmount(amount, contractAddress, userAddress);

      expect(result).toHaveProperty('encryptedAmount');
      expect(result).toHaveProperty('proof');
      expect(result.encryptedAmount).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(result.proof).toMatch(/^0x[0-9a-fA-F]+$/);
    });

    it('should handle zero amount', async () => {
      const amount = 0n;
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      const result = await encryptQuotaAmount(amount, contractAddress, userAddress);

      expect(result).toHaveProperty('encryptedAmount');
      expect(result).toHaveProperty('proof');
    });

    it('should handle large amounts within uint64 range', async () => {
      // Max safe amount with 6 decimals: ~18446744073703 tokens
      const maxAmount = 18446744073000000000n; // Close to uint64 max
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      const result = await encryptQuotaAmount(maxAmount, contractAddress, userAddress);

      expect(result).toHaveProperty('encryptedAmount');
      expect(result).toHaveProperty('proof');
    });

    it('should validate contract address format', async () => {
      const amount = 1000000n;
      const invalidAddress = 'not-an-address';
      const userAddress = '0x1234567890123456789012345678901234567890';

      await expect(
        encryptQuotaAmount(amount, invalidAddress, userAddress)
      ).rejects.toThrow();
    });
  });

  describe('decryptQuotaAmount', () => {
    it('should decrypt quota amount successfully', async () => {
      const handle = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      const result = await decryptQuotaAmount(handle, contractAddress, userAddress);

      expect(typeof result).toBe('bigint');
      expect(result).toBeGreaterThanOrEqual(0n);
    });

    it('should handle invalid handle format', async () => {
      const invalidHandle = 'invalid-handle';
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      await expect(
        decryptQuotaAmount(invalidHandle, contractAddress, userAddress)
      ).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle network disconnection gracefully', async () => {
      const tempSDK = mockRelayerSDK.createInstance;
      mockRelayerSDK.createInstance = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(initializeFHE()).rejects.toThrow('Network error');

      mockRelayerSDK.createInstance = tempSDK;
    });

    it('should handle concurrent encryption requests', async () => {
      const amount = 1000000n;
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      const promises = Array(5).fill(null).map(() => 
        encryptQuotaAmount(amount, contractAddress, userAddress)
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toHaveProperty('encryptedAmount');
        expect(result).toHaveProperty('proof');
      });
    });
  });

  describe('Data Validation', () => {
    it('should convert amount to correct format', async () => {
      // Test with 6 decimal places
      const amount = 100000000n; // 100 tokens with 6 decimals
      const contractAddress = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const userAddress = '0x1234567890123456789012345678901234567890';

      const result = await encryptQuotaAmount(amount, contractAddress, userAddress);

      expect(result.encryptedAmount).toBeTruthy();
      expect(result.proof).toBeTruthy();
    });

    it('should handle addresses with mixed case', async () => {
      const amount = 1000000n;
      const contractAddress = '0x2acF80c297D443FeAD9E5A4752A7342361Bc5f2a'; // Mixed case
      const userAddress = '0x1234567890ABCDEF1234567890ABCDEF12345678'; // Mixed case

      const result = await encryptQuotaAmount(amount, contractAddress, userAddress);

      expect(result).toHaveProperty('encryptedAmount');
      expect(result).toHaveProperty('proof');
    });
  });
});
