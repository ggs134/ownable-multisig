const { ethers } = require("hardhat");

const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("Multisig", function () {
// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
    async function deployMultisigFixture() {

        const [owner1, owner2, owner3] = await ethers.getSigners();

        const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
        
        
        ultisig = await MultiSigWallet.deploy([owner1, owner2, owner3], 2 , {});

        return {multisig, owner1, owner2, owner3};
    };


    describe("Deployment", function () {
        it("Should owners to be set", async function () {
            const {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
            console.log("multisig object : ");
            console.log(await multisig.getOwners());
            console.log(await multisig.isOwner(owner1));
            console.log(await multisig.isMaster(owner1));
            console.log(await multisig.isMaster(owner2));
            console.log(await multisig.isMaster(owner3));


            // expect(await multisig.owners(owner1)).to.equal(1);
        });
    });

});