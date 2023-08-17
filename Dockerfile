# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 synthetixio/docker-e2e:18.16-ubuntu as base

RUN mkdir /app
WORKDIR /app

RUN apt update && apt install -y nginx

COPY nginx.conf /etc/nginx/sites-available/default

COPY package.json ./
COPY pnpm-lock.yaml ./

FROM base as test

RUN pnpm install --frozen-lockfile --prefer-offline

COPY . .
