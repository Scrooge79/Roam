# Data reliability and provider resilience

## Cache strategy
- Use server-side source snapshots keyed by provider and normalized query bucket.
- Serve fresh cached records first; revalidate in the background.
- During provider failure, serve last-known data only with visible "last verified" metadata and a stale warning.
- Expire cancelled events immediately when a provider reports a cancellation.
- Never infer that an event has ended when its end time is unknown.
- Do not represent OSM opening_hours as verified open-now status.

## Operational readiness
- Current public Overpass and Nominatim endpoints are prototype-only and have usage policies and rate limits.
- A production provider or self-hosted ingestion infrastructure is required before significant traffic.
- Set provider-specific rate limits, exponential backoff and circuit breakers.
- Do not send personal GPS coordinates to third-party APIs without user action and a clear privacy notice.
- Database migrations are source-controlled but have not yet been applied.
- Avoid exposing database credentials in client-side code.

## Data lineage
Each record should include source provider, external ID, fetched timestamp, source URL, normalized category, and cancellation/closure status. The UI should distinguish verified listings from suggestions.
