# ROAM release checklist

## Before public beta
- [ ] Provision PostgreSQL/PostGIS and apply migrations 001 and 002.
- [ ] Configure production providers and comply with licensing and attribution.
- [ ] Replace public Nominatim/Overpass reliance with an approved scalable solution.
- [ ] Introduce server-side request throttling and circuit breakers.
- [ ] Add automated integration tests for provider adapters and location search.
- [ ] Check location search, saved items, map embeds and mobile navigation.
- [ ] Validate date/time logic using each venue's timezone.
- [ ] Distinguish verified live status from mapped listings.
- [ ] Add privacy policy, data retention rules, and consent for location storage.
- [ ] Add accessibility testing, error reporting and uptime monitoring.
- [ ] Review dependency vulnerabilities and API usage costs.
- [ ] Verify production deployment and external APIs separately.

## Operational visibility
GET /api/status returns **configuration presence only**, not API connectivity. It never exposes credentials.
GET /api/health returns process health, not data freshness.
