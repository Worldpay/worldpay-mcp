FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Remove source code, tests, and dev dependencies
RUN rm -rf src/ tests/ tsconfig.json jest.config.ts && \
    npm prune --production

EXPOSE 3001

# Set environment variables (override in docker run or compose as needed)
# ENV WORLDPAY_USERNAME=
# ENV WORLDPAY_PASSWORD=
# ENV WORLDPAY_URL=https://try.access.worldpay.com

CMD ["node", "dist/server-stdio.js"]
