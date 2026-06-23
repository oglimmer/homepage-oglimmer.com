# Build stage
FROM node:24.17.0-alpine@sha256:156b55f92e98ccd5ef49578a8cea0df4679826564bad1c9d4ef04462b9f0ded6 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Generate static site
RUN npm run generate

# Production stage
FROM nginx:alpine@sha256:1a8724a52d432501548a8d8681bb1554c2d09778f8b9ed0882fc3442549980b7

# Copy custom nginx configuration for non-root user
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files from build stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Create directories and set permissions for nginx to run as non-root user
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R 1001:1001 /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R 1001:1001 /var/log/nginx && \
    chown -R 1001:1001 /usr/share/nginx/html && \
    touch /tmp/nginx.pid && \
    chown 1001:1001 /tmp/nginx.pid && \
    chmod 644 /etc/nginx/nginx.conf && \
    chown 1001:1001 /etc/nginx/nginx.conf

# Switch to non-root user
USER 1001

# Expose port 8080 (non-root users can't bind to ports < 1024)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
