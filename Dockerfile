# syntax=docker/dockerfile:1.3
FROM node:24-alpine

ENV APPDIR /app
WORKDIR ${APPDIR}

COPY . ${APPDIR}/

RUN \
    --mount=type=cache,target=/var/cache/apk \
    apk update && \
    apk add bash git openssh

RUN \
    --mount=type=cache,target=/root/.npm \
    NODE_ENV=production npm ci --omit=dev && \
    git config --global --add safe.directory /app


ENTRYPOINT ["bin/commitlint"]
