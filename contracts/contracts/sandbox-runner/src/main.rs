use std::collections::HashMap;
use std::io::Read;
use std::panic::{catch_unwind, AssertUnwindSafe};

use serde_json::{json, Value};
use soroban_sdk::{
    testutils::{MockAuth, MockAuthInvoke},
    xdr::{ScError, ScVal},
    Address, Bytes, Env, IntoVal, MuxedAddress, String as SdkString, Symbol, TryFromVal, Val,
    Vec as SdkVec,
};

/// Default location of the built token contract wasm, relative to the
/// repository root. Overridable via the `wasmPath` request field.
const DEFAULT_WASM_PATH: &str = "contracts/target/wasm32v1-none/release/token.wasm";

/// Salt used to derive the deployed contract's address.
const DEPLOY_SALT: [u8; 32] = [0u8; 32];

/// Deterministic throwaway identities. Fixed strkeys so every execution is
/// reproducible; the request may override or add identities.
const DEFAULT_IDENTITIES: &[(&str, &str)] = &[
    ("admin", "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"),
    ("user1", "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFCT4"),
    ("user2", "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHK3M"),
    ("deployer", "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAITA4"),
];

/// The token interface is fixed and known: arguments are positional and typed
/// per function, matching the interface declared in `src/data/components.ts`.
enum ArgSpec {
    Address,
    Muxed,
    I128,
    U32,
}

fn arg_specs(fn_name: &str) -> Option<&'static [ArgSpec]> {
    Some(match fn_name {
        "name" | "symbol" | "decimals" => &[],
        "balance" => &[ArgSpec::Address],
        "allowance" => &[ArgSpec::Address, ArgSpec::Address],
        "transfer" => &[ArgSpec::Address, ArgSpec::Muxed, ArgSpec::I128],
        "approve" => &[
            ArgSpec::Address,
            ArgSpec::Address,
            ArgSpec::I128,
            ArgSpec::U32,
        ],
        "transfer_from" => &[
            ArgSpec::Address,
            ArgSpec::Address,
            ArgSpec::Address,
            ArgSpec::I128,
        ],
        "burn" => &[ArgSpec::Address, ArgSpec::I128],
        "burn_from" => &[ArgSpec::Address, ArgSpec::Address, ArgSpec::I128],
        "mint" => &[ArgSpec::Address, ArgSpec::I128],
        "set_admin" => &[ArgSpec::Address],
        _ => return None,
    })
}

fn main() {
    let mut input = String::new();
    let response = match std::io::stdin().read_to_string(&mut input) {
        Err(e) => runner_error(format!("failed to read request from stdin: {e}")),
        Ok(_) => match serde_json::from_str::<Value>(&input) {
            Err(e) => runner_error(format!("request is not valid JSON: {e}")),
            Ok(request) => catch_unwind(AssertUnwindSafe(|| execute(request))).unwrap_or_else(
                |panic| match panic.downcast_ref::<&str>() {
                    Some(msg) => runner_error(format!("internal error: {msg}")),
                    None => match panic.downcast_ref::<String>() {
                        Some(msg) => runner_error(format!("internal error: {msg}")),
                        None => runner_error("internal error".to_string()),
                    },
                },
            ),
        },
    };
    println!("{}", serde_json::to_string(&response).expect("response serializes"));
    if response.get("ok").and_then(Value::as_bool) != Some(true) {
        std::process::exit(1);
    }
}

