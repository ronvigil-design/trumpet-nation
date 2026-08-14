#!/usr/bin/env sh
set -eu
PORT="${1:-4173}"
cd "$(dirname "$0")"
python3 -m http.server "$PORT"
