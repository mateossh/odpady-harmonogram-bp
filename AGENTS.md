# AGENTS.md

Updated guidelines for agentic contributors working inside `odpady-harmonogram-bp`. Treat this handbook as the primary coordination surface; update it whenever the workflow changes.

## Project Snapshot
1. **Stack**: Astro 5 + TypeScript on Bun 1.3.x.
2. **Purpose**: Serve an iCalendar schedule (`schedule.ics`) plus a minimal marketing page for Boguty-Pianki waste pickups.
3. **Key paths**: `src/pages` (routes), `src/components` (Astro UI), `src/lib` (helpers like `ics.ts`), `src/styles/global.css` (Tailwind directives), `data.jsonl` (schedule source), `.config/` (lint/format/server configs).
4. **Entry points**: `src/pages/index.astro` (landing), `src/pages/schedule.ics.ts` (ICS feed), `src/pages/robots.txt.ts` (SEO helpers).
5. **Infra**: Optional local proxy stack using Caddy + CoreDNS for device testing.

## Toolchain + Environment
1. Use **Bun** for every package/task command (`bun install`, `bun run`, `bun test`).
2. Node, npm, pnpm, and Yarn are unsupported—do not introduce them.
3. Type checking relies on `tsconfig.json` (ESNext target, bundler module resolution, strict mode, Astro TS plugin).
4. Paths may use the `@/` alias mapped to the repository root.
5. `.env` automatically loads through Bun; avoid third-party dotenv helpers.

## Command Playbook
1. **Install deps**: `bun install` (run after cloning or lockfile changes).
2. **Dev server**: `bun dev` → Astro dev server on `localhost:4321`.
3. **Build**: `bun build` → outputs production assets to `dist/`.
4. **Preview build**: `bun preview` → serves the build artifcats locally.
5. **Astro CLI passthrough**: `bun astro <command>` (examples: `bun astro check`, `bun astro add tailwind`).
6. **Type check only**: `bun run tsc` (no emit, honors strict compiler flags).
7. **Lint**: `bun lint` (oxlint with `--type-aware --type-check --deny-warnings`).
8. **Lint w/ fixes**: `bun lint:fix` (safe auto-fixes, still type-aware).
9. **Format**: `bun format` (oxfmt, includes Tailwind-aware sorting per `.config/.oxfmtrc.jsonc`).
10. **Format check**: `bun format:check` (CI-style verification, fails on drift).
11. **Run CoreDNS**: `bun coredns` (uses `.config/Corefile`, requires Homebrew `coredns`).
12. **Run Caddy**: `bun caddy` (uses `.config/Caddyfile`, requires Homebrew `caddy`).

## Testing Guide
1. No repo tests exist yet; create `*.test.ts` using `bun:test` when adding logic.
2. **All tests**: `bun test`.
3. **Single file**: `bun test src/lib/ics.test.ts` (replace with actual file path).
4. **Single test name**: `bun test --filter "should export ICS"`.
5. **Watch mode**: `bun test --watch` for rapid iterations.
6. Keep tests colocated with the feature (`src/lib/feature.test.ts`) and avoid global side effects.
7. Prefer `bun:test` matchers (`expect`, `describe`, `mock.module`) over Jest/Vitest APIs.

## Linting Expectations (oxlint)
1. Configuration lives in `.config/.oxlintrc.json`; treat warnings as blocking failures.
2. `typescript/no-floating-promises` requires explicit awaiting or `void` discards.
3. `typescript/no-meaningless-void-operator` rejects returning `void` inside expressions; be explicit.
4. Accessibility rules (JSX-A11y) still apply inside Astro components.
5. `unicorn/*` rules prefer modern APIs such as `Set#size` and `String#startsWith`.
6. Avoid disabling lint rules; when desperate, localize the disable comment and justify it nearby.

## Formatting Principles (oxfmt)
1. Global width is 80 characters—refactor long expressions instead of ignoring the limit.
2. Tailwind class lists get canonicalized; keep semantic structure but let oxfmt finalize order.
3. Indent with two spaces across TypeScript, Astro, JSON, and CSS.
4. Semicolons stay enabled in TS helpers; mirror the existing style when editing JS interop.
5. Separate import groups with single blank lines (external, internal alias, relative).

## Import Strategy
1. Use native ES module syntax only (`import { foo } from "bar"`).
2. Type-only imports belong in `import type { Foo } from "./types"` to aid bundler tree shaking.
3. Favor named exports; default exports are acceptable only for Astro components already authored that way.
4. When pulling icons from `@lucide/astro` or `src/components/icons`, import components and pass props explicitly instead of spreading arbitrary attributes.
5. Use the `@/` alias for cross-cutting modules, but prefer short relatives for same-folder references to reduce churn.

## Naming & Files
1. Files in `src/components` and `src/layouts` use PascalCase (`Button.astro`).
2. Helpers/utilities in `src/lib` prefer descriptive lowercase names (`ics.ts`, `utils.ts`).
3. Page routes stay lowercase and descriptive (`schedule.ics.ts`).
4. Variables and functions use camelCase; constants shared broadly use UPPER_SNAKE_CASE.
5. Types, interfaces, and enums use PascalCase with descriptive suffixes (`WasteEvent`, `CalendarLinkProps`).
6. Avoid one-letter names except inside trivial iterator callbacks.

