## Install

Start at root directory project (`pnj-fe`):

```shell
# Tạo network dùng chung trước (lần đầu)
docker network create pnj_network

docker compose -f ./docker/docker-compose.local.yml up -d --build
```

Frontend sẽ chạy ở `http://localhost:5002`.

## Rebuild sạch

```shell
docker-compose -f ./docker/docker-compose.local.yml build --no-cache
```

## Exec vào container

```shell
docker exec -it pnj-fe sh
```
