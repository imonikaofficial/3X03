#!/bin/bash

start() {
    # Start the Docker containers in the background
    docker compose -f docker-compose-jenkins.yml build
    docker compose -f docker-compose-jenkins.yml up -d
    docker compose exec -u root jenkins groupadd -g 999 docker
    docker compose exec -u root jenkins gpasswd -a jenkins docker
}

stop() {
    # Stop the Docker containers
    docker compose -f docker-compose-jenkins.yml down
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        start
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
esac
