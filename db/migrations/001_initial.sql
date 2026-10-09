-- ROAM initial geospatial schema. Apply to PostgreSQL with PostGIS enabled.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS venues (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 address text,
 city text NOT NULL,
 region text,
 country_code char(2) NOT NULL DEFAULT 'US',
 timezone text NOT NULL,
 location geography(Point,4326),
 categories text[] NOT NULL DEFAULT '{}',
 website_url text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS venues_location_idx ON venues USING gist(location);
CREATE INDEX IF NOT EXISTS venues_city_region_idx ON venues (lower(city),lower(region));
CREATE TABLE IF NOT EXISTS events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 venue_id uuid REFERENCES venues(id) ON DELETE SET NULL,
 title text NOT NULL,
 description text,
 starts_at timestamptz NOT NULL,
 ends_at timestamptz,
 status text NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','cancelled','postponed')),
 source_url text NOT NULL,
 last_verified_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT event_time_order CHECK(ends_at IS NULL OR ends_at>=starts_at)
);
CREATE INDEX IF NOT EXISTS events_start_status_idx ON events(starts_at,status);
CREATE INDEX IF NOT EXISTS events_venue_idx ON events(venue_id);
CREATE TABLE IF NOT EXISTS provider_records (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 provider text NOT NULL,
 external_id text NOT NULL,
 entity_type text NOT NULL CHECK(entity_type IN ('venue','event','offer')),
 venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
 event_id uuid REFERENCES events(id) ON DELETE CASCADE,
 fetched_at timestamptz NOT NULL DEFAULT now(),
 checksum text,
 UNIQUE(provider,external_id,entity_type)
);
CREATE INDEX IF NOT EXISTS provider_records_fetched_idx ON provider_records(fetched_at);
-- This schema deliberately does not expose public write policies or unauthenticated mutation endpoints.
