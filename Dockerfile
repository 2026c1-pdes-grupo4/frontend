FROM node:22-slim AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm config set strict-ssl false && npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm config set strict-ssl false && npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
