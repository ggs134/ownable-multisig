const { ethers } = require("hardhat");

const {
    time,
    loadFixture,
    mine,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

describe("Multisig", function () {
// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
    async function deployMultisigFixture() {

        const [owner1, owner2, owner3] = await ethers.getSigners();
        //owner1 : 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        //owner2 : 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        //owner3 : 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

        const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
        
        const multisig = await MultiSigWallet.deploy([owner1, owner2, owner3], 2 , {});

        return {multisig, owner1, owner2, owner3};
    };

    async function deployTestTokenFixture() {
        let {multisig, acc1, acc2, acc3} = await loadFixture(deployMultisigFixture);

        const [owner1, owner2, owner3] = await ethers.getSigners();
        const TestToken = await ethers.getContractFactory("TestToken");

        const weiAmount = ethers.parseUnits("1000", "ether");


        //transfer token to multisig and account2
        const testToken = await TestToken.deploy(weiAmount, {});

        let amount1 = ethers.parseEther("100","ether");
        let amount2 = ethers.parseEther("200","ether");

        let tx1 = testToken.transfer(multisig.target, amount1);
        let tx2 = testToken.transfer(owner2, amount2);
        
        await mine(1);
        //owner1   = 700 testToken
        //owner2   = 200 testToken
        //multisig = 100 testToken

        return {testToken};
    }

    it("Should all accounts to be set", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        expect(await multisig.isOwner(owner1)).to.equal(true);
        expect(await multisig.isOwner(owner2)).to.equal(true);
        expect(await multisig.isOwner(owner3)).to.equal(true);
    });

    it("Should first account be a master", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        expect(await multisig.isMaster(owner1)).to.equal(true);
    });

    it("Should one of owner be changed", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        let signers = await ethers.getSigners();
        // owner4 : 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        let owner4 = signers[3];
        // console.log(owner4);
        // change first owner to owner4
        await multisig.changeOwner(0, owner4);
        await mine(1);

        expect(await multisig.isOwner(owner1)).to.equal(false);
        expect(await multisig.isOwner(owner4)).to.equal(true);
    });

    it("Should only Master change owner", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        let signers = await ethers.getSigners();
        // owner4 : 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        let owner4 = signers[3];
        // ?? WHY NO NEED "await" HERE
        let tx = multisig.connect(owner2).changeOwner(0, owner4);
        await expect(tx).to.be.revertedWith(
            "not master"
          );
    });

    it("Should Master be changed", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        let signers = await ethers.getSigners();
        // owner4 : 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        let owner4 = signers[3];
        await multisig.changeMaster(owner4);
        expect(await multisig.isMaster(owner4)).to.equal(true);
    });

    it("Can Owner submit transaction and submitted data is correct", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        let {testToken} = await loadFixture(deployTestTokenFixture);

        let signers = await ethers.getSigners();
        // owner4 : 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        let owner4 = signers[3];

        // let txData = multisig.interface.encodeFunctionData(
        //     "changeOwner",
        //     [0, owner4.address]
        // );

        let amount = ethers.parseEther("50","ether");
        
        let txData = testToken.interface.encodeFunctionData(
            "transfer",
            [owner1.address, amount]
        );

        // console.log(txData);
        // console.log(testToken.target);
    
        await multisig.submitTransaction(
            testToken.target, 
            0,
            txData
        );

        await mine(1);

        let submittedTx = await multisig.getTransaction(0);
        // console.log(submittedTx);

        expect(submittedTx[0]).to.equal(testToken.target);//tx.to
        expect(submittedTx[1]).to.equal(0);//tx.value
        expect(submittedTx[2]).to.equal(txData);//tx.data
        expect(submittedTx[3]).to.equal(false);//tx.executed
        expect(submittedTx[4]).to.equal(1);//tx.numConfirmations
    });

    it("Should Master withdraw token", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        let {testToken} = await loadFixture(deployTestTokenFixture);

        let amountWithdrawal = ethers.parseEther("30","ether");
        let amountRemain = ethers.parseEther("70","ether");

        await multisig.withdrawToken(testToken.target, amountWithdrawal);

        await mine(1);
        
        let multisigBalance = await testToken.balanceOf(multisig.target);
        // console.log(multisigBalance);
        expect(multisigBalance).to.equal(amountRemain);
    });

    it("Should required confirmed executed", async function () {
        let {multisig, owner1, owner2, owner3} = await loadFixture(deployMultisigFixture);
        let {testToken} = await loadFixture(deployTestTokenFixture);

        let signers = await ethers.getSigners();
        // owner4 : 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        let owner4 = signers[3];

        // let txData = multisig.interface.encodeFunctionData(
        //     "changeOwner",
        //     [0, owner4.address]
        // );

        let amount = ethers.parseEther("40","ether");
        
        let txData = testToken.interface.encodeFunctionData(
            "transfer",
            [multisig.target, amount]
        );

        await multisig.submitTransaction(
            testToken.target, 
            0,
            txData
        );
        await mine(1);

        let confirmTx = await multisig.connect(owner3).confirmTransaction(0);
        await mine(1);

        let getTx = await multisig.getTransaction(0)

        expect(getTx[4]).to.equal(2); //tx.numConfirmations == 2
    });

    // it("Should not less required confirmed executed");
    // it("Should not non-owner submit trasaction");
    // it("Should not non-owner confirm trasaction");
    // it("Should revoke work");

});