#!/bin/bash
set -ueo pipefail

. /usr/src/upgrade-test-scripts/env_setup.sh
voteLatestProposalAndWait
