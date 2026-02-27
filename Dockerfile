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

# Build the web app first (Expo export)
RUN npx expo export --platform web --output-dir dist || echo "Expo export skipped"

# Build the server (esbuild)
RUN pnpm build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/index.js"]
