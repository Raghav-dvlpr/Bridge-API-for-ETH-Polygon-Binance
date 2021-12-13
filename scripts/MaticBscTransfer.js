const BridgeMatic = artifacts.require('./BridgeMatic.sol');

module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeMatic = await BridgeMatic.deployed();
  await bridgeMatic.burn(recipient, 1000);
  done();
}

