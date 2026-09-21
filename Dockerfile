# --- Base image ---
FROM node:18-alpine AS base
WORKDIR /app

# --- Install dependencies ---
FROM base AS deps
COPY package.json ./
RUN yarn install

# --- Build the app ---
FROM deps AS builder
COPY . .
RUN yarn build

# --- Production runtime ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app
COPY --from=builder /app ./

EXPOSE 3000

CMD ["yarn", "start"]
