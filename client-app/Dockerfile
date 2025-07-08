FROM node:18-alpine AS builder

WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

RUN npm install --production
COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

CMD ["npm", "start"]
EXPOSE 3000