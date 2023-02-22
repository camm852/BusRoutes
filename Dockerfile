FROM node:16.17.1-alpine3.16 as build

WORKDIR /usr/app

COPY package*.json ./  


RUN npm ci

COPY . .

RUN npm run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest

# Install gettext package for envsubst command
RUN apt-get update && apt-get install -y gettext

# Copy the nginx.conf.template and create the actual nginx.conf file
COPY /.nginx/nginx.conf.template /etc/nginx/conf.d/default.template
CMD /bin/bash -c "envsubst '\$VITE_API_URL' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
EXPOSE 80

# Copy the compiled app
COPY --from=build /usr/app/dist /usr/share/nginx/html