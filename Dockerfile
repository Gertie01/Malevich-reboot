# ---------- Base Node image ----------
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ---------- Install JS dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install

# ---------- Build Next.js ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Python API ----------
FROM python:3.11-slim AS api
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api ./api

# ---------- Final runtime image ----------
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Python API
COPY --from=api /app/api ./api

# Create Next.js user
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs
USER nextjs

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
