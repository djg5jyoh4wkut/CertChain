import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatAddress, formatTimestamp } from '../src/hooks/useHistory';

/**
 * Utility Functions Tests
 * Tests for CertChain helper functions including address formatting,
 * timestamp formatting, amount conversion, and data validation utilities.
 */
describe('Utility Functions', () => {
  describe('formatAddress', () => {
    it('should format standard Ethereum addresses correctly', () => {
      const testCases = [
        { input: '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a', expected: '0x2AcF...5f2a' },
        { input: '0x50e9710E49991EBc748fdC7D95eE87c8bAcb55Cf', expected: '0x50e9...55Cf' },
        { input: '0xdead000000000000000000000000000000000000', expected: '0xdead...0000' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatAddress(input)).toBe(expected);
      });
    });

    it('should handle zero address', () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      expect(formatAddress(zeroAddress)).toBe('0x0000...0000');
    });

    it('should handle max address (all F)', () => {
      const maxAddress = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
      expect(formatAddress(maxAddress)).toBe('0xFFFF...FFFF');
    });

    it('should return empty string for empty input', () => {
      expect(formatAddress('')).toBe('');
    });

    it('should maintain case sensitivity', () => {
      const lowerCase = '0xabcdef1234567890123456789012345678901234';
      const upperCase = '0xABCDEF1234567890123456789012345678901234';
      const mixedCase = '0xAbCdEf1234567890123456789012345678901234';

      expect(formatAddress(lowerCase)).toBe('0xabcd...1234');
      expect(formatAddress(upperCase)).toBe('0xABCD...1234');
      expect(formatAddress(mixedCase)).toBe('0xAbCd...1234');
    });

    it('should preserve prefix and suffix lengths', () => {
      const address = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const formatted = formatAddress(address);

      const parts = formatted.split('...');
      expect(parts[0]).toBe('0x2AcF'); // 6 chars
      expect(parts[1]).toBe('5f2a');   // 4 chars
    });

    it('should handle contract addresses', () => {
      // CertChain contract address
      const contractAddress = '0x50e9710E49991EBc748fdC7D95eE87c8bAcb55Cf';
      expect(formatAddress(contractAddress)).toBe('0x50e9...55Cf');
    });
  });

  describe('formatTimestamp', () => {
    let originalDate: typeof Date;

    beforeEach(() => {
      // Mock current time for consistent tests
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-12-07T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format timestamps from seconds ago', () => {
      const now = Math.floor(Date.now() / 1000);
      const thirtySecondsAgo = now - 30;

      const formatted = formatTimestamp(thirtySecondsAgo);
      expect(formatted).toContain('ago');
    });

    it('should format timestamps from minutes ago', () => {
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutesAgo = now - 300;

      const formatted = formatTimestamp(fiveMinutesAgo);
      expect(formatted).toContain('minute');
      expect(formatted).toContain('ago');
    });

    it('should format timestamps from hours ago', () => {
      const now = Math.floor(Date.now() / 1000);
      const twoHoursAgo = now - 7200;

      const formatted = formatTimestamp(twoHoursAgo);
      expect(formatted).toContain('hour');
      expect(formatted).toContain('ago');
    });

    it('should format timestamps from days ago', () => {
      const now = Math.floor(Date.now() / 1000);
      const threeDaysAgo = now - (3 * 24 * 3600);

      const formatted = formatTimestamp(threeDaysAgo);
      expect(formatted).toContain('day');
      expect(formatted).toContain('ago');
    });

    it('should return "Unknown" for zero timestamp', () => {
      expect(formatTimestamp(0)).toBe('Unknown');
    });

    it('should handle Unix epoch timestamps', () => {
      // January 1, 2020 00:00:00 UTC
      const timestamp = 1577836800;
      const formatted = formatTimestamp(timestamp);

      expect(formatted).toContain('ago');
      expect(formatted).toContain('year');
    });

    it('should handle recent blockchain timestamps', () => {
      // Simulate a block confirmed just now
      const now = Math.floor(Date.now() / 1000);
      const formatted = formatTimestamp(now);

      expect(formatted).toContain('ago');
    });
  });

  describe('Amount Formatting (6 Decimals)', () => {
    const DECIMALS = 6;
    const DIVISOR = 10 ** DECIMALS;

    it('should convert wei to tokens correctly', () => {
      const testCases = [
        { wei: 100_000_000n, expected: 100 },
        { wei: 1_000_000n, expected: 1 },
        { wei: 1_000_000_000n, expected: 1000 },
        { wei: 500_000n, expected: 0.5 },
      ];

      testCases.forEach(({ wei, expected }) => {
        const tokens = Number(wei) / DIVISOR;
        expect(tokens).toBe(expected);
      });
    });

    it('should handle decimal token values', () => {
      const testCases = [
        { wei: 100_500_000n, expected: 100.5 },
        { wei: 123_456_000n, expected: 123.456 },
        { wei: 999_999n, expected: 0.999999 },
      ];

      testCases.forEach(({ wei, expected }) => {
        const tokens = Number(wei) / DIVISOR;
        expect(tokens).toBe(expected);
      });
    });

    it('should handle smallest unit (0.000001 token)', () => {
      const wei = 1n;
      const tokens = Number(wei) / DIVISOR;
      expect(tokens).toBe(0.000001);
    });

    it('should handle zero amount', () => {
      const wei = 0n;
      const tokens = Number(wei) / DIVISOR;
      expect(tokens).toBe(0);
    });

    it('should handle large amounts within safe range', () => {
      // 1 billion tokens
      const wei = 1_000_000_000_000_000n;
      const tokens = Number(wei) / DIVISOR;
      expect(tokens).toBe(1_000_000_000);
    });

    it('should format tokens for display', () => {
      const formatTokens = (wei: bigint): string => {
        const tokens = Number(wei) / DIVISOR;
        if (tokens === 0) return '0';
        if (tokens < 0.01) return tokens.toFixed(6);
        if (tokens < 1) return tokens.toFixed(2);
        if (tokens < 1000) return tokens.toFixed(2);
        return tokens.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
      };

      expect(formatTokens(1n)).toBe('0.000001');       // < 0.01, shows 6 decimals
      expect(formatTokens(5_000n)).toBe('0.005000');   // 0.005 < 0.01, shows 6 decimals
      expect(formatTokens(500_000n)).toBe('0.50');     // 0.5 > 0.01, shows 2 decimals
      expect(formatTokens(100_000_000n)).toBe('100.00');
      expect(formatTokens(1_000_000_000_000n)).toBe('1,000,000');  // Whole number with commas
    });
  });

  describe('String Manipulation', () => {
    it('should truncate long strings with ellipsis', () => {
      const truncate = (str: string, maxLen: number): string => {
        if (str.length <= maxLen) return str;
        return str.substring(0, maxLen - 3) + '...';
      };

      expect(truncate('Hello World', 20)).toBe('Hello World');
      expect(truncate('This is a very long string', 10)).toBe('This is...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should trim whitespace from addresses', () => {
      const addresses = [
        '  0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a  ',
        '\t0x50e9710E49991EBc748fdC7D95eE87c8bAcb55Cf\n',
        ' 0x0000000000000000000000000000000000000000 ',
      ];

      addresses.forEach(addr => {
        const trimmed = addr.trim();
        expect(trimmed.startsWith('0x')).toBe(true);
        expect(trimmed.length).toBe(42);
      });
    });

    it('should pad hex strings correctly', () => {
      const padHex = (value: string, length: number): string => {
        const clean = value.startsWith('0x') ? value.slice(2) : value;
        return '0x' + clean.padStart(length, '0');
      };

      expect(padHex('1', 64)).toBe('0x' + '0'.repeat(63) + '1');
      expect(padHex('0xabc', 64)).toBe('0x' + '0'.repeat(61) + 'abc');
    });

    it('should normalize addresses for comparison', () => {
      const normalize = (addr: string): string => addr.toLowerCase().trim();

      const addr1 = '0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a';
      const addr2 = '0x2acf80c297d443fead9e5a4752a7342361bc5f2a';
      const addr3 = '  0x2ACF80C297D443FEAD9E5A4752A7342361BC5F2A  ';

      expect(normalize(addr1)).toBe(normalize(addr2));
      expect(normalize(addr2)).toBe(normalize(addr3));
    });
  });

  describe('Array Utilities', () => {
    it('should filter unique items', () => {
      const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
      expect(unique([])).toEqual([]);
    });

    it('should sort events by block number descending', () => {
      const events = [
        { blockNumber: 100n },
        { blockNumber: 300n },
        { blockNumber: 200n },
      ];

      const sorted = [...events].sort(
        (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
      );

      expect(sorted[0].blockNumber).toBe(300n);
      expect(sorted[1].blockNumber).toBe(200n);
      expect(sorted[2].blockNumber).toBe(100n);
    });

    it('should group events by type', () => {
      const events = [
        { type: 'Allocation Set', id: '1' },
        { type: 'Claimed', id: '2' },
        { type: 'Allocation Set', id: '3' },
        { type: 'Batch Allocation', id: '4' },
      ];

      const grouped = events.reduce((acc, event) => {
        if (!acc[event.type]) acc[event.type] = [];
        acc[event.type].push(event);
        return acc;
      }, {} as Record<string, typeof events>);

      expect(grouped['Allocation Set']).toHaveLength(2);
      expect(grouped['Claimed']).toHaveLength(1);
      expect(grouped['Batch Allocation']).toHaveLength(1);
    });

    it('should filter events by address', () => {
      const events = [
        { recipient: '0xabc', type: 'Allocation Set' },
        { recipient: '0xdef', type: 'Allocation Set' },
        { user: '0xabc', type: 'Claimed' },
      ];

      const targetAddress = '0xabc';
      const filtered = events.filter(
        e => e.recipient === targetAddress || e.user === targetAddress
      );

      expect(filtered).toHaveLength(2);
    });
  });

  describe('Data Validation', () => {
    it('should validate positive amounts', () => {
      const isValidAmount = (amount: string): boolean => {
        const parsed = parseFloat(amount);
        return !isNaN(parsed) && parsed > 0;
      };

      expect(isValidAmount('100')).toBe(true);
      expect(isValidAmount('0.001')).toBe(true);
      expect(isValidAmount('1000000')).toBe(true);
      expect(isValidAmount('0')).toBe(false);
      expect(isValidAmount('-100')).toBe(false);
      expect(isValidAmount('abc')).toBe(false);
    });

    it('should validate Ethereum addresses', () => {
      const isValidAddress = (addr: string): boolean => {
        return /^0x[0-9a-fA-F]{40}$/.test(addr);
      };

      expect(isValidAddress('0x2AcF80C297D443FeAD9E5A4752A7342361Bc5f2a')).toBe(true);
      expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('invalid')).toBe(false);
      expect(isValidAddress('')).toBe(false);
    });

    it('should validate transaction hashes', () => {
      const isValidTxHash = (hash: string): boolean => {
        return /^0x[0-9a-fA-F]{64}$/.test(hash);
      };

      const validHash = '0x' + 'a'.repeat(64);
      const invalidHash = '0x' + 'g'.repeat(64);

      expect(isValidTxHash(validHash)).toBe(true);
      expect(isValidTxHash(invalidHash)).toBe(false);
      expect(isValidTxHash('0x123')).toBe(false);
    });

    it('should validate block numbers', () => {
      const isValidBlockNumber = (block: bigint): boolean => {
        return block >= 0n;
      };

      expect(isValidBlockNumber(0n)).toBe(true);
      expect(isValidBlockNumber(1000000n)).toBe(true);
      expect(isValidBlockNumber(-1n)).toBe(false);
    });
  });

  describe('Error Handling Utilities', () => {
    it('should handle undefined values safely', () => {
      const obj: any = {};

      expect(obj.nonExistent).toBeUndefined();
      expect(obj.nonExistent?.nested).toBeUndefined();
      expect(obj.nonExistent ?? 'default').toBe('default');
    });

    it('should handle null values safely', () => {
      const value: any = null;

      expect(value).toBeNull();
      expect(value ?? 'fallback').toBe('fallback');
      expect(value?.property).toBeUndefined();
    });

    it('should use nullish coalescing correctly', () => {
      expect(undefined ?? 'default').toBe('default');
      expect(null ?? 'default').toBe('default');
      expect(0 ?? 'default').toBe(0);
      expect('' ?? 'default').toBe('');
      expect(false ?? 'default').toBe(false);
    });

    it('should handle async error scenarios', async () => {
      const failingOperation = async (): Promise<void> => {
        throw new Error('Operation failed');
      };

      await expect(failingOperation()).rejects.toThrow('Operation failed');
    });

    it('should catch and transform errors', () => {
      const transformError = (fn: () => void): string => {
        try {
          fn();
          return 'success';
        } catch (error) {
          return error instanceof Error ? error.message : 'Unknown error';
        }
      };

      expect(transformError(() => { throw new Error('Test'); })).toBe('Test');
      expect(transformError(() => {})).toBe('success');
    });
  });

  describe('Event ID Generation', () => {
    it('should generate unique event IDs', () => {
      const generateEventId = (txHash: string, logIndex: number): string => {
        return `${txHash}-${logIndex}`;
      };

      const txHash = '0x' + 'a'.repeat(64);

      expect(generateEventId(txHash, 0)).toBe(`${txHash}-0`);
      expect(generateEventId(txHash, 1)).toBe(`${txHash}-1`);
      expect(generateEventId(txHash, 0)).not.toBe(generateEventId(txHash, 1));
    });

    it('should create deterministic IDs for same input', () => {
      const generateEventId = (txHash: string, logIndex: number): string => {
        return `${txHash}-${logIndex}`;
      };

      const txHash = '0x' + 'b'.repeat(64);
      const id1 = generateEventId(txHash, 5);
      const id2 = generateEventId(txHash, 5);

      expect(id1).toBe(id2);
    });
  });

  describe('Timestamp Map Creation', () => {
    it('should create block number to timestamp mapping', () => {
      const blockTimestamps = [
        { blockNumber: 100n, timestamp: 1700000000 },
        { blockNumber: 101n, timestamp: 1700000012 },
        { blockNumber: 102n, timestamp: 1700000024 },
      ];

      const timestampMap = Object.fromEntries(
        blockTimestamps.map(({ blockNumber, timestamp }) =>
          [blockNumber.toString(), timestamp]
        )
      );

      expect(timestampMap['100']).toBe(1700000000);
      expect(timestampMap['101']).toBe(1700000012);
      expect(timestampMap['102']).toBe(1700000024);
      expect(timestampMap['999']).toBeUndefined();
    });

    it('should handle default timestamp for missing blocks', () => {
      const timestampMap: Record<string, number> = { '100': 1700000000 };

      const getTimestamp = (blockNumber: bigint): number => {
        return timestampMap[blockNumber.toString()] || 0;
      };

      expect(getTimestamp(100n)).toBe(1700000000);
      expect(getTimestamp(999n)).toBe(0);
    });
  });
});
