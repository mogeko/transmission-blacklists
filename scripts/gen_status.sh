#! /bin/env bash

TARGET_DIR=${1:-$(pwd)"/public/"}

RAW_FILE_SIZE=$(du -s "${TARGET_DIR}/blocklist.txt" | cut -f1)
GZ_FILE_SIZE=$(du -s "${TARGET_DIR}/blocklist.gz" | cut -f1)
TIMESTAMP_UTC=$(date -u "+%Y-%m-%dT%H:%M:%SZ")

export RAW_FILE_SIZE
export GZ_FILE_SIZE
export TIMESTAMP_UTC

if [ "${GZ_FILE_SIZE}" -lt 1000 ]; then exit 2; fi

envsubst < "${TARGET_DIR}/index.json.template" > "${TARGET_DIR}/index.json"
