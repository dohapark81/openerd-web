FROM node:18

WORKDIR /workspace

RUN apt-get update && apt-get install -y git

USER node