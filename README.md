# Memo

A full-stack note taking app built with Next.js 14, Prisma and PostgreSQL. Features include rich text editing, tagging, pinning, archiving and soft deletion with automatic sync and autosave.

## Tech stack

- [Next.js 14 (App Router)](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) + PostgreSQL
- [NextAuth.js](https://next-auth.js.org/) with Email & Google providers
- [TipTap](https://tiptap.dev) rich text editor
- [Vitest](https://vitest.dev) & Testing Library for tests

## Getting started

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Create an `.env` file based on `.env.example` and update the values.
3. Apply database migrations

   ```bash
   pnpm prisma migrate dev
   ```

4. Generate the Prisma client

   ```bash
   pnpm prisma generate
   ```

5. Start the development server

   ```bash
   pnpm dev
   ```

## Testing & quality

- `pnpm lint` – run ESLint
- `pnpm typecheck` – run TypeScript type checker
- `pnpm test` – run Vitest unit tests

CI runs lint, typecheck and tests automatically for pull requests and pushes to `main`.
