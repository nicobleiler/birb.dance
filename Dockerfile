#######################################
# Build stage
#######################################
FROM node:21-alpine as builder

WORKDIR /app

# install npm dependencies (cache first)
COPY package*.json ./

# copy remaining files
COPY . .

# build app
RUN npm run build

#######################################
# Serve stage
#######################################
FROM node:21-alpine

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/scripts/server.js ./scripts/

EXPOSE 80

ENV TERM="xterm-256color"

ARG DEFAULT_BIRB
ENV DEFAULT_BIRB=$DEFAULT_BIRB

CMD ["node", "scripts/server.js"]