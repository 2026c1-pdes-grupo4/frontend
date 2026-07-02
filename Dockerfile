FROM node:22-slim AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm config set strict-ssl false && npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM nginx:1.27-alpine AS production
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
