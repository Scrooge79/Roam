# Rich business data provider: Google Places (New)

ROAM currently uses OpenStreetMap for local places. Google Places support is staged in `lib/google-places.ts` but is **not wired into public search** and makes no requests without `GOOGLE_PLACES_API_KEY`.

## Before activation
1. Create a Google Cloud project with Places API (New) enabled and billing configured.
2. Restrict the API key to the appropriate server workload and only necessary APIs. Keep it server-side.
3. Configure Google Cloud billing budgets, quota limits, and alerts. Budgets are not hard spending caps.
4. Review Google Maps Platform Terms, attribution and caching restrictions, and the required display rules for Google content on non-Google maps.
5. Implement server-side throttling, request accounting, deduplication and provider-specific failure handling.
6. Decide whether to show Google-provided results separately or under an approved map experience; do not silently mix data into OSM records in a way that violates terms.
7. Implement a compliant photo media delivery path and photo attributions before enabling photos.
8. Add provider integration tests, verify actual billing SKUs and test real Durham searches.

**Important:** The adapter's field mask includes rich details and photo metadata, which may be billable. Do not call it for every search until costs and quotas are reviewed. Google Places may return up to 20 results in this initial adapter. It is not a comprehensive inventory.

No new API key, cloud project or billing account was created by this change.
