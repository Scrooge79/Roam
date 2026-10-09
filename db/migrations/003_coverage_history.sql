-- Apply after migrations 001 and 002, to a dedicated ROAM PostgreSQL database.
CREATE TABLE IF NOT EXISTS city_coverage_snapshots (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 city_label text NOT NULL,
 center geography(Point,4326) NOT NULL,
 radius_m integer NOT NULL CHECK(radius_m BETWEEN 250 AND 3000),
 places_count integer NOT NULL CHECK(places_count>=0),
 events_count integer NOT NULL CHECK(events_count>=0),
 hours_listed_count integer NOT NULL CHECK(hours_listed_count>=0),
 websites_listed_count integer NOT NULL CHECK(websites_listed_count>=0),
 unknown_hours_count integer NOT NULL CHECK(unknown_hours_count>=0),
 categories jsonb NOT NULL DEFAULT '{}'::jsonb,
 warnings jsonb NOT NULL DEFAULT '[]'::jsonb,
 measured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS city_coverage_snapshots_city_time_idx ON city_coverage_snapshots(lower(city_label),measured_at DESC);
CREATE INDEX IF NOT EXISTS city_coverage_snapshots_geo_idx ON city_coverage_snapshots USING gist(center);
-- No public read/write grants: keep snapshots accessible only to an authorized server role.