## TypeScript Guidance
1. Embrace strict compiler settings: annotate function boundaries and avoid `any`.
2. Leverage discriminated unions for schedule item kinds (`type WasteKind = "mixed" | "glass"`).
3. Use `satisfies` to ensure large objects honor contract types while retaining inference.
4. Move heavy logic from `.astro` files into `.ts` modules for reuse and typed coverage.
5. `noUncheckedIndexedAccess` means array lookups return `T | undefined`; guard accordingly.

## Error Handling
1. Wrap async data access (reading `data.jsonl`, generating ICS) with try/catch, then rethrow contextual errors.
2. Prefer throwing `Error` subclasses over returning sentinel values.
3. Use `Astro.redirect`/`Astro.error` inside server endpoints when responding to invalid requests.
4. When interacting with Bun APIs (`Bun.file`, `Bun.serve`), verify existence and handle failures gracefully.
5. For external requests (if added later), guard timeouts and provide fallback UI messaging.

## Astro Component Patterns
1. Layout-wide metadata belongs in `src/layouts/Layout.astro`; extend it rather than duplicating `<head>` tags.
2. Keep server-side code inside the top `---` script block; render logic stays in the markup section.
3. Use scoped components (`<Tooltip>`, `<Button>`) instead of duplicating class stacks.
4. When mapping arrays, ensure stable keys (IDs, URLs) to avoid hydration mismatches.
5. Outbound links must specify `rel="noopener noreferrer"` and track analytics attributes (`data-umami-*`).

## Styling + Tailwind
1. Central Tailwind directives live in `src/styles/global.css`; add new layers there instead of scattering CSS files.
2. Prefer utility classes; when combinations repeat, promote them into component props or helpers.
3. Use the `tw-animate-css` plugin for animations and align naming with plugin docs.
4. Maintain responsive typography similar to the hero block in `index.astro` for brand consistency.
5. Size icons via classes and avoid inline styles so Tailwind + oxfmt can normalize them.

## Data + ICS Generation
1. `data.jsonl` is the single source of truth for pickup dates; each line is a valid JSON object with ISO date, waste kind, and optional notes.
2. Extend `src/lib/ics.ts` for ICS output; keep it pure and usable by both routes and future CLI tasks.
3. Keep timezone handling explicit—Boguty-Pianki uses Europe/Warsaw (CET/CEST) and DST awareness matters.
4. Avoid fetching live municipal data during build; treat updates as manual data refreshes.
5. After modifying the ICS endpoint, verify that Calendar clients (Apple, Google, Outlook) continue to parse it; add smoke tests when helpers gain complexity.

## Localization
1. Polish copy is canonical; if adding English strings, gate them behind clear toggles or translation maps.
2. Dates displayed in UI should pass through Intl APIs with `pl-PL` locale or copy-driven wording.
3. Keep analytics labels in English to simplify dashboards (`data-umami-event-type`).

## Accessibility & UX
1. Buttons with `data-disabled="true"` should also convey state via `aria-disabled` or tooltips (see Outlook button).
2. Provide text alternatives for standalone icons via `aria-label` or visually-hidden spans.
3. Respect reduced-motion preferences when adding animations; prefer CSS `@media (prefers-reduced-motion: reduce)` guards.
4. Ensure minimum contrast for new color tokens; base palette is neutral grays and accent neutrals.

## Performance Notes
1. Keep bundle lean—import only the Lucide icons in use.
2. Use Astro’s partial hydration sparingly; the current site is static, so resist adding heavyweight client frameworks unnecessarily.
3. Prefer build-time transforms (Astro content collections, `@astrojs/check`) over runtime manipulations.
4. Monitor `bun build` output size when introducing dependencies; lazy-load heavy modules when possible.

## Infrastructure & Deployment
1. Production deploy expects `bun build` artifacts; do not commit `dist/`.
2. Caddy + CoreDNS configuration lives in `.config/`; edit them only when adjusting local DNS for device testing.
3. Document any changes to these configs directly inside the files via comments so future agents know the rationale.
4. If deploying behind custom domains, update `astro.config.ts` `site` and `server.allowedHosts` simultaneously.

## Cursor & Copilot Rules
1. There are currently **no** `.cursor/rules` or `.github/copilot-instructions.md` files; this document is the authoritative rule set.
2. If such rule files appear later, mirror their instructions here and treat them as overriding scopes for affected directories.

## Contribution Workflow Checklist
1. Read this AGENTS.md fully before making changes.
2. Install dependencies (`bun install`).
3. Run `bun lint`, `bun format:check`, and `bun run tsc` before opening a PR.
4. Add or run `bun test` whenever logic changes—include the single-test command in your bug report if relevant.
5. Keep commits scoped and reference issues/notes succinctly.
6. Update `README.md` if your change affects user-facing setup or commands.
7. Mention any known limitations or follow-ups in PR descriptions.

## Validation Before Hand-off
1. Pages render locally via `bun dev`, and any network/config changes are documented.
2. Lint + format pass cleanly with no warnings.
3. Tests (present or newly added) succeed, and individual commands are documented (`bun test path/to/file.test.ts`).
4. TypeScript compiler reports zero errors.
5. AGENTS.md remains accurate—if your change invalidates any instruction above, revise this file in the same PR.
