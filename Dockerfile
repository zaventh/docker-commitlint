# syntax=docker/dockerfile:1.3
FROM node:18-alpine

ENV APPDIR /app
WORKDIR ${APPDIR}

COPY . ${APPDIR}/

RUN \
    --mount=type=cache,target=/var/cache/apk \
    apk update && \
    apk add bash git openssh

RUN \
    --mount=type=cache,target=${APPDIR}/.cache/yarn \
    yarn install --frozen-lockfile --production && \
    rm yarn.lock && \
    git config --global --add safe.directory /app


ENTRYPOINT ["bin/commitlint"]
