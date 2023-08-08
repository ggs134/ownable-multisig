# Ownable multisig wallet Hardhat Project

This project is a 1 Master and multiple ownable multisig contract.
Master can change owner, num of confirmations, withdraw tokens from multisig wallet.
Owner can submit transaction, confirm transaction, execute transactions.


## TEST

```shell
#It runs test/MultiSigWallet.js
npx hardhat test --network hardhat
REPORT_GAS=true npx hardhat test
```

## DEPLOYMENT

### to localhost
```shell
npx hardhat node
#Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

npx hardhat run scripts/test_deploy_token.js --network localhost
#Test TON with 0x5FbDB2315678afecb367f032d93F642f64180aa3 is deployed 
#Test USDC with 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 is deployed 
#Test USDT with 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 is deployed

npx hardhat run scripts/test_deploy_multisig.js --network localhost
#Multisig with 
#0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,
#0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
#0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 
#of 2 confirm required deployed to 
#0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

### to target network
```shell
## CHANGE in hardhat.config.js files at network :{} section
## CHANGE scripts/arguments.js for your coustructor's variables
## CHANGE .env if you are using dotenv
npx hardhat run scripts/deploy_multisig.js --network <WRITE_YOUR_OWN_NETWORK_NAME> 
```

## VERIFY CODE

- Guide(login required) : https://www.notion.so/onther/verify-contract-4b72acaa7e6c4dd0a8ee09fddfa6c539

### titan-goerli

```shell
# CHANGE scripts/arguments.js which are used when deploying your contracts contructor
npx hardhat verify <TARGET_ADDRESS> --constructor-args scripts/arguments.js --network titangoerli
```

### titan

```shell
# CHANGE scripts/arguments.js which are used when deploying your contracts contructor
npx hardhat verify <TARGET_ADDRESS> --constructor-args scripts/arguments.js --network titan
```