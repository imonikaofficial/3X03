# ICT3x03 Yorm Car Rental App

## Setup

To build the web application
```
sudo docker compose build
```

To run the web application

```
sudo docker compose up -d
```

To bring stop the web application
```
sudo docker compose down
```

To backup database
```
mongodump --uri="mongodb://172.16.100.27:27017"
```

To restore database 
```
mongorestore dump/ --uri="mongodb://172.16.100.27:27017"
```

To ensure logs can be piped to syslog properly
```
 sudo iptables -I DOCKER-USER -i br_yorm -o br_syslog -j ACCEPT
 sudo iptables -I DOCKER-USER -i br_syslog -o br_yorm -j ACCEPT

```
## Setup and install Nginx

```
sudo apt update
sudo apt install nginx-extras
```

Setting up firewall
```
sudo ufw allow 'Nginx Full'
sudo ufw status
```

Configuring nginx
```
ICT3x03/nginx/ict3x03yorm.pro
ICT3x03/nginx/jenkins.ict3x03yorm.pro
```

The changes made to the file is
```
server_name ict3x03yorm.pro;
server_name jenkins.ict3x03yorm.pro;
```

Creating a symbolic link
```
sudo ln -s /etc/nginx/sites-available/ict3x03yorm.pro /etc/nginx/sites-enabled
sudo ln -s /etc/nginx/sites-available/jenkins.ict3x03yorm.pro /etc/nginx/sites-enabled
```

Securing nginx SSL
```
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo certbot --nginx -d ict3x03yorm.pro jenkins.ict3x03yorm.pro
```

Enabling HSTS
The config file can be found at ICT3x03/nginx
```
ICT3x03/nginx/nginx.conf
```
The changes made to the file is
```
add_header Strict - Transport - Security " max - age =15768000; includeSubDomains " always ;
```




## Accessing the Web Application

The frontend of the application can be visited at `http://172.16.100.30:3000`

Frontend: `172.16.100.30`

Backend: `172.16.100.50`

Database: `172.16.100.27`

## Generate TLS cert for database

```
cd database
openssl req -newkey rsa:2048 -nodes -keyout mongodbkey.key -x509 -days 365 -out mongodbkey.crt
cat mongodbkey.key mongodbkey.crt > mongodb.pem
```
To connect to the database with ssl
```
mongosh --host 172.16.100.27 -u <> -p <password> --ssl --tlsAllowInvalidCertificates
```

## Jenkins Docker Usage

```
sudo ./docker_jenkins.sh
Usage: ./docker_jenkins.sh {start|stop|restart}
```
