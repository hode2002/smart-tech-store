# Stage 1: Dependencies
FROM node:21-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:21-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Stage 3: Production
FROM node:21-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --legacy-peer-deps

COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]
