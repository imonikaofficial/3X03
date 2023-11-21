# Dockerfile for frontend

# Stage 1: Build react client
FROM node:21-alpine3.17

# Working directory be app
WORKDIR /usr/app

# copy local files to app folder
COPY . .
RUN adduser -D frontend

# Install dependencies
RUN npm install

RUN chown -R frontend:frontend /usr/app

USER frontend

CMD npm start
