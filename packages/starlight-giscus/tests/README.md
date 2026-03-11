# Tests

This directory contains unit tests for the starlight-giscus plugin.

## Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Run tests with coverage
pnpm run test:coverage

# Type check
pnpm run typecheck
```

## Test Coverage

Current coverage: **100%**

- `validate-config.test.ts` (17 tests) - Configuration validation and normalization
- `override-component.test.ts` (6 tests) - Starlight component override logic
- `vite-plugin.test.ts` (7 tests) - Vite virtual module plugin
- `plugin.test.ts` (7 tests) - Main plugin integration and hooks

**Total: 37 tests**

## Test Structure

Each test file follows the pattern:
- Unit tests for individual functions
- Edge case testing
- Error handling validation
- Integration testing where applicable

## Coverage Details

All source files have 100% coverage:
- `index.ts` - 100% (statements, branches, functions, lines)
- `libs/starlight.ts` - 100%
- `libs/vite.ts` - 100%
