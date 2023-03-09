#!/bin/bash
docker-compose -f docker-compose.ci.yml --profile synpress --profile foundry up --build --exit-code-from synpress
# warning: it's not safe to use ngrok if you have secrets set as environmental variables
# (someone could connect to your CI and steal your vars)
# docker-compose -f docker-compose.ci.yml  --profile synpress --profile foundry --profile ngrok up --build --exit-code-from synpress
