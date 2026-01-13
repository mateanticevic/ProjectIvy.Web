# stage1 as builder
FROM node:20 AS builder

WORKDIR /build

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the project with increased memory
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

FROM nginx:1.25.3

#!/bin/sh

COPY ./nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]