<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Architecture & File Size Guidelines

## File Size Limit — Hard Rule

**No file may exceed 500 lines.** This is a hard constraint, not a suggestion.

- Before writing or editing a file, check its current line count.
- If adding code would push a file past 500 lines, split it first, then make your change.
- If you are asked to edit a file that already exceeds 500 lines, flag it to the user and propose a split before proceeding.

## Modular Architecture

### Component files (`src/components/`)
- One component per file.
- Co-locate sub-components only if they are not reused elsewhere and together stay under 500 lines. Otherwise extract to their own files.
- Group by feature, not by type:
  ```
  src/components/
    auth/
      LoginForm.tsx
      LoginForm.types.ts
    dashboard/
      StatCard.tsx
      StatCard.types.ts
  ```

### Page files (`src/app/`)
- Pages must only compose components — no business logic, no raw fetch calls, no inline styles beyond layout.
- If a page file grows beyond ~100 lines of JSX, extract sections into named components.

### Hooks (`src/hooks/`)
- One hook per file, named `use<Feature>.ts`.
- Hooks own data-fetching, local state, and derived state for a feature.
- Pages and components call hooks; they do not contain hook logic themselves.

### Utilities & helpers (`src/lib/` or `src/utils/`)
- Pure functions only — no React, no side effects.
- Group by domain (e.g., `src/lib/date.ts`, `src/lib/api.ts`).
- Do not create a single `utils.ts` catch-all.

### Types (`src/types/`)
- Shared, cross-feature types live here.
- Local types that are only used within one component or hook stay in a sibling `.types.ts` file.

### API / data layer (`src/services/` or `src/api/`)
- All network calls go here, never directly in components or pages.
- One file per resource/domain (e.g., `src/services/user.ts`, `src/services/product.ts`).

## Splitting Rules

When a file needs to be split, prefer these strategies in order:

1. **Extract a custom hook** — if the file has stateful logic mixed with JSX.
2. **Extract a child component** — if a visual section can stand alone.
3. **Extract a helper module** — if there are pure utility functions inside the file.
4. **Extract types** — move type/interface definitions to a `.types.ts` sibling.

Always update imports after splitting. Never leave dead exports.

## What NOT to do

- Do not create barrel `index.ts` files that just re-export everything — they hide real locations.
- Do not co-locate unrelated concerns in one file just because they are small.
- Do not add abstraction layers for single-use code.
- Do not solve a file-size problem by collapsing code (minifying, removing blank lines, etc.).

---

# Data Fetching — Hard Rule

## Always use the project's standard hooks. Never use raw `useQuery`, `useMutation`, or `axios` directly in components, pages, or context.

### GET requests → `useFetchApi`
- File: `src/hooks/useFetchApi.ts`
- Wraps `useQuery`. Handles errors, 401 redirects, and caching automatically.
- Usage:
  ```ts
  const { data, loading, retrieve } = useFetchApi<MyType>({
    endpoint: "/v1/some/endpoint",
  });
  ```
- Use `retrieveWithAttrs(endpoint)` when the URL needs dynamic segments at call time.

### POST / PUT / PATCH / DELETE → `useMutationApi`
- File: `src/hooks/useMutationApi.ts`
- Wraps `useMutation`. Handles error toasts automatically.
- Usage:
  ```ts
  const mutation = useMutationApi<ResponseType, PayloadType>({
    method: "post",          // "post" | "put" | "patch" | "delete"
    endpoint: "/v1/some/endpoint",
  });
  mutation.mutate({ field: "value" });
  ```
- To hit a dynamic URL (e.g. `/v1/cart/items/:id`), pass `dynamicEndpointSuffix` in the payload:
  ```ts
  mutation.mutate({ dynamicEndpointSuffix: itemId, quantity: 2 });
  // resolves to PUT /v1/cart/items/{itemId}
  ```
- `onSuccess` and `onError` callbacks can be passed to the hook options.
