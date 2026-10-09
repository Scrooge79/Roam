-- ROAM source-aware cache and ingestion checkpoints.
-- Requires 001_initial.sql.
CREATE TABLE IF NOT EXISTS ingestion_runs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 provider text NOT NULL,
 started_at timestamptz NOT NULL DEFAULT now(),
 finished_at timestamptz,
 status text NOT NULL DEFAULT 'running' CHECK(status IN ('running','success','partial','failed')),
 records_seen integer NOT NULL DEFAULT 0 CHECK(records_seen>=0),
 records_written integer NOT NULL DEFAULT 0 CHECK(records_written>=0),
 error_summary text
);
CREATE INDEX IF NOT EXISTS ingestion_runs_provider_started_idx ON ingestion_runs(provider,started_at DESC);
CREATE TABLE IF NOT EXISTS source_snapshots (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 provider text NOT NULL,
 source_key text NOT NULL,
 source_url text,
 fetched_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL,
 payload jsonb NOT NULL,
 checksum text,
 CONSTRAINT snapshot_expiration CHECK(expires_at>fetched_at),
 UNIQUE(provider,source_key)
);
CREATE INDEX IF NOT EXISTS source_snapshots_expires_idx ON source_snapshots(expires_at);
ALTER TABLE venues ADD COLUMN IF NOT EXISTS last_verified_at timestamptz;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS listing_status text NOT NULL DEFAULT 'unverified'
 CHECK(listing_status IN ('unverified','active','temporarily_closed','permanently_closed'));
CREATE INDEX IF NOT EXISTS venues_verified_idx ON venues(last_verified_at DESC);
-- No public grants are added: application access must use a restricted server-side DB role.
