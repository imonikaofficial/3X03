#  Dockerfile for Node Express Backend api
FROM node:21-alpine3.17

RUN apk add rsyslog openrc
# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .

# Create log files
RUN mkdir -p /var/log
RUN touch /var/log/access.log
RUN mkdir logs
RUN touch logs/requests.log

RUN mv rsyslog.conf /etc/rsyslog.conf

CMD rsyslogd -n & npm start
