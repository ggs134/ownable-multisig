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

  const numReqConfirm = 2;

  // const lockedAmount = hre.ethers.parseEther("0.001");

  // const multisig = await hre.ethers.deployContract(
  //   "MultiSigWallet", 
  //   [[acc1, acc2, acc3], numReqConfirm],
  //   { 
  //     value: 0, 
  //   }
  // );

  // await multisig.waitForDeployment();

  // console.log(
  //   `Multisig with ${
  //     [acc1, acc2, acc3]
  //   } of 2 confirm required deployed to ${multisig.target}`
  // );

  ///////////

  const initialSupply = hre.ethers.parseEther("900000");

  const test_TON = await hre.ethers.deployContract(
    "TestTON",
    [initialSupply], {value: 0}
  );

  const test_USDC = await hre.ethers.deployContract(
    "TestUSDC",
    [initialSupply], {value: 0}
  );

  const test_USDT = await hre.ethers.deployContract(
    "TestUSDT",
    [initialSupply], {value: 0}
  );

  console.log(
    `Test TON with ${test_TON.target} is deployed`,
    `Test USDC with ${test_USDC.target} is deployed`,
    `Test USDT with ${test_USDT.target} is deployed`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//use command for hardhat local node: npx hardhat run scripts/test_deploy_multisig.js --network localhost
