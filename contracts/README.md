# Stellar-Forge Contracts

Soroban contract workspace for the Stellar-Forge reusable component
catalog. Each component in the catalog maps to a real, tested Soroban
contract in this workspace.

## Project Structure

```text
.
├── contracts
│   └── token
│       ├── src
│       │   ├── admin.rs          Admin storage helpers
│       │   ├── allowance.rs      Allowance storage helpers
│       │   ├── balance.rs        Balance storage helpers
│       │   ├── contract.rs       Token contract and SEP-41 interface
│       │   ├── lib.rs
│       │   ├── metadata.rs       Name/symbol/decimals helpers
│       │   ├── storage_types.rs  Storage keys and TTL constants
│       │   └── test.rs           Unit tests
│       └── Cargo.toml
├── Cargo.toml
└── README.md
```

## Components

### token

A standard fungible token contract implementing the SEP-41 token
interface (`soroban_sdk::token::TokenInterface`), following the official
[soroban-examples token
pattern](https://github.com/stellar/soroban-examples/tree/main/token).

Exported functions:

- `__constructor(admin, decimal, name, symbol)` — deploys and initializes
  the token (decimals must be ≤ 18)
- `name`, `symbol`, `decimals` — token metadata
- `balance(id)` — balance of any address (0 when unset)
- `transfer(from, to, amount)` — authorized transfer between addresses
- `allowance`, `approve`, `transfer_from` — spender allowances
- `burn`, `burn_from` — balance destruction
- `mint(to, amount)` — admin-only supply creation
- `set_admin(new_admin)` — admin rotation (emits a custom `SetAdmin` event)

Storage follows the official pattern: metadata and admin in instance
storage, balances in persistent storage with TTL bumps, allowances in
temporary storage.

## Commands

Build all contract WASM artifacts:

```bash
stellar contract build
```

Build a single contract:

```bash
stellar contract build --package token
```

Run the unit tests (requires the `wasm32v1-none` target):

```bash
cargo test
```

Format:

```bash
cargo fmt --all
```

The resulting WASM is written to `target/wasm32v1-none/release/`.