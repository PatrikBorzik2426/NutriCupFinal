# Use a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

ENV PORT=4000

# Build the application
RUN npm run build

# Expose the application on port 3000
EXPOSE 4000

# Start the application
CMD ["npm", "run", "prod"]
