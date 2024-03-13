#!/bin/bash

wait_for_bootstrap() {
  endpoint="localhost"
  while true; do
    if json=$(curl -s --fail -m 15 "$endpoint:26657/status"); then
      if [[ "$(echo "$json" | jq -r .jsonrpc)" == "2.0" ]]; then
        if last_height=$(echo "$json" | jq -r .result.sync_info.latest_block_height); then
          if [[ "$last_height" != "1" ]]; then
            echo "$last_height"
            return
          else
            echo "$last_height"
          fi
        fi
      fi
    fi
    echo "waiting for next block..."
    sleep 5
  done
  echo "done"
}

waitForBlock() (
  echo "waiting for block..."
  times=${1:-1}
  echo "$times"
  for ((i = 1; i <= times; i++)); do
    b1=$(wait_for_bootstrap)
    while true; do
      b2=$(wait_for_bootstrap)
      if [[ "$b1" != "$b2" ]]; then
        echo "block produced"
        break
      fi
      sleep 5
    done
  done
  echo "done"
)

approveProposals() {
    while true; do
        proposals=$(make -s -C /workspace/contract gov-voting-q 2>/dev/null)
        exit_status=$?
        if [ $exit_status -eq 0 ]; then
            echo "Approving proposals: $proposals"
            printf $proposals | xargs -I {} make -s -C /workspace/contract vote PROPOSAL={}
        else
            echo "No proposals to approve, continuing..."
        fi

        sleep 10
    done
}

# Start the chain in the background
/usr/src/upgrade-test-scripts/start_agd.sh &

# wait for blocks to start being produced
waitForBlock 2

# Approve any proposals forever in the background.
approveProposals &

make -C /workspace/contract mint100
make -C /workspace/contract lower-bundle-cost
make -C /workspace/contract clean start-contract print-key     

# bring back chain process to foreground
wait
