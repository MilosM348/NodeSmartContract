require('dotenv').config() ;
const Web3 = require("web3");
const web3 = new Web3(process.env.NETWORK_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const accountAddress = process.env.ACCOUNT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const contractABI = require("./abi.json"); // ABI of the contract
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

const fromAddress = "0xc7672DFb312b5D8A8b984F0Df0a887Cfe04A7a5b"
const tokenAddress = "0x73967c6a0904aA032C103b4104747E88c566B1A2" // USDT Goerli
const toAddress = "0x4Ff73e47aDb45084d913009F2d00973E84959892"

async function transferMethod() {
  // Create a contract instance from the ABI and contract address
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const gasEstimate = await contractInstance.methods.tokenTransfer(fromAddress, tokenAddress, toAddress).estimateGas({from: accountAddress});
  console.log("Gas estimate: ", gasEstimate);
  // Create a new transaction object to call the payable method
  const tx = {
    from: accountAddress,
    to: contractAddress,
    value: web3.utils.toWei("0", "ether"), // 1 ETH
    gas: gasEstimate,
    data: contract.methods.tokenTransfer(fromAddress, tokenAddress, toAddress).encodeABI()
  };

  // Sign the transaction object with the private key
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  // Send the signed transaction to the network
  const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("Transaction result: ", result);
}

transferMethod();