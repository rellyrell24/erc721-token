const { assert } = require("console");

const TestStarToken = artifacts.require("./StarToken.sol");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

let accs;
var owner;
contract("TestStarToken", function ( accounts ) {
  accs = accounts;
  owner = accs[0];
});

it("should create a star", async function () {
  let tokenId = 1;
  let instance = await TestStarToken.deployed();
  await instance.createStar("Jerry", "08/28/2021", tokenId), {"from": owner};
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Jerry");
})
