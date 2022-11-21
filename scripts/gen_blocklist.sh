#! /bin/env bash

USER_AGENT="Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0"
IBLOCKLIST="https://www.iblocklist.com/lists.php"
CODEBUCKET="https://mirror.codebucket.de/transmission/blocklist.txt"
WAEL_LIST="https://github.com/waelisa/Best-blocklist/raw/main/wael.list.txt"
OUT_DIR=${1:-$(pwd)"/temp/"}

mkdir -p "${OUT_DIR}"

curl -A "${USER_AGENT}" -s ${IBLOCKLIST} \
    | sed -n "s/.*value='\(http:.*\)'.*/\1/p" \
    | sed "s/\&amp;/\&/g" \
    | sed "s/http/\"http/g" \
    | sed "s/gz/gz\"/g" \
    | xargs curl -s -L \
    | gunzip \
    | grep -Ev '^#' \
    | sed "/^$/d" > "${OUT_DIR}/blocklist"

curl -A "${USER_AGENT}" -s ${CODEBUCKET} >> "${OUT_DIR}/blocklist"

curl -A "${USER_AGENT}" -s ${WAEL_LIST} >> "${OUT_DIR}/blocklist"

sort --unique "${OUT_DIR}/blocklist" > "${OUT_DIR}/blocklist_deduplicated"
