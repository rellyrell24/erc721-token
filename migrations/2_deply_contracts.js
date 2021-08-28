const StarToken = artifacts.require("StarToken");

module.exports = function (deployer) {
  deployer.deploy(StarToken, "Star", "STR");
};
