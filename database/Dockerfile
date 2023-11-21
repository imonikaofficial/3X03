# Base image
FROM mongo:latest

RUN useradd -u 1000 -m mongo

# Copy custom MongoDB Config file into container
COPY ./mongod.conf /etc/mongod.conf

# Copy initialization scripts into container
COPY ./dump /dump
# COPY ./startup/mongorestore.sh /docker-entrypoint-initdb.d/01_mongorestore.sh
COPY ./startup/CreateDBUsers.js /docker-entrypoint-initdb.d/02_CreateDBUsers.js
COPY ./mongodb.pem /etc/ssl/mongodb.pem
RUN ln -s /dev/stdout /var/log/mongodb/mongod.log

# Expose default MongoDB port
EXPOSE 27017

RUN mkdir -p /data/db && chown -R mongo:mongo /data/db
RUN mkdir -p /var/log/mongodb && chown -R mongo:mongo /var/log/mongodb

USER mongo


# Startup commands
CMD ["--config",  "/etc/mongod.conf"]