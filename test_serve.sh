#!/bin/bash
python3 -m http.server 8000 &
sleep 0.5
open http://localhost:8000
wait
