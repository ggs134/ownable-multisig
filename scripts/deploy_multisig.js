// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const args = require("./arguments.js");

async function main() {

  const numReqConfirm = args[1];

  const multisig = await hre.ethers.deployContract(
    "MultiSigWallet", 
    [args[0], args[1]],
    { 
      value: 0, 
    }
  );

  await multisig.waitForDeployment();

  console.log(
    `Multisig with ${
      args[0]
    } of ${args[1]} confirms required deployed to ${multisig.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
