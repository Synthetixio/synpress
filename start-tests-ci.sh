#!/bin/bash
docker-compose -f docker-compose.ci.yml --build --exit-code-from synpress
# todo: is it safe?
# docker-compose -f docker-compose.ci.yml --profile ngrok up --build --exit-code-from synpress
