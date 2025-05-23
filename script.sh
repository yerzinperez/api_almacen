#!/usr/bin/env zsh

echo "Arrancando script..."
docker rm -f $(docker ps -aq)	
docker rmi api_almacen_nodejs
docker system prune -a --volumes
docker compose up --build --force-recreate
echo "¡Hecho!"
