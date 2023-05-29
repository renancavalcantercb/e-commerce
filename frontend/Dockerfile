# Etapa de compilação do frontend
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

# Etapa de criação do contêiner final
FROM nginx:latest
COPY --from=build-stage /app/build/ /usr/share/nginx/html
