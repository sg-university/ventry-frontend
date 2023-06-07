FROM node:latest
ENTRYPOINT [ "/bin/bash", "-c"]

WORKDIR /app
COPY . .

RUN yarn global add serve
RUN yarn install
RUN yarn build
CMD yarn serve