# ROAM implementation roadmap

## Currently shipped
- Mobile-first Next.js discovery UI with category and text search
- Demo experiences clearly marked as examples
- Saved-item browser persistence
- Server-side Ticketmaster adapter (requires key)
- Location and city-based event searches
- Event status/verification schema and geospatial migration (not provisioned)

## Next
1. Provider-neutral normalized venue/event repository
2. Production PostgreSQL with PostGIS and migrations
3. Licensed geocoding and places provider
4. Interactive map with real markers and bounds search
5. Timezone-aware event filtering and cancellation reconciliation
6. Real venue detail pages and event detail pages
7. Observability, automated tests, accessibility audit, performance budgets

## Guardrails
- Never use demo coordinates as if they are live venue positions.
- Never display invented opening hours or available reservations.
- Never store exact user coordinates without informed consent.
- Provider secrets must remain server-side.
