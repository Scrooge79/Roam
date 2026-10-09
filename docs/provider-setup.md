# Connecting real discovery data

## Ticketmaster
1. Create or locate a Ticketmaster Discovery API key in your own authorized developer account.
2. In Vercel > ROAM > Settings > Environment Variables, add `TICKETMASTER_API_KEY` for production and preview as appropriate.
3. Redeploy the latest commit to make the environment variable available to the running app.
4. Open ROAM, enter a city and state, and select **Find live events**.
5. Confirm returned results against the event organizer and Ticketmaster listings.

Never paste keys into chat, commit them into GitHub, or put them in `NEXT_PUBLIC_*` variables.

## Venues and activities
Planned adapters must comply with provider licensing, attribution and retention requirements. Database schema is in `db/migrations/001_initial.sql`. This migration is not applied automatically; provision a PostgreSQL/PostGIS database first.

## Verification
The health endpoint at `/api/health` reports application health, not upstream data availability. A provider returning no events is not proof that there are no local events.
