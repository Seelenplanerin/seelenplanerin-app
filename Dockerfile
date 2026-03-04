FROM node:22-alpine

WORKDIR /app

# Install pnpm and expo-cli
RUN npm install -g pnpm@9.12.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the server bundle into dist/ (separate from web-dist/)
# web-dist/ contains the pre-built Expo web export and is committed to the repo
RUN pnpm exec esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/index.js"]
