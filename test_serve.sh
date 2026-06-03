#!/bin/bash
lsof -ti :8000 | xargs kill -9 2>/dev/null
python3 -m http.server 8000 &
sleep 0.5
open http://localhost:8000
trap "kill %1" EXIT
wait
