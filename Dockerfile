FROM node:18
ENTRYPOINT [ "/bin/sh", "-c"]
WORKDIR /app
COPY . .
RUN yarn install