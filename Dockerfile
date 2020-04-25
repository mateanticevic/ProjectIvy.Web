# stage1 as builder
FROM node:10.15.3 as builder

COPY . .

# Install the dependencies and make the folder
RUN npm install

RUN ls

# Build the project and copy the files
RUN npm run build

FROM nginx

#!/bin/sh

COPY ./nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]