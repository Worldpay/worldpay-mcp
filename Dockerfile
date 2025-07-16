# Use official Node.js LTS image as build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# --- Production image ---
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built code and necessary assets from build stage
COPY --from=build /app/dist .

# Expose the port the server runs on
EXPOSE 3001

# Set environment variables (override in docker run or compose as needed)
# ENV WORLDPAY_USERNAME=your_username
# ENV WORLDPAY_PASSWORD=your_password

# Start the MCP server from compiled code
CMD ["node", "server-http.js"]
