const doctorSeed = loadOrCreateMnemonic("doctor.key");
const {address: doctorAddr, client: doctorClient} = await connect(doctorSeed, {});

// patient doesn't have a client here as we will not
// submit any tx with this account, just query balance
const patientSeed = loadOrCreateMnemonic("patient.key");
const patientAddr = await mnemonicToAddress(patientSeed);

console.log(doctorAddr, patientAddr);


doctorClient.getAccount();
// if "undefined", do the following
hitFaucet(defaultFaucetUrl, doctorAddr, "SHELL")
doctorClient.getAccount();


// check patientAddr has no funds
doctorClient.getAccount(patientAddr);

// get the working directory (needed later)
process.cwd()



const wasm = fs.readFileSync('contract.wasm');
// you can add extra information to contract details such as source and builder.
const up = await doctorClient.upload(wasm, { source: "https://crates.io/api/v1/crates/cw-escrow/0.6.0/download", builder: "cosmwasm/rust-optimizer:0.9.0"});

console.log(up);
const { codeId } = up;

const initMsg = {arbiter: doctorAddr, recipient: patientAddr};
const { contractAddress } = await doctorClient.instantiate(codeId, initMsg, "medical-contract", { memo: "memo",transferAmount: [{denom: "ushell", amount: "50000"}]});

// check the contract is set up properly
console.log(contractAddress);
doctorClient.getContract(contractAddress);
doctorClient.getAccount(contractAddress);

// make a raw query - key length prefixed "config"
const key = new Uint8Array([0, 6, ...toAscii("config")]);
const raw = await doctorClient.queryContractRaw(contractAddress, key);
JSON.parse(fromUtf8(raw))
// note the addresses are stored in base64 internally, not bech32, but the data is there... this is why we often implement smart queries on real contracts




const approve = {approve: {quantity: [{amount: "1", denom: "ushell", medicine:"recommended drug",diagnostic:"diagnostic description"}]}};



// but doctor can (and moves tokens to patient)
doctorClient.execute(contractAddress, approve);
// verify patient got the tokens
doctorClient.getAccount(patientAddr);
// verify contract lost
doctorClient.getAccount(contractAddress);


