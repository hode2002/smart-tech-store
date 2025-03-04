# Stage 1: Dependencies
FROM node:21-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && \
    npx prisma generate

# Stage 2: Builder
FROM node:21-alpine AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/node_modules/.prisma ./node_modules/.prisma

COPY . .

RUN npm run build

# Stage 3: Production
FROM node:21-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && \
    npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
