# Stage 1: Install dependencies
FROM node:alpine AS deps

WORKDIR /app

# Install only dependencies first for better caching
COPY package.json package-lock.json* ./

RUN npm install;

# Stage 2: Copy files and run app
FROM node:alpine

WORKDIR /app

ENV PORT=3000

# Copy only the necessary files from the previous stage
COPY --from=deps /app /app

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]