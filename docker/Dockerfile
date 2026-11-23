# syntax=docker/dockerfile:1

FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

# Cache yarn downloads across rebuilds → sau lần đầu, cài lại chỉ vài giây.
# Bỏ --frozen-lockfile: package.json có thể cập nhật mà chưa chạy yarn trên host;
# container tự regenerate lock trong layer, không ghi ngược ra host.
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --network-timeout 600000

EXPOSE 5002

CMD ["yarn", "dev"]
