# Production Deployment & DevOps Guide

This document provides instructions for deploying KRESTA across containerized environments, cloud providers, and production Kubernetes/Docker Compose stacks.

---

## 1. Containerized Deployment with Docker Compose

The Compose stack runs PostgreSQL, the FastAPI backend, and the Vite-built frontend served by Nginx.

```bash
# Copy the template, then set POSTGRES_PASSWORD and replace SECRET_KEY privately.
cp .env.example .env
docker compose up --build -d
```

Use a URL-safe value for `POSTGRES_PASSWORD`, because Compose constructs the PostgreSQL connection URL from it. If `AUTO_SEED=True` and you want seeded demo users, also set a strong `DEMO_USER_PASSWORD` in `.env`. Neither value belongs in Git.

- Frontend: `http://localhost:5173`
- Backend API/docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

## 2. Vercel Frontend and Render Backend

Deploy the frontend and backend as separate services. The repository includes a Vercel SPA rewrite at `frontend/vercel.json` and a Render service blueprint at `render.yaml`.

### Vercel (frontend)

1. Import the repository and set the project Root Directory to `frontend`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Set `VITE_API_URL` to the Render backend's public origin (for example, `https://<service>.onrender.com`). Do not append `/api/v1`; the client adds that path.

### Render (backend)

1. Create the web service from the repository root and use the committed `render.yaml` blueprint, or configure its commands directly:
   - Build: `pip install -r backend/requirements.txt`
   - Start: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
2. Create a managed PostgreSQL database and set `DATABASE_URL` to its private/internal connection URL.
3. Set `BACKEND_CORS_ORIGINS` to a JSON array containing the exact Vercel origin, such as `["https://<project>.vercel.app"]`.
4. The blueprint generates `SECRET_KEY`. Keep it and `DATABASE_URL` in Render's secret environment settings.
5. Keep `AUTO_SEED=false` in production unless you intentionally want sample restaurant data. Demo accounts are created only when `AUTO_SEED=true` and `DEMO_USER_PASSWORD` is configured; use a unique non-production password.

The backend reads `SECRET_KEY`, `DATABASE_URL`, and `BACKEND_CORS_ORIGINS`. Optional settings include `AUTO_SEED`, `DEMO_USER_PASSWORD`, `AI_PROVIDER`, `OPENAI_API_KEY`, and `ANTHROPIC_API_KEY`. The frontend reads `VITE_API_URL` at build time. Never commit populated `.env` files or service credentials.

## 3. Production Security Checklist

- [x] **Secret Keys**: Never commit production `SECRET_KEY` or database credentials to version control.
- [x] **CORS Origins**: Restrict `BACKEND_CORS_ORIGINS` in `.env` to authorized production domain names (e.g. `https://app.restaurantiq.com`).
- [x] **TLS/HTTPS**: Terminate SSL at load balancer or Nginx reverse proxy using Let's Encrypt certificates.
- [x] **Database Backups**: Schedule automated daily pg_dump backups.
- [x] **Rate Limiting**: Enable upstream rate limiting on `/api/v1/auth/login` to prevent brute force credential stuffing.
- [x] **Audit Trails**: Retain `audit_logs` table records for regulatory compliance and dispute resolution.
