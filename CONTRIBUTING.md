# Contributing

## Setup

```bash
bun install
```

## Development

```bash
# Run CLI directly
bun run src/cli.ts add menu

# Watch mode
bun run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build for npm distribution |
| `bun run check` | Run format, lint, and typecheck |
| `bun run format` | Format code |
| `bun test` | Run tests |

## Project Structure

```
src/
  cli.ts              # CLI entry point
  generator.ts        # Liquid snippet generator
  commands/
    add.ts            # Add command
    search.ts         # Search command
  lib/
    utils.ts          # Shared utilities
    utils.test.ts     # Unit tests
```

## Guidelines

- Use Node.js `fs` module instead of Bun-specific APIs (e.g., `Bun.file()`) since the CLI is distributed via npm
- Run `bun run check` before committing
- Add tests for new utilities in `src/lib/`
