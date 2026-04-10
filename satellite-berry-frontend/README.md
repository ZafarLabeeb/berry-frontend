# Forest Intelligence — Satellite Berry Prediction Frontend

A production-oriented single-page frontend for a satellite berry prediction API.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS with CSS variable design tokens
- TanStack Query
- Zod runtime validation
- Framer Motion
- React Hook Form
- Axios
- Vitest + React Testing Library + MSW
- ESLint + Prettier

## Features

- Drag-and-drop image upload with file picker fallback
- Client-side image type and max-size validation
- Optional deterministic seed input
- Loading feedback with progress-style UI
- Runtime validation of backend responses with Zod
- Error normalization with retry action
- Last successful result remains visible after failed retries
- Prediction summary for land cover, soil, and selected berry
- Berry probability cards and top-model probability chart
- Original vs masked image comparison with:
  - split view
  - masked only
  - before / after slider
- Responsive layout for mobile, tablet, and desktop
- Accessible status announcements and focus-visible states

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build, test, and lint

```bash
npm run build
npm run test
npm run lint
```

## Environment configuration

Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT_MS=30000
```

## Backend contract used by the app

### Health check

- `GET /health`
- expects `{ "status": "ok" }`

### Prediction

- `POST /predict`
- multipart form field: `file`
- optional query param: `seed`

The response is validated against the schema in:

- `src/lib/schemas/prediction.ts`

## Project structure

```text
src/
  app/
  components/
  features/prediction/
  lib/api/
  lib/schemas/
  lib/utils/
  styles/
  tests/
```

## Architecture decisions

### 1. Form state stays local

`react-hook-form` manages the upload file and optional seed. There is no global client state because the flow is contained to a single dashboard.

### 2. Network state uses TanStack Query mutations

Prediction requests use a mutation so loading, success, and error states stay explicit and easy to test.

### 3. Runtime API validation happens before rendering

The backend response is parsed with Zod before any UI reads it. Unexpected payloads are converted into friendly `ApiError` instances.

### 4. Last success is stored separately from mutation state

This lets the UI keep the previous successful prediction visible when a later request fails.

### 5. Chart stays lightweight

The probability chart is custom-rendered and lazy-loaded. This avoids a large chart dependency while still satisfying the bar chart requirement.

### 6. Theme tokens are centralized

The Forest Intelligence theme is driven by CSS variables for easy restyling.

## Where to change styling

### Theme tokens

Edit:

- `src/styles/theme.css`

This file contains the core palette, surface colors, accents, and semantic token values.

### Tailwind semantic mapping

Edit:

- `tailwind.config.ts`

This file maps the CSS variables into reusable Tailwind utility names like `bg-surface`, `text-foreground`, `bg-forest-600`, and `bg-berry-700`.

### Global atmospheric treatment

Edit:

- `src/styles/index.css`
- `src/app/AppShell.tsx`

These files control the page background gradients, texture overlay, and abstract glowing shapes.

## Where to change backend configuration

Edit the `.env` value:

- `VITE_API_BASE_URL`

You can also inspect the Axios setup in:

- `src/lib/api/client.ts`

## Testing coverage included

- schema validation test
- upload flow success test
- upload validation error test
- backend error rendering test
- request lifecycle integration test with retry and result retention

## Accessibility notes

- keyboard-accessible upload zone
- labeled seed input and upload control
- screen-reader status region for loading and result updates
- alert semantics for backend errors
- visible focus states across controls

## Notes

- The masked image is decoded from Base64 using a dedicated utility in `src/lib/utils/base64.ts`.
- Upload previews attempt client-side downscaling before display when browser APIs allow it.
