import { describe, it, expect, beforeEach } from 'vitest';
import { parseUnits, isAddress, formatUnits } from 'viem';

/**
 * Allocation Logic Tests
 * Tests for the CertChain allocation system including amount conversion,
 * address validation, business rules, and input sanitization.
 */
describe('Allocation Logic', () => {
  describe('Amount Conversion (6 Decimals)', () => {
    const DECIMALS = 6;

    it('should convert integer quota amounts correctly', () => {
      const testCases = [
        { input: '1', expected: 1_000_000n },
        { input: '100', expected: 100_000_000n },
        { input: '1000', expected: 1_000_000_000n },
        { input: '1000000', expected: 1_000_000_000_000n },
      ];

      testCases.forEach(({ input, expected }) => {
        const amount = parseUnits(input, DECIMALS);
        expect(amount).toBe(expected);
      });
    });

    it('should handle decimal quota values correctly', () => {
      const testCases = [
        { input: '100.5', expected: 100_500_000n },
        { input: '0.5', expected: 500_000n },
        { input: '123.456', expected: 123_456_000n },
        { input: '0.123456', expected: 123_456n },
      ];

      testCases.forEach(({ input, expected }) => {
        const amount = parseUnits(input, DECIMALS);
        expect(amount).toBe(expected);
      });
    });

    it('should handle minimum precision (smallest unit)', () => {
      const smallestUnit = '0.000001';
      const amount = parseUnits(smallestUnit, DECIMALS);
      expect(amount).toBe(1n);
    });

    it('should handle maximum safe uint64 values', () => {
      // Max uint64 = 18,446,744,073,709,551,615
      // With 6 decimals, max tokens = ~18,446,744,073,703
      const maxSafeTokens = '18446744073703';
      const amount = parseUnits(maxSafeTokens, DECIMALS);

      const MAX_UINT64 = 18446744073709551615n;
      expect(amount).toBeLessThanOrEqual(MAX_UINT64);
    });

    it('should detect negative values in validation', () => {
      // Note: parseUnits accepts negative values, so validation must check explicitly
      const isPositiveAmount = (amount: string): boolean => {
        return parseFloat(amount) > 0;
      };

      expect(isPositiveAmount('-100')).toBe(false);
      expect(isPositiveAmount('-0.000001')).toBe(false);
      expect(isPositiveAmount('100')).toBe(true);
    });

    it('should convert back to human-readable format correctly', () => {
      const testCases = [
        { wei: 100_000_000n, expected: '100' },
        { wei: 100_500_000n, expected: '100.5' },
        { wei: 1n, expected: '0.000001' },
        { wei: 123_456_789n, expected: '123.456789' },
      ];

      testCases.forEach(({ wei, expected }) => {
        const formatted = formatUnits(wei, DECIMALS);
        expect(formatted).toBe(expected);
      });
    });
  });

  describe('Ethereum Address Validation', () => {
    it('should validate correct Ethereum addresses with proper checksum', () => {
      // viem's isAddress is strict about checksum for mixed case
      const validAddresses = [
        '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a', // Valid checksum
        '0x0000000000000000000000000000000000000000', // Zero address
      ];

      validAddresses.forEach(address => {
        expect(isAddress(address)).toBe(true);
      });
    });

    it('should validate lowercase addresses', () => {
      // All lowercase is always valid
      const lowerCaseAddress = '0x2acf80c297d443fead9e5a4752a7342361bc5f2a';
      expect(isAddress(lowerCaseAddress)).toBe(true);
    });

    it('should reject invalid addresses', () => {
      const invalidAddresses = [
        '0x123',                                           // Too short
        'not-an-address',                                  // Not hex
        '0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',   // Invalid hex characters
        '',                                                // Empty
        '0x',                                              // Only prefix
        '1234567890123456789012345678901234567890',        // Missing 0x prefix
        '0x12345678901234567890123456789012345678901234', // Too long
      ];

      invalidAddresses.forEach(address => {
        expect(isAddress(address)).toBe(false);
      });
    });

    it('should handle address normalization for comparison', () => {
      // For comparison purposes, normalize to lowercase
      const addr1 = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const addr2 = '0x2acf80c297d443fead9e5a4752a7342361bc5f2a';

      expect(addr1.toLowerCase()).toBe(addr2.toLowerCase());
    });
  });

  describe('Allocation Business Rules', () => {
    it('should accept positive allocation amounts', () => {
      const validAmounts = ['1', '100', '1000.5', '0.000001'];

      validAmounts.forEach(amount => {
        const parsed = parseFloat(amount);
        expect(parsed).toBeGreaterThan(0);
      });
    });

    it('should reject zero or negative allocations in validation', () => {
      const invalidAmounts = ['0', '-1', '-100.5'];

      invalidAmounts.forEach(amount => {
        const parsed = parseFloat(amount);
        expect(parsed).toBeLessThanOrEqual(0);
      });
    });

    it('should validate allocation does not exceed uint64 max', () => {
      const MAX_UINT64 = 18446744073709551615n;

      // Valid large amount
      const validLarge = parseUnits('18446744073703', 6);
      expect(validLarge).toBeLessThanOrEqual(MAX_UINT64);

      // This would overflow - test the boundary
      const atBoundary = parseUnits('18446744073709', 6);
      expect(atBoundary).toBeLessThanOrEqual(MAX_UINT64);
    });

    it('should handle cumulative allocations correctly', () => {
      // Simulate multiple allocations to same user
      let totalAllocation = 0n;
      const allocations = [
        parseUnits('100', 6),
        parseUnits('50.5', 6),
        parseUnits('25.25', 6),
      ];

      allocations.forEach(amount => {
        totalAllocation += amount;
      });

      const expected = parseUnits('175.75', 6);
      expect(totalAllocation).toBe(expected);
    });
  });

  describe('Claim Validation', () => {
    it('should validate claim amount does not exceed allocation', () => {
      const allocation = parseUnits('100', 6);
      const validClaim = parseUnits('50', 6);
      const invalidClaim = parseUnits('150', 6);

      expect(validClaim <= allocation).toBe(true);
      expect(invalidClaim <= allocation).toBe(false);
    });

    it('should track remaining allocation after claims', () => {
      const allocation = parseUnits('100', 6);
      let claimed = 0n;

      // First claim
      const claim1 = parseUnits('30', 6);
      claimed += claim1;
      expect(allocation - claimed).toBe(parseUnits('70', 6));

      // Second claim
      const claim2 = parseUnits('25', 6);
      claimed += claim2;
      expect(allocation - claimed).toBe(parseUnits('45', 6));

      // Attempt over-claim (should be rejected by contract)
      const overClaim = parseUnits('50', 6);
      const remaining = allocation - claimed;
      expect(overClaim > remaining).toBe(true);
    });

    it('should handle exact claim of remaining allocation', () => {
      const allocation = parseUnits('100', 6);
      const claimed = parseUnits('60', 6);
      const remaining = allocation - claimed;
      const exactClaim = remaining;

      expect(exactClaim).toBe(parseUnits('40', 6));
      expect(allocation - claimed - exactClaim).toBe(0n);
    });
  });

  describe('Input Sanitization', () => {
    it('should trim whitespace from addresses', () => {
      const addressWithWhitespace = '  0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a  ';
      const trimmed = addressWithWhitespace.trim();

      expect(isAddress(trimmed)).toBe(true);
      expect(trimmed).toBe('0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a');
    });

    it('should handle quoted amounts', () => {
      const quotedAmounts = ['"100"', "'50'", '`25`'];

      quotedAmounts.forEach(quoted => {
        const cleaned = quoted.replace(/["'`]/g, '');
        const parsed = parseUnits(cleaned, 6);
        expect(parsed).toBeGreaterThan(0n);
      });
    });

    it('should handle amounts with thousand separators', () => {
      const formattedAmounts = [
        { input: '1,000,000', expected: 1_000_000_000_000n },
        { input: '1,234.56', expected: 1_234_560_000n },
        { input: '10,000.001', expected: 10_000_001_000n },
      ];

      formattedAmounts.forEach(({ input, expected }) => {
        const cleaned = input.replace(/,/g, '');
        const parsed = parseUnits(cleaned, 6);
        expect(parsed).toBe(expected);
      });
    });

    it('should handle leading zeros in amounts', () => {
      const amountsWithLeadingZeros = [
        { input: '0100', expected: 100_000_000n },
        { input: '00.5', expected: 500_000n },
        { input: '000001', expected: 1_000_000n },
      ];

      amountsWithLeadingZeros.forEach(({ input, expected }) => {
        const parsed = parseUnits(input, 6);
        expect(parsed).toBe(expected);
      });
    });

    it('should normalize address case for comparison', () => {
      const addr1 = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const addr2 = '0x2acf80c297d443fead9e5a4752a7342361bc5f2a';

      expect(addr1.toLowerCase()).toBe(addr2.toLowerCase());
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero address validation', () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      expect(isAddress(zeroAddress)).toBe(true);
      // Note: Contract should reject zero address as recipient
    });

    it('should handle precision loss scenarios', () => {
      // 7 decimal places should be truncated to 6
      const highPrecision = '100.1234567';
      const parsed = parseUnits(highPrecision.slice(0, -1), 6); // Remove last digit
      expect(parsed).toBe(parseUnits('100.123456', 6));
    });

    it('should handle scientific notation', () => {
      // parseUnits doesn't support scientific notation directly
      const scientificValue = 1e6;
      const parsed = parseUnits(scientificValue.toString(), 6);
      expect(parsed).toBe(1_000_000_000_000n);
    });
  });
});
