# UniManage Backend

This module contains the Spring Boot API for the UniManage platform.

## Requirements

- Java 21+
- Maven 3.9+
- PostgreSQL 17
- Node.js 20+ for the frontend

## Local database setup

1. Copy the project root `.env.example` to `.env`.
2. Update the PostgreSQL credentials and the JWT secret.
3. Start PostgreSQL locally:

```bash
docker compose up -d postgres
```

4. Start the backend with the default profile:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
./mvnw.cmd spring-boot:run
```

## Environment variables

The application reads the following configuration values:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `APP_JWT_SECRET`
- `APP_JWT_ISSUER`
- `APP_JWT_TTL`
- `APP_CORS_ORIGIN`
- `APP_BOOTSTRAP_ADMIN_EMAIL`
- `APP_BOOTSTRAP_ADMIN_PASSWORD`
- `APP_BOOTSTRAP_ADMIN_NAME`

## Swagger UI

The OpenAPI documentation is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Seed/development account

A bootstrap admin is created automatically when both `APP_BOOTSTRAP_ADMIN_EMAIL` and `APP_BOOTSTRAP_ADMIN_PASSWORD` are configured. Treat this account as a development-only account.

## Frontend

From the `frontend/` directory, run:

```bash
npm install
npm run dev
```

The frontend is configured for the development origin in `APP_CORS_ORIGIN`.
