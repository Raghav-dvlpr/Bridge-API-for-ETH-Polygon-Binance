const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeMatic = require('../build/contracts/BridgeMatic.json');

const web3Eth = new Web3('Paste your WSS Infura API Link '); // use WSS link of Infura API {eg:}-> wss://rinkeby.infura.io/ws/v3/0xxxxx0x0x0x0xxxx
const web3Matic = new Web3('wss://ws-matic-mumbai.chainstacklabs.com');
const adminPrivKey = 'Paste Your Account private Key'; // use your account private key
//const { address: admin } = web3Matic.eth.accounts.wallet.add(adminPrivKey);
const { address: admin } = web3Eth.eth.accounts.wallet.add(adminPrivKey);

const bridgeMatic = new web3Matic.eth.Contract(
  BridgeMatic.abi,
  BridgeMatic.networks['80001'].address
);

const bridgeEth = new web3Eth.eth.Contract(
    BridgeEth.abi,
    BridgeEth.networks['4'].address
  );

console.log("Level 1");
bridgeMatic.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;
  console.log("Level 2 on function");
  const tx = bridgeEth.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Eth.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeEth.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Eth.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});

