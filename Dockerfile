FROM node:22-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.12.0

# Copy package files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy the rest of the app
COPY . .

# Build the server
RUN pnpm build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the server (serves API + static web files)
CMD ["node", "dist/index.js"]
