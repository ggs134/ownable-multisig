// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;
  const acc1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const acc2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const acc3 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

  const target = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const multisig = await hre.ethers.getContractAt("MultiSigWallet", target);

  const owners = await multisig.getOwners();
  console.log(owners);

  // console.log(
  //   `Multisig with ${
  //     [acc1, acc2, acc3]
  //   } of 2 confirm required deployed to ${multisig.target}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
