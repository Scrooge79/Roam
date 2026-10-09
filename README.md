# ROAM

A location-first discovery experience for finding events, food, nightlife, activities, and hidden gems.

## Current status

**Phase 1 UI prototype.** All discovery cards are sample experiences, not real-time events or verified businesses. Time selection is not yet wired to a live provider. No external API keys are required.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Planned architecture

- Next.js App Router / TypeScript / Tailwind CSS
- PostgreSQL + PostGIS for places, events, and geospatial queries
- Provider adapters for permitted places and event APIs
- Background ingestion with deduplication, freshness metadata and cancellation handling
- Map exploration, travel-time filtering, and verified time-window search
- AI discovery grounded only in retrieved listing data

## Data quality rules

Do not invent live events, hours, ticket inventory, or reservation availability. Keep provider attribution, licensing constraints, last-seen timestamps, and source URLs. Do not expose API keys in client bundles or commit them to Git.
