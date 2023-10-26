FROM nginx:alpine
COPY . /usr/share/nginx/html
FROM php:8.0-apache
