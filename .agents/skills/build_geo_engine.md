# Skill: Compile GEO Engine and Multi-Tenant Domain Router

## Objective
Program the logic that dynamically shifts the public gate architecture from a simple webpage to a high-density, multi-tenant GEO generator mapping to `.reviews` extensions.

## Execution Sequence

### 1. Refactor Express Server Route (`server.ts`)
* Modify `app.get('/profiles/:username')` to intercept the hostname. If the hostname ends with `.reviews`, automatically treat the request as a premium entity hub.
* Pull relevant datasets (Agent, Knowledge, FAQs, Reviews) out of Teable simultaneously using the environment credentials.
* Dynamically compile the deep-nested `schema.org` JSON-LD graph payload. Ensure all string inputs are properly escaped to prevent parsing breaks.

### 2. Format the Synthesis HTML Layer
* Rewrite the public profile frontend interface. Format the Teable `Local_Knowledge` strings into explicit long-tail question sections using `H2` tags.
* Enforce the "Answer-First" constraint: Ensure the immediate response paragraph block leads with a direct factual claim within the first 20 words.
* Build an asynchronous loading structure for the client-side review grid, calling the `/api/analytics/click` endpoint to increment `Modal_Click_Count` cleanly.

### 3. Add the OpenClaw Pipeline Hooks
* Expose a secure API route at `/api/openclaw/incoming-listing`. This endpoint will receive incoming payload hooks from the OpenClaw background agent when a new property is processed, write the optimized data arrays directly to Teable, and trigger dynamic submissions to the Bing and Google Indexing APIs.
