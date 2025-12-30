# Contributing

## Setup

```bash
bun install
```

## Packages

| Package | Path            | Description        |
| ------- | --------------- | ------------------ |
| CLI     | `packages/cli`  | The npm package    |
| Docs    | `packages/docs` | Documentation site |

## Development

### CLI

```bash
cd packages/cli

# Run CLI directly
bun run src/cli.ts add lucide menu

# Watch mode
bun run dev

# Run tests
bun test

# Build
bun run build
```

### Docs

```bash
cd packages/docs

# Dev server
bun run dev

# Build
bun run build
```

## Scripts (root)

| Command          | Description                |
| ---------------- | -------------------------- |
| `bun run build`  | Build all packages         |
| `bun run check`  | Run checks on all packages |
| `bun run format` | Format code                |
| `bun test`       | Run tests                  |

## Guidelines

- Use Node.js `fs` module in CLI code (not Bun-specific APIs) for npm compatibility
- Run `bun run check` before committing
- Add tests for new utilities in `packages/cli/src/lib/`
