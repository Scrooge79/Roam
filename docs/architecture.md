# ROAM discovery architecture

## Product principles
- Places, events, recurring offers and experiences are separate entities linked by venue IDs.
- Never claim an event is live or a business is open without a dated source.
- User location is optional; search by city and ZIP must work without geolocation.
- Keep personal location ephemeral unless the user explicitly opts into saving it.

## Planned database
- venues: id, name, address, lat/lng geography(Point,4326), timezone, categories, source provenance
- events: id, venue_id, title, starts_at, ends_at, status, source_url, last_verified_at
- offers: id, venue_id, recurrence, valid_from, valid_until, source_url
- provider_records: provider, external_id, entity_type, entity_id, fetched_at, checksum, raw payload retention policy
- user_lists: id, user_id, title, visibility

## Ingestion pipeline
1. Fetch licensed feeds and permitted public calendars on provider-specific schedules.
2. Normalize timezone-aware dates and coordinates; reject incomplete events.
3. Deduplicate by external ID, venue, normalized title and start-time proximity.
4. Retain source URL, verification timestamp and cancellation status.
5. Reconcile deletions and postponements; expire stale records.
6. Serve geospatial results with distance, time window, category and freshness filters.

## Security
- Provider credentials are server-side only.
- Validate external URLs and all request inputs; rate limit ingestion and search.
- Apply per-provider attribution and retention constraints.
- Never expose private coordinates in public share URLs.

## Launch milestones
1. Responsive browsing and search prototype (in progress)
2. Database, migrations and seed fixtures
3. Licensed venue and event provider adapters
4. Map and time-aware verified discovery
5. Saved plans, AI itinerary grounding and group voting
6. Observability, accessibility and deployment hardening
