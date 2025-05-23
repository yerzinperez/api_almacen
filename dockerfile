FROM alpine
COPY . /opt/api_almacen_nodejs
WORKDIR /opt/api_almacen_nodejs
RUN apk update
RUN apk upgrade
RUN apk add nodejs npm python3
RUN npm i
RUN npm run build
EXPOSE 5000

