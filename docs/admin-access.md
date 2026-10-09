# ROAM operations access

The `/coverage` dashboard is an internal operational preview. It is protected by HTTP Basic authentication configured using server-only environment variables.

## Required environment variables
- `ROAM_ADMIN_USER`: a dedicated username
- `ROAM_ADMIN_PASSWORD`: a long, randomly generated password

Configure both in Vercel Project Settings > Environment Variables and redeploy.

**Fail closed:** Until both variables are configured, `/coverage` returns HTTP 503 instead of exposing operational tools.

## Security limitations
HTTP Basic authentication is a temporary access gate, not full admin identity management. For public beta, replace it with an authenticated admin session, role-based access control, audit logging, CSRF protections for future mutations, and rate limiting. Only use over HTTPS. Never place admin credentials in GitHub, public client variables, or screenshots.

## Operational cost
Each city comparison performs multiple third-party requests. Keep comparison sizes bounded and do not schedule large-scale scans on public community endpoints.
