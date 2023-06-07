FROM node:latest
ENTRYPOINT [ "/bin/bash", "-c"]

WORKDIR /app
COPY . .

RUN yarn install