fn execute(request: Value) -> Value {
    let mut identities: HashMap<String, String> = DEFAULT_IDENTITIES
        .iter()
        .map(|(name, key)| (name.to_string(), key.to_string()))
        .collect();
    if let Some(extra) = request.get("identities").and_then(Value::as_object) {
        for (name, key) in extra {
            let Some(key) = key.as_str() else {
                return runner_error(format!("identity {name:?} must be a strkey string"));
            };
            identities.insert(name.clone(), key.to_string());
        }
    }

    let wasm_path = request
        .get("wasmPath")
        .and_then(Value::as_str)
        .unwrap_or(DEFAULT_WASM_PATH);
    let wasm = match std::fs::read(wasm_path) {
        Ok(bytes) => bytes,
        Err(e) => return runner_error(format!("failed to read wasm at {wasm_path:?}: {e}")),
    };

    let constructor = match request.get("constructor") {
        Some(c) => c,
        None => return runner_error("request is missing the 'constructor' object".to_string()),
    };
    let admin_name = match constructor.get("admin").and_then(Value::as_str) {
        Some(admin) => admin,
        None => return runner_error("constructor.admin is required".to_string()),
    };
    let admin_key = identities.get(admin_name).map(String::as_str).unwrap_or(admin_name);
    let decimal = match parse_u32(&constructor.get("decimal").cloned().unwrap_or(Value::Null)) {
        Ok(d) => d,
        Err(e) => return runner_error(format!("constructor.decimal: {e}")),
    };
    let name = match constructor.get("name").and_then(Value::as_str) {
        Some(name) => name.to_string(),
        None => return runner_error("constructor.name is required".to_string()),
    };
    let symbol = match constructor.get("symbol").and_then(Value::as_str) {
        Some(symbol) => symbol.to_string(),
        None => return runner_error("constructor.symbol is required".to_string()),
    };
    let calls = match request.get("calls").and_then(Value::as_array) {
        Some(calls) => calls,
        None => return runner_error("request is missing the 'calls' array".to_string()),
    };

    let env = Env::default();
    if !(admin_key.starts_with('G') || admin_key.starts_with('C')) {
        return runner_error(format!("constructor.admin is not a known identity or strkey: {admin_name}"));
    }
    let admin = Address::from_str(&env, admin_key);
    let deployer = Address::from_str(&env, &identities["deployer"]);

    // Deployment runs the constructor; constructor auth is mocked exactly like
    // the SDK's own `register` testutils (authorization is recorded, not
    // enforced). Enforcing auth is re-enabled right after, so every subsequent
    // authorized call must provide its own authorization.
    env.mock_all_auths();
    let wasm_bytes: Bytes = Bytes::from_slice(&env, &wasm);
    let wasm_hash = env.deployer().upload_contract_wasm(wasm_bytes);
    let token = env
        .deployer()
        .with_address(deployer, DEPLOY_SALT)
        .deploy_v2(
            wasm_hash,
            (
                admin,
                decimal,
                SdkString::from_str(&env, &name),
                SdkString::from_str(&env, &symbol),
            ),
        );
    env.set_auths(&[]);

    let mut results = Vec::with_capacity(calls.len());
    for call in calls {
        results.push(execute_call(&env, &token, &identities, call));
    }

    let deployed_strkey =
        std::string::String::from_utf8(token.to_string().to_bytes().to_alloc_vec())
            .unwrap_or_else(|_| "INVALID_STRKEY".to_string());

    json!({
        "ok": true,
        "deployedContract": deployed_strkey,
        "calls": results,
    })
}

fn execute_call(
    env: &Env,
    token: &Address,
    identities: &HashMap<String, String>,
    call: &Value,
) -> Value {
    let Some(fn_name) = call.get("fn").and_then(Value::as_str) else {
        return call_error(None, "call is missing the 'fn' field".to_string());
    };
    if fn_name == "__constructor" {
        return call_error(
            Some(fn_name),
            "__constructor runs at deployment time via the request 'constructor' field".to_string(),
        );
    }
    let args = call.get("args").cloned().unwrap_or(Value::Null);
    let arg_vals = match build_args(env, fn_name, &args, identities) {
        Ok(vals) => vals,
        Err(e) => return call_error(Some(fn_name), e),
    };

    if let Some(signer) = call.get("signer").and_then(Value::as_str) {
        let address = match resolve_address(env, identities, signer) {
            Ok(address) => address,
            Err(e) => return call_error(Some(fn_name), e),
        };
        env.mock_auths(&[MockAuth {
            address: &address,
            invoke: &MockAuthInvoke {
                contract: token,
                fn_name,
                args: arg_vals.clone(),
                sub_invokes: &[],
            },
        }]);
    }

    let result: Result<Result<Val, _>, _> =
        env.try_invoke_contract(&token, &Symbol::new(env, fn_name), arg_vals);
    match result {
        Ok(Ok(val)) => json!({
            "fn": fn_name,
            "ok": true,
            "result": val_to_json(env, &val),
        }),
        Ok(Err(_)) => unreachable!("Val conversion cannot fail"),
        Err(Ok(error)) => json!({
            "fn": fn_name,
            "ok": false,
            "error": error_to_json(error),
        }),
        Err(Err(invoke_error)) => json!({
            "fn": fn_name,
            "ok": false,
            "error": {
                "kind": "invoke",
                "message": format!("{invoke_error:?}"),
            },
        }),
    }
}

