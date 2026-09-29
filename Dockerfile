FROM node:20-alpine
ENV WORKDIR=/usr/src/app/
WORKDIR $WORKDIR
COPY package*.json $WORKDIR
RUN npm install --omit=dev --no-cache

FROM node:20-alpine
RUN apk add --no-cache openssl
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
ENV USER=node
ENV WORKDIR=/home/$USER/app
WORKDIR $WORKDIR
COPY --from=0 /usr/src/app/node_modules node_modules
RUN chown $USER:$USER $WORKDIR
COPY --chown=node server.js ./server.js
COPY --chown=node app ./app
COPY --chown=node config ./config
COPY --chown=node docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
USER $USER
EXPOSE 4000