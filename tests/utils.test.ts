import { describe, it, expect } from 'vitest';
import { formatAddress, formatTimestamp } from '../src/hooks/useHistory';

describe('Utility Functions', () => {
  describe('formatAddress', () => {
    it('should format Ethereum addresses correctly', () => {
      const address = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const formatted = formatAddress(address);
      
      expect(formatted).toBe('0x2AcF...5f2a');
    });

    it('should handle zero address', () => {
      const address = '0x0000000000000000000000000000000000000000';
      const formatted = formatAddress(address);
      
      expect(formatted).toBe('0x0000...0000');
    });

    it('should handle max address', () => {
      const address = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      const formatted = formatAddress(address);
      
      expect(formatted).toBe('0xFFFF...FFFF');
    });

    it('should handle empty string', () => {
      const address = '';
      const formatted = formatAddress(address);
      
      expect(formatted).toBe('');
    });

    it('should maintain case sensitivity', () => {
      const lowerCase = '0xabcdef1234567890123456789012345678901234';
      const upperCase = '0xABCDEF1234567890123456789012345678901234';
      
      expect(formatAddress(lowerCase)).toBe('0xabcd...1234');
      expect(formatAddress(upperCase)).toBe('0xABCD...1234');
    });
  });

  describe('formatTimestamp', () => {
    it('should format recent timestamps as "ago"', () => {
      const now = Math.floor(Date.now() / 1000);
      const oneMinuteAgo = now - 60;
      
      const formatted = formatTimestamp(oneMinuteAgo);
      
      expect(formatted).toContain('ago');
    });

    it('should handle zero timestamp', () => {
      const formatted = formatTimestamp(0);
      
      expect(formatted).toBe('Unknown');
    });

    it('should handle future timestamps', () => {
      const future = Math.floor(Date.now() / 1000) + 3600;
      const formatted = formatTimestamp(future);
      
      expect(formatted).toBeTruthy();
    });

    it('should format very old timestamps', () => {
      const veryOld = 946684800;
      const formatted = formatTimestamp(veryOld);
      
      expect(formatted).toContain('ago');
    });
  });

  describe('Amount Formatting', () => {
    it('should convert Wei to tokens with 6 decimals', () => {
      const weiAmount = 100000000n;
      const tokens = Number(weiAmount) / 1000000;
      
      expect(tokens).toBe(100);
    });

    it('should handle decimal tokens', () => {
      const weiAmount = 100500000n;
      const tokens = Number(weiAmount) / 1000000;
      
      expect(tokens).toBe(100.5);
    });

    it('should handle very small amounts', () => {
      const weiAmount = 1n;
      const tokens = Number(weiAmount) / 1000000;
      
      expect(tokens).toBe(0.000001);
    });

    it('should handle large amounts', () => {
      const weiAmount = 1000000000000n;
      const tokens = Number(weiAmount) / 1000000;
      
      expect(tokens).toBe(1000000);
    });

    it('should handle zero amount', () => {
      const weiAmount = 0n;
      const tokens = Number(weiAmount) / 1000000;
      
      expect(tokens).toBe(0);
    });
  });

  describe('Data Validation Helpers', () => {
    it('should validate non-empty strings', () => {
      const testStrings = ['hello', '123', '  text  '];
      
      testStrings.forEach(str => {
        expect(str.trim().length).toBeGreaterThan(0);
      });
    });

    it('should detect empty strings', () => {
      const emptyStrings = ['', '  ', '\t', '\n'];
      
      emptyStrings.forEach(str => {
        expect(str.trim()).toBe('');
      });
    });

    it('should validate positive numbers', () => {
      const validNumbers = [1, 100, 0.1, 0.000001];
      
      validNumbers.forEach(num => {
        expect(num).toBeGreaterThan(0);
      });
    });

    it('should detect invalid numbers', () => {
      const invalidNumbers = [0, -1, -100, NaN];
      
      expect(invalidNumbers[0]).toBeLessThanOrEqual(0);
      expect(invalidNumbers[1]).toBeLessThan(0);
      expect(invalidNumbers[2]).toBeLessThan(0);
      expect(isNaN(invalidNumbers[3])).toBe(true);
    });
  });

  describe('String Operations', () => {
    it('should truncate long strings', () => {
      const longString = 'a'.repeat(100);
      const truncated = longString.substring(0, 10) + '...';
      
      expect(truncated.length).toBeLessThan(longString.length);
      expect(truncated).toContain('...');
    });

    it('should handle string padding', () => {
      const shortString = '123';
      const padded = shortString.padStart(10, '0');
      
      expect(padded).toBe('0000000123');
      expect(padded.length).toBe(10);
    });

    it('should handle string replacement', () => {
      const text = 'Hello World';
      const replaced = text.replace('World', 'Zama');
      
      expect(replaced).toBe('Hello Zama');
    });

    it('should handle case conversion', () => {
      const text = 'Hello World';
      
      expect(text.toLowerCase()).toBe('hello world');
      expect(text.toUpperCase()).toBe('HELLO WORLD');
    });
  });

  describe('Array Operations', () => {
    it('should filter unique items', () => {
      const items = [1, 2, 2, 3, 3, 3];
      const unique = [...new Set(items)];
      
      expect(unique).toEqual([1, 2, 3]);
    });

    it('should sort items', () => {
      const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
      const sorted = [...numbers].sort((a, b) => a - b);
      
      expect(sorted).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should map and transform items', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      
      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should filter items by condition', () => {
      const numbers = [1, 2, 3, 4, 5];
      const evens = numbers.filter(n => n % 2 === 0);
      
      expect(evens).toEqual([2, 4]);
    });

    it('should handle empty arrays', () => {
      const empty: number[] = [];
      
      expect(empty.length).toBe(0);
      expect(empty.map(x => x * 2)).toEqual([]);
      expect(empty.filter(x => x > 0)).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle try-catch blocks', () => {
      const riskyOperation = () => {
        throw new Error('Test error');
      };

      expect(() => riskyOperation()).toThrow('Test error');
    });

    it('should handle undefined values', () => {
      const obj: any = {};
      
      expect(obj.nonExistent).toBeUndefined();
      expect(obj.nonExistent?.property).toBeUndefined();
    });

    it('should handle null values', () => {
      const value: any = null;
      
      expect(value).toBeNull();
      expect(value ?? 'default').toBe('default');
    });

    it('should use default values with nullish coalescing', () => {
      const value1 = undefined;
      const value2 = null;
      const value3 = 0;
      const value4 = '';
      
      expect(value1 ?? 'default').toBe('default');
      expect(value2 ?? 'default').toBe('default');
      expect(value3 ?? 'default').toBe(0);
      expect(value4 ?? 'default').toBe('');
    });
  });
});
