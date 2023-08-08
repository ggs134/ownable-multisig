require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
    },
    // titan: {
    //   url: `${process.env.ETH_NODE_URI_TITAN}`,
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    //   chainId: 55004
    // },
    // titangoerli: {
    //   url: `${process.env.ETH_NODE_URI_TITAN_GOERLI}`,
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    //   chainId: 5050
    // }
  },
  etherscan: {
    apiKey: {
      titan: "abc",
      titangoerli: "abc"
    } ,
    customChains: [
      {
        network: "titan",
        chainId: 55004,
        urls: {
          apiURL: "https://explorer.titan.tokamak.network/api",
          browserURL: "https://explorer.titan.tokamak.network"
        }
      },
      {
        network: "titangoerli",
        chainId: 5050,
        urls: {
          //https://tokamak-network.slack.com/archives/C01L9JLECLW/p1691027406871039
          apiURL: "https://goerli.explorer.tokamak.network/api",
          browserURL: "https://goerli.explorer.tokamak.network"
        }
      }
    ]
  }
};
