FROM node:20-alpine AS builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./
COPY . .

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["npm", "start"]