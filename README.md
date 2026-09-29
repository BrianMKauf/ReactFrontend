# ReactFrontend

React + Vite UI.

Paired API repo: https://github.com/BrianMKauf/SpringBootBackend

## Local

```bash
npm install
npm run dev
```

http://localhost:5173 proxies `/api` to http://localhost:8080

## Render (dev)

Create a **Static Site** from this repo.

Suggested service name: `ReactFrontend-dev-BK`

- Build: `npm install && npm run build`
- Publish: `dist`

Environment (build time):

- `VITE_API_URL` = the SpringBootBackend-dev-BK URL, e.g. `https://springbootbackend-dev-bk.onrender.com`

After you know the frontend URL, set `CORS_ORIGINS` on the API to this frontend URL and redeploy the API.
