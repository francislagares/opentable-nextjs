FROM node:21-alpine AS deps

RUN apk update && apk add --no-cache libc6-compat nodejs-current && corepack enable

WORKDIR /app

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 3000

CMD [ "pnpm", "dev" ]

# Stage 2: Build the app
FROM node:21-alpine AS builder

RUN apk update && apk add --no-cache libc6-compat nodejs-current && corepack enable

WORKDIR /app


ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Stage 3: Run the production
FROM node:21-alpine AS runner

RUN apk update && apk add --no-cache libc6-compat nodejs-current && corepack enable

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy assets and the generated standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Serve the app
CMD ["pnpm", "start"]