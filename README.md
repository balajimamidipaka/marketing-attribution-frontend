# Marketing Attribution Frontend

React + Vite frontend for the Marketing Attribution and Budget Pacing backend.

## Requirements
- Node.js 20.19+ or 22.12+
- Spring Boot backend running on `http://localhost:8080`

## Run
```bash
npm install
copy .env.example .env
npm run dev
```
Open http://localhost:5173

For PowerShell, `copy .env.example .env` works. You can also create `.env` manually:
`VITE_API_BASE_URL=http://localhost:8080`

## Build
```bash
npm run build
npm run preview
```

## API configuration
The API base URL is in `.env`. Endpoint paths are centralized in `src/api/endpoints.js`.
The frontend expects the backend endpoints:
- `GET /api/uploads`
- `POST /api/uploads` (multipart fields: `file`, `datasetType`)
- `GET /api/analytics/channel-performance`
- `GET /api/analytics/budget-pacing`
- `GET /api/analytics/attribution-results`
- `GET /api/analytics/customer-journey`
- `GET /api/analytics/campaign-alerts`

If an analytics endpoint in your backend uses a different path, edit `src/api/endpoints.js`.

## CORS
If the browser reports a CORS error, allow `http://localhost:5173` in Spring Boot.
A simple development-only option is `@CrossOrigin(origins = "http://localhost:5173")` on the relevant controllers, or a global Web MVC CORS configuration. Do not use wildcard origins with credentials in production.

## Notes
- The app displays API errors instead of silently substituting fake analytics data.
- The dashboard overview combines responses from the existing analytics endpoints.
- Upload processing is automatic through the backend scheduler; after uploading, refresh the upload list or wait for its scheduled processing cycle.
