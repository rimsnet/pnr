const CovidTraker = artifacts.require("CovidTraker");

module.exports = function(deployer) {
  deployer.deploy(CovidTraker);
};
