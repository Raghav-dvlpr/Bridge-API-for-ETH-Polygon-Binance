const Web3 = require('web3');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');
const BridgeMatic = require('../build/contracts/BridgeMatic.json');

const web3Bsc = new Web3('wss://data-seed-prebsc-1-s2.binance.org:8545/');
const web3Matic = new Web3('https://matic-mumbai.chainstacklabs.com');
const adminPrivKey = 'Paste Your Account private Key'; // use your account private key
const { address: admin } = web3Matic.eth.accounts.wallet.add(adminPrivKey);


const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
);

const bridgeMatic = new web3Matic.eth.Contract(
  BridgeMatic.abi,
  BridgeMatic.networks['80001'].address
);
// console.log(bridgeBsc);

bridgeBsc.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;

  const tx = bridgeMatic.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Matic.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeMatic.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Matic.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});