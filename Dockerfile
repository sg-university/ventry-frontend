FROM node:18-alpine
ENTRYPOINT [ "/bin/sh", "-c"]

WORKDIR /app
COPY . .

RUN yarn install