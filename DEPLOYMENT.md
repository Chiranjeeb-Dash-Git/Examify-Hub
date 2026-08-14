Deployment guide

This repository includes Dockerfiles for backend and frontend, and a docker-compose.yml to run both services locally.

Quick steps:

1. Build and run locally with Docker Compose:

   docker-compose up --build

2. Backend: available at http://localhost:5000/api
3. Frontend: available at http://localhost

CI: A GitHub Actions workflow (.github/workflows/ci.yml) builds both projects on push to main and this branch.

Notes:
- Ensure any runtime secrets are provided via environment variables or a secrets manager. Do NOT commit .env files.
- For production, push built Docker images to a registry (GitHub Packages, Docker Hub) and deploy to a container host or orchestrator.
