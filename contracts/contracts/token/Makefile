default: build

all: test

test: build
	cargo test

build:
	stellar contract build
	@ls -l target/wasm32v1-none/release/*.wasm

# Deploy the token contract to Stellar Testnet.
#
# Requires the Stellar CLI. The deployer identity (a testnet-only keypair kept
# in the CLI config directory, never in this repo) is created and funded via
# friendbot when it does not exist yet.
#
# Prints the new contract id (C...) to stdout. Register it manually in
# src/lib/transactions/deployments.ts keyed by network "testnet" and component
# slug "token".
deploy-testnet:
	stellar keys ls | grep -q deployer || stellar keys generate deployer --fund --network testnet
	stellar contract deploy \
		--wasm target/wasm32v1-none/release/token.wasm \
		--source deployer \
		--network testnet \
		-- \
		--admin $$(stellar keys address deployer) \
		--decimal 7 \
		--name "Forge Token" \
		--symbol FORGE

fmt:
	cargo fmt --all

clean:
	cargo clean
