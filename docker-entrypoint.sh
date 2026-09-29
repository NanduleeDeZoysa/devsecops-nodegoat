#!/bin/sh
set -e

CERT_DIR=/home/node/app/artifacts/cert
mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/server.key" ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
    -subj "/CN=localhost" \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt"
fi

exec "$@"