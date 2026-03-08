# Platform Integrations

This repository is wired for the following platform-level integrations.

## Git and GitHub

- Git is the source of truth for collaboration.
- GitHub Actions can run CI and Cloudflare deployment jobs.

## Cloudflare

### Pages

- Static app can be deployed from the repository root with the `deploy-pages.yml` workflow.
- Set repository variable `CLOUDFLARE_PAGES_PROJECT` to your Pages project name.

### User AI Worker

- Directory: `rino/`
- Main chat endpoint: `/mcp/v1/chat`
- REST helpers:
  - `GET /api/integrations/status`

### Local Worker Secrets

Copy the example file before local development:

- `rino/.dev.vars.example` -> `rino/.dev.vars`

Required secrets:

- `OPENAI_API_KEY`

## Frontend Runtime Config

The static frontend reads runtime values from `window.RinoRuntimeConfig`.

Tracked defaults live in:

- `src/shared/runtime-config.js`

You can override them in a custom script before app boot:

- `runtime-config.example.js`
