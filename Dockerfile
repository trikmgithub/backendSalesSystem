# Base image - using Node 16
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 8000

# Start the server
CMD [ "node", "dist/main.js" ]