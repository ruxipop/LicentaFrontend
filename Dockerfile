FROM node:18.12-alpine as builder
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm install --force
COPY . /app
COPY ./ /app/
RUN npm run build


FROM nginx:1.21.0-alpine as production
COPY --from=builder /app/dist/LicentaFrontend /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 82
CMD ["nginx", "-g", "daemon off;"]


