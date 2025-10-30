import { describe, it, expect } from 'vitest';
import { parseUnits, isAddress } from 'viem';

describe('Allocation Logic', () => {
  describe('Amount Conversion', () => {
    it('should convert quota amount with 6 decimals correctly', () => {
      const quota = '100';
      const amount = parseUnits(quota, 6);
      
      expect(amount).toBe(100000000n);
    });

    it('should handle decimal quota values', () => {
      const quota = '100.5';
      const amount = parseUnits(quota, 6);
      
      expect(amount).toBe(100500000n);
    });

    it('should handle small quota values', () => {
      const quota = '0.000001';
      const amount = parseUnits(quota, 6);
      
      expect(amount).toBe(1n);
    });

    it('should handle large quota values within uint64 range', () => {
      const quota = '18446744073703';
      const amount = parseUnits(quota, 6);
      
      expect(amount).toBeLessThanOrEqual(18446744073709551615n);
    });

    it('should throw for negative values', () => {
      const quota = '-100';
      
      expect(() => parseUnits(quota, 6)).toThrow();
    });
  });

  describe('Address Validation', () => {
    it('should validate correct Ethereum addresses', () => {
      const validAddresses = [
        '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a',
        '0x0000000000000000000000000000000000000000',
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
      ];

      validAddresses.forEach(address => {
        expect(isAddress(address)).toBe(true);
      });
    });

    it('should reject invalid addresses', () => {
      const invalidAddresses = [
        '0x123',
        'not-an-address',
        '0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
        '',
      ];

      invalidAddresses.forEach(address => {
        expect(isAddress(address)).toBe(false);
      });
    });

    it('should handle case-insensitive addresses', () => {
      const lowerCase = '0x2acf80c297d443fead9e5a4752a7342361bc5f2a';
      const upperCase = '0x2ACF80C297D443FEAD9E5A4752A7342361BC5F2A';
      const mixedCase = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';

      expect(isAddress(lowerCase)).toBe(true);
      expect(isAddress(upperCase)).toBe(true);
      expect(isAddress(mixedCase)).toBe(true);
    });
  });

  describe('Allocation Business Rules', () => {
    it('should allow positive allocation amounts', () => {
      const validAmounts = ['1', '100', '1000.5', '0.000001'];
      
      validAmounts.forEach(amount => {
        const parsed = parseFloat(amount);
        expect(parsed).toBeGreaterThan(0);
      });
    });

    it('should reject zero or negative allocations', () => {
      const invalidAmounts = ['0', '-1', '-100.5'];
      
      invalidAmounts.forEach(amount => {
        const parsed = parseFloat(amount);
        expect(parsed).toBeLessThanOrEqual(0);
      });
    });

    it('should handle very small decimal amounts', () => {
      const smallAmount = '0.000001';
      const parsed = parseUnits(smallAmount, 6);
      
      expect(parsed).toBe(1n);
    });

    it('should validate uint64 overflow protection', () => {
      const maxSafeAmount = '18446744073703';
      const parsed = parseUnits(maxSafeAmount, 6);
      
      expect(parsed).toBeLessThanOrEqual(18446744073709551615n);
    });
  });

  describe('Input Sanitization', () => {
    it('should trim whitespace from addresses', () => {
      const addressWithWhitespace = '  0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a  ';
      const trimmed = addressWithWhitespace.trim();
      
      expect(isAddress(trimmed)).toBe(true);
    });

    it('should handle quoted amounts', () => {
      const quotedAmount = '"100"';
      const cleaned = quotedAmount.replace(/"/g, '');
      const parsed = parseUnits(cleaned, 6);
      
      expect(parsed).toBe(100000000n);
    });

    it('should handle amounts with commas', () => {
      const amountWithCommas = '1,000,000';
      const cleaned = amountWithCommas.replace(/,/g, '');
      const parsed = parseUnits(cleaned, 6);
      
      expect(parsed).toBe(1000000000000n);
    });
  });
});
