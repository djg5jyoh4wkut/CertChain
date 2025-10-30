# CertChain Unit Tests

This directory contains comprehensive unit tests for the CertChain FHE-based quota distribution system.

## Test Structure

```
tests/
├── fhe.test.ts           # FHE SDK encryption/decryption tests
├── allocation.test.ts    # Allocation logic and validation tests
├── utils.test.ts         # Utility functions tests
└── README.md            # This file
```

## Test Coverage

### 1. FHE Module Tests (`fhe.test.ts`)

Tests for Fully Homomorphic Encryption functionality:

- **SDK Initialization**
  - Initialize FHE SDK successfully
  - Reuse existing FHE instance
  - Handle missing Ethereum provider

- **Encryption**
  - Encrypt quota amounts with different values
  - Handle zero amounts
  - Handle large amounts within uint64 range
  - Validate contract address format

- **Decryption**
  - Decrypt quota amounts successfully
  - Handle invalid handle format

- **Edge Cases**
  - Network disconnection handling
  - Concurrent encryption requests
  - Mixed case addresses
  - Data format validation

### 2. Allocation Logic Tests (`allocation.test.ts`)

Tests for allocation business logic:

- **Amount Conversion**
  - Convert quota with 6 decimal precision
  - Handle decimal quota values
  - Handle small and large amounts
  - Validate uint64 overflow protection

- **Address Validation**
  - Validate correct Ethereum addresses
  - Reject invalid addresses
  - Handle case-insensitive addresses

- **Business Rules**
  - Allow positive allocation amounts
  - Reject zero or negative allocations
  - Handle very small decimal amounts

- **Batch Allocation**
  - Handle multiple recipient addresses
  - Reject duplicate addresses
  - Handle empty and large batch sizes

- **Input Sanitization**
  - Trim whitespace from addresses
  - Handle quoted amounts
  - Handle amounts with commas

### 3. Utility Functions Tests (`utils.test.ts`)

Tests for helper utilities:

- **Address Formatting**
  - Format Ethereum addresses (0x1234...5678)
  - Handle zero and max addresses
  - Maintain case sensitivity

- **Timestamp Formatting**
  - Format recent timestamps as "ago"
  - Handle zero and future timestamps
  - Format very old timestamps

- **Amount Formatting**
  - Convert Wei to tokens with 6 decimals
  - Handle decimal tokens
  - Handle very small and large amounts

- **Data Validation Helpers**
  - Validate non-empty strings
  - Detect empty strings
  - Validate positive numbers

- **String Operations**
  - Truncate long strings
  - String padding and replacement
  - Case conversion

- **Array Operations**
  - Filter unique items
  - Sort and transform items
  - Handle empty arrays

- **Error Handling**
  - Try-catch blocks
  - Handle undefined and null values
  - Nullish coalescing

## Running Tests

### Install Dependencies

```bash
yarn add -D vitest @vitest/ui
```

### Run All Tests

```bash
yarn test
```

### Run Tests in Watch Mode

```bash
yarn test:watch
```

### Run Tests with Coverage

```bash
yarn test:coverage
```

### Run Specific Test File

```bash
yarn test fhe.test.ts
yarn test allocation.test.ts
yarn test utils.test.ts
```

### Run Tests with UI

```bash
yarn test:ui
```

## Test Configuration

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

Create `vitest.config.ts` in project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Writing New Tests

### Best Practices

1. **Descriptive Test Names**
   ```typescript
   it('should encrypt quota amount with 6 decimal precision', () => {
     // Test implementation
   });
   ```

2. **Arrange-Act-Assert Pattern**
   ```typescript
   it('should format address correctly', () => {
     // Arrange
     const address = '0x1234567890123456789012345678901234567890';
     
     // Act
     const formatted = formatAddress(address);
     
     // Assert
     expect(formatted).toBe('0x1234...7890');
   });
   ```

3. **Test Edge Cases**
   - Zero values
   - Maximum values
   - Invalid inputs
   - Empty inputs
   - Null/undefined

4. **Mock External Dependencies**
   ```typescript
   vi.mock('../src/lib/fhe', () => ({
     initializeFHE: vi.fn(),
     encryptQuotaAmount: vi.fn(),
   }));
   ```

5. **Use Test Data Builders**
   ```typescript
   const createTestAddress = () => '0x' + '1'.repeat(40);
   const createTestAmount = (tokens: number) => BigInt(tokens * 1000000);
   ```

## Coverage Goals

- **Overall Coverage**: > 80%
- **Critical Paths**: > 95%
  - FHE encryption/decryption
  - Transaction submission
  - Amount validation
- **UI Components**: > 70%
- **Utility Functions**: > 90%

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: yarn install
      - run: yarn test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure `vitest.config.ts` has correct path aliases
   - Check that `@/` points to `./src`

2. **Mock Not Working**
   - Place mocks before imports
   - Use `vi.mock()` at module scope

3. **Async Test Timeouts**
   - Increase timeout: `it('test', async () => {...}, 10000)`
   - Check for unresolved promises

4. **Window/DOM Not Available**
   - Set environment to 'jsdom' in config
   - Mock browser APIs if needed

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Add tests to appropriate file
4. Update this README if needed
5. Maintain > 80% coverage

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
