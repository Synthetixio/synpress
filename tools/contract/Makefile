CHAINID=agoriclocal
USER1ADDR=$(shell agd keys show user1 -a --keyring-backend="test")
ACCT_ADDR=$(USER1ADDR)
BLD=000000ubld

ATOM_DENOM=ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA
ATOM=000000$(ATOM_DENOM)

.PHONY: list
# https://stackoverflow.com/a/73159833/7963
list:
	@make -npq : 2> /dev/null | grep -v PHONY |\
		awk -v RS= -F: '$$1 ~ /^[^#%]+$$/ { print $$1 }'

balance-q:
	agd keys show user1 -a --keyring-backend="test"
	agd query bank balances $(ACCT_ADDR)

GAS_ADJUSTMENT=1.2
SIGN_BROADCAST_OPTS=--keyring-backend=test --chain-id=$(CHAINID) \
		--gas=auto --gas-adjustment=$(GAS_ADJUSTMENT) \
		--yes -b block

mint100:
	make FUNDS=1000$(ATOM) fund-acct
	cd /usr/src/agoric-sdk && \
		yarn --silent agops vaults open --wantMinted 100 --giveCollateral 100 >/tmp/want-ist.json && \
		yarn --silent agops perf satisfaction --executeOffer /tmp/want-ist.json --from user1 --keyring-backend=test

# https://agoric.explorers.guru/proposal/61
lower-bundle-cost: bundles/lower-bundle-cost.json ./scripts/voteLatestProposalAndWait.sh
	agd tx gov submit-proposal param-change bundles/lower-bundle-cost.json \
	$(SIGN_BROADCAST_OPTS) \
	--from user1
	./scripts/voteLatestProposalAndWait.sh
	# agd query swingset params


bundles/swingset-params.json:
	mkdir -p bundles/
	agd query swingset params -o json >$@

.ONESHELL:
bundles/lower-bundle-cost.json: bundles/swingset-params.json
	@read PARAMS < bundles/swingset-params.json; export PARAMS
	node - <<- EOF >$@
		const storageByte = '20000000';
		const paramChange = {
			title: 'Lower Bundle Cost to 0.02 IST/Kb (a la mainnet 61)',
			description: '0.02 IST/Kb',
			deposit: '10000000ubld',
			changes: [{
				subspace: 'swingset',
				key: 'beans_per_unit',
				value: '...',
			}],
		};
		const params = JSON.parse(process.env.PARAMS);
		const ix = params.beans_per_unit.findIndex(({key}) => key === 'storageByte');
		params.beans_per_unit[ix].beans = storageByte;
		paramChange.changes[0].value = params.beans_per_unit;
		console.log(JSON.stringify(paramChange, null, 2));
	EOF

# Keep mint4k around a while for compatibility
mint4k:
	make FUNDS=1000$(ATOM) fund-acct
	cd /usr/src/agoric-sdk && \
		yarn --silent agops vaults open --wantMinted 4000 --giveCollateral 1000 >/tmp/want4k.json && \
		yarn --silent agops perf satisfaction --executeOffer /tmp/want4k.json --from user1 --keyring-backend=test

FUNDS=321$(BLD)
fund-acct:
	agd tx bank send validator $(ACCT_ADDR) $(FUNDS) \
	  $(SIGN_BROADCAST_OPTS) \
	  -o json >,tx.json
	jq '{code: .code, height: .height}' ,tx.json

gov-q:
	agd query gov proposals --output json | \
		jq -c '.proposals[] | [.proposal_id,.voting_end_time,.status]'

gov-voting-q:
	agd query gov proposals --status=voting_period --output json | \
		jq -c '.proposals[].proposal_id'

PROPOSAL=1
VOTE_OPTION=yes
vote:
	agd tx gov vote $(PROPOSAL) $(VOTE_OPTION) --from=validator \
	  $(SIGN_BROADCAST_OPTS) \
	  -o json >,tx.json
	jq '{code: .code, height: .height}' ,tx.json

instance-q:
	agd query vstorage data published.agoricNames.instance -o json

print-key: /root/.agoric/user1.key
	@echo Import the following mnemonic into Keplr:
	@cat $<
	@echo
	@echo -n 'The resulting address should be: '
	@agd keys show user1 -a --keyring-backend="test"
	@echo

SCRIPT=start-offer-up.js
PERMIT=start-offer-up-permit.json
start-contract: $(SCRIPT) $(PERMIT) install-bundles
	scripts/propose-start-contract.sh

install-bundles: bundles/bundle-list
	./scripts/install-bundles.sh

build-proposal: bundles/bundle-list

bundles/bundle-list $(SCRIPT) $(PERMIT):
	./scripts/build-proposal.sh


clean:
	@rm -rf $(SCRIPT) $(PERMIT) bundles/