fn build_args(
    env: &Env,
    fn_name: &str,
    args: &Value,
    identities: &HashMap<String, String>,
) -> Result<SdkVec<Val>, String> {
    let specs = arg_specs(fn_name).ok_or_else(|| format!("unsupported function: {fn_name}"))?;
    let arr = args
        .as_array()
        .ok_or_else(|| format!("args for {fn_name} must be a JSON array"))?;
    if arr.len() != specs.len() {
        return Err(format!(
            "{fn_name} expects {} argument(s), got {}",
            specs.len(),
            arr.len()
        ));
    }
    let mut vals = Vec::with_capacity(specs.len());
    for (spec, arg) in specs.iter().zip(arr) {
        vals.push(build_arg(env, spec, arg, identities)?);
    }
    Ok(SdkVec::from_iter(env, vals))
}

fn build_arg(
    env: &Env,
    spec: &ArgSpec,
    arg: &Value,
    identities: &HashMap<String, String>,
) -> Result<Val, String> {
    match spec {
        ArgSpec::Address => {
            let s = arg
                .as_str()
                .ok_or_else(|| format!("address argument must be a string, got {arg}"))?;
            Ok(resolve_address(env, identities, s)?.to_val())
        }
        ArgSpec::Muxed => {
            let s = arg
                .as_str()
                .ok_or_else(|| format!("muxed address argument must be a string, got {arg}"))?;
            let strkey = identities.get(s).map(String::as_str).unwrap_or(s);
            Ok(MuxedAddress::from_str(env, strkey).to_val())
        }
        ArgSpec::I128 => Ok(parse_i128(arg)?.into_val(env)),
        ArgSpec::U32 => Ok(parse_u32(arg)?.into_val(env)),
    }
}

fn resolve_address(
    _env: &Env,
    identities: &HashMap<String, String>,
    s: &str,
) -> Result<Address, String> {
    let key = identities.get(s).map(String::as_str).unwrap_or(s);
    if key.starts_with('G') || key.starts_with('C') {
        Ok(Address::from_str(_env, key))
    } else {
        Err(format!("unknown identity or invalid address: {s}"))
    }
}

fn parse_i128(value: &Value) -> Result<i128, String> {
    if let Some(n) = value.as_i64() {
        return Ok(n as i128);
    }
    if let Some(s) = value.as_str() {
        return s
            .parse::<i128>()
            .map_err(|_| format!("invalid i128 value: {s}"));
    }
    Err(format!("expected an i128 amount, got {value}"))
}

fn parse_u32(value: &Value) -> Result<u32, String> {
    if let Some(n) = value.as_u64() {
        return u32::try_from(n).map_err(|_| format!("u32 out of range: {n}"));
    }
    if let Some(s) = value.as_str() {
        return s
            .parse::<u32>()
            .map_err(|_| format!("invalid u32 value: {s}"));
    }
    Err(format!("expected a u32 value, got {value}"))
}

fn val_to_json(env: &Env, val: &Val) -> Value {
    let scval = match ScVal::try_from_val(env, val) {
        Ok(scval) => scval,
        Err(_) => return json!(format!("{val:?}")),
    };
    match scval {
        ScVal::Void => Value::Null,
        ScVal::I128(parts) => json!(((parts.hi as i128) << 64) | parts.lo as i128),
        ScVal::U32(n) => json!(n),
        ScVal::String(s) => json!(String::from_utf8_lossy(&s.0).to_string()),
        other => json!(format!("{other:?}")),
    }
}

fn error_to_json(error: soroban_sdk::Error) -> Value {
    match ScError::try_from(error) {
        Ok(ScError::Contract(code)) => json!({
            "kind": "contract",
            "type": "Contract",
            "code": code,
        }),
        Ok(sc) => json!({
            "kind": "contract",
            "type": sc.name(),
            "code": sc_error_code_name(&sc),
        }),
        Err(_) => json!({
            "kind": "contract",
            "type": "Unknown",
            "code": error.get_code(),
        }),
    }
}

fn sc_error_code_name(sc: &ScError) -> String {
    match sc {
        ScError::Contract(code) => code.to_string(),
        ScError::WasmVm(code)
        | ScError::Context(code)
        | ScError::Storage(code)
        | ScError::Object(code)
        | ScError::Crypto(code)
        | ScError::Events(code)
        | ScError::Budget(code)
        | ScError::Value(code)
        | ScError::Auth(code) => code.name().to_string(),
    }
}

fn call_error(fn_name: Option<&str>, message: String) -> Value {
    let mut error = json!({ "kind": "runner", "message": message });
    if let Some(fn_name) = fn_name {
        error["fn"] = json!(fn_name);
    }
    json!({ "ok": false, "error": error })
}

fn runner_error(message: String) -> Value {
    json!({ "ok": false, "error": { "kind": "runner", "message": message } })
}