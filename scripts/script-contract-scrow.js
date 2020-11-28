//cria chave e um cliente para o médico
// client para o médico realizar as transações
const doctorSeed = loadOrCreateMnemonic("doctor.key");
const {address: doctorAddr, client: doctorClient} = await connect(doctorSeed, {});


// cria chave para o paciente
// cria um endereço para o paciente
const patientSeed = loadOrCreateMnemonic("patient.key");
const patientAddr = await mnemonicToAddress(patientSeed);


console.log(doctorAddr, patientAddr);



// cria uma conta para o médico
doctorClient.getAccount();
hitFaucet(defaultFaucetUrl, doctorAddr, "SHELL")
doctorClient.getAccount();


// verifica se o paciente possui tokens
doctorClient.getAccount(patientAddr);

// diretório atual
process.cwd()



// leitura do arquivo contrato
const wasm = fs.readFileSync('contract.wasm');

// deploy do contrato na rede 
const up = await doctorClient.upload(wasm, { source: "https://crates.io/api/v1/crates/cw-escrow/0.6.0/download", builder: "cosmwasm/rust-optimizer:0.9.0"});

console.log(up);
const { codeId } = up;


// estado inicial do contrato com o endereço do médico e do paciente.
const initMsg = {arbiter: doctorAddr, recipient: patientAddr};
const { contractAddress } = await doctorClient.instantiate(codeId, initMsg, "medical-contract-test", { memo: "memo",transferAmount: [{denom: "ushell", amount: "50000"}]});

// verifica o endereço do contrato
console.log(contractAddress);
doctorClient.getContract(contractAddress);
doctorClient.getAccount(contractAddress);




// cria uma prescrição
const approve = {approve: {quantity: [{
	amount: "1", denom: "ushell",
	medicine:"recommended medicine",
	diagnostic:"diagnostic description"}]}};





//prescrição é enviada para a rede para ser validada
doctorClient.execute(contractAddress, approve);

// verifica a quantidade de prescrições já realizadas e aprovadas do paciente.
doctorClient.getAccount(patientAddr);

