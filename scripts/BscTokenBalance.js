const TokenBsc = artifacts.require('./TokenBsc.sol');

module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();
  const tokenBsc = await TokenBsc.deployed();
  const balance = await tokenBsc.balanceOf(sender);
  console.log(balance.toString());
  done();
}
