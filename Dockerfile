# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# Dependencies — cached until the lockfile changes.
#
# Debian rather than Alpine: on musl there is no native binary for Tailwind's
# oxide or for lightningcss, so npm falls back to the wasm32 build, whose
# @emnapi dependencies resolve differently on each platform and break `npm ci`
# against a lockfile generated anywhere else.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm install`, not `npm ci`. Tailwind's oxide and lightningcss ship per
# platform as optional dependencies, and npm cannot write one lockfile whose
# `npm ci` is satisfiable on both macOS and Linux — whichever platform
# generated it, the other is missing binaries. `npm install` honours the
# locked versions and resolves the platform binaries it actually needs.
RUN npm install --no-audit --no-fund

# ─────────────────────────────────────────────────────────────────────────────
# Build
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The API address is read at run time, not baked in: nothing NEXT_PUBLIC_ is
# needed, so the build takes no arguments and the same image can be promoted
# between environments. A placeholder satisfies the startup check during the
# build itself.
ENV API_URL=http://build-time-placeholder.invalid/api

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Runtime — the standalone server only, no build tooling, non-root.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

RUN groupadd -g 10001 aviro && useradd -u 10001 -g aviro -m -s /usr/sbin/nologin aviro

COPY --from=builder /app/public ./public
# The standalone output carries its own minimal node_modules and server.js.
COPY --from=builder --chown=aviro:aviro /app/.next/standalone ./
COPY --from=builder --chown=aviro:aviro /app/.next/static ./.next/static

USER aviro

# Documentation only: server.js binds whatever PORT says, which is how Railway
# assigns one.
EXPOSE 3000

CMD ["node", "server.js"]
