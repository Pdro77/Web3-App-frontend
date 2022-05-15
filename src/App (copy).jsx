
import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/WavePortal.json";
import { ethers } from "ethers";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

/**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = " 0xb1CbdB9b20EC8154Ec3C1302c29e63a96644e9AE";

    /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  /**  calling the function getTotalWaves **/
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        alert("Transaction Mined");

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber()); 
        alert("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
  
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          
        💸 Hey there!
        </div>

        <div className="bio">
          We are P&P and we love Bitcoin and the blockchain projects! Connect your Ethereum wallet and wave at me!
        </div>
        <br></br>
        {/** 
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
          **/}
        <a class="fancy" href="#" onClick={wave}>
          <span class="top-key"></span>
          <span class="text">Click if you like Web3 </span>
          <span class="bottom-key-1"></span>
          <span class="bottom-key-2"></span>
        </a>
        
 <br></br>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
      //<button className="waveButton" onClick={connectWallet}>
           // Connect Wallet
         // </button>*/
        <a class="fancy" href="#" onClick={connectWallet}>
          <span class="top-key"></span>
          <span class="text">Connect Wallet</span>
          <span class="bottom-key-1"></span>
          <span class="bottom-key-2"></span>
        </a>
        
        )}
      </div>
      <br></br>
    </div>
       
  );
}

export default App