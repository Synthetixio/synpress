#!/bin/bash
docker-compose -f docker-compose.ci.yml --profile ngrok up --build --exit-code-from synpress
