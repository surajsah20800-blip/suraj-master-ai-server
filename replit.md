# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Gemini 3-flash-preview via Replit AI Integrations

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## AI Chatbot API Endpoints

### POST /api/ai/chat
Send a message to the AI chatbot (ZephyrAI).

**Request:**
```json
{
  "message": "Hello!",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```
**Response:**
```json
{
  "reply": "AI response with emojis and humor",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### POST /api/ai/image-search
Search for an image URL.

**Request:**
```json
{ "query": "Eiffel Tower" }
```
**Response:**
```json
{
  "imageUrl": "https://...",
  "title": "Image title",
  "source": "Source name"
}
```

## AI Personality (ZephyrAI)
- Uses Gemini `gemini-3-flash-preview` model
- Human-like, witty, funny personality
- Responds in ANY language the user writes in
- Uses emojis naturally
- Knows about everything in the world
- Tells jokes and shares fun facts

## Gemini Conversation Endpoints (SSE)
- `GET /api/gemini/conversations` — list conversations
- `POST /api/gemini/conversations` — create conversation
- `GET /api/gemini/conversations/:id` — get conversation with messages
- `DELETE /api/gemini/conversations/:id` — delete conversation
- `POST /api/gemini/conversations/:id/messages` — send message (SSE stream)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
