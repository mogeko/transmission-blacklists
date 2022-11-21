#! /bin/env bash

INPUT_FILE=${1:-$(pwd)"/temp/blocklist_deduplicated"}
OUTPUT_DIR=${2:-$(pwd)"/public/"}

mkdir -p "${OUTPUT_DIR}"

mv "${INPUT_FILE}" "${OUTPUT_DIR}/blocklist"

gzip -c "${OUTPUT_DIR}/blocklist" > "${OUTPUT_DIR}/blocklist.gz"
