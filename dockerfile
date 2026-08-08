# Base image: official Python 3.12, "slim" variant — small, but still a
# standard Debian environment (compatible with psycopg2-binary's expectations,
# unlike the even-smaller musl-based "alpine" variant).
FROM python:3.12-slim

# All subsequent instructions operate relative to /app inside the container's
# own filesystem — unrelated to any folder structure on the host machine.
WORKDIR /app

# Copy ONLY the dependency list first. This is deliberate layer ordering:
# requirements.txt changes rarely, application code changes constantly.
# As long as requirements.txt is unchanged, Docker reuses the cached result
# of the pip install below, even when app/ code changes on every rebuild.
COPY requirements.txt .

# --no-cache-dir: pip's local package cache has no future use inside a
# one-shot image build, so skipping it keeps the resulting layer smaller.
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the actual application code and frontend files — this layer
# will be rebuilt on nearly every change, which is expected and fine,
# since the expensive dependency-install layer above is already cached.
COPY app/ ./app/
COPY frontend/ ./frontend/

# Documents that this container expects to listen on port 8000.
# Does NOT by itself make the port reachable — that's decided separately
# at "docker run" time via -p.
EXPOSE 8000

# Production-appropriate startup: no --reload (that's a development-only
# convenience flag), and explicit --host 0.0.0.0 so the server accepts
# connections from outside the container, not just from within it.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]