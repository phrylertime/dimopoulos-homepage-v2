#!/usr/bin/env bash
# Double-clickable on macOS — runs deploy.sh in a visible Terminal window.
cd "$(dirname "$0")"
exec bash ./deploy.sh
