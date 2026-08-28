FROM node:22-alpine

WORKDIR /app

# Install pnpm and expo-cli
RUN npm install -g pnpm@9.12.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy all source files (includes pre-built web-dist from repo)
COPY . .

# Render arbeitet vorübergehend als stabiler Web- und API-Proxy zum
# datenbankverbundenen Produktionsserver. Dadurch bleibt die Render-Domain
# auch dann erreichbar, wenn ihre eigene DATABASE_URL veraltet ist.
RUN pnpm exec esbuild server/render-proxy.ts --platform=node --packages=external --bundle --format=esm --outfile=server-dist/index.js

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server-dist/index.js"]
