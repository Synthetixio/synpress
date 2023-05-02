# syntax=docker/dockerfile:1
FROM --platform=linux/amd64 synthetixio/docker-e2e:18.16-ubuntu as base

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

FROM base as test

RUN pnpm install --frozen-lockfile --prefer-offline

COPY . .
