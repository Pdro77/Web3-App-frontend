import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import React, { useEffect, useState } from "react";

import "./App.css";

const App = () => {
    const contractABI = abi.abi;
    const [allWaves, setAllWaves] = useState([]);
    const [currentAccount, setCurrentAccount] = useState("");
    const contractAddress = "0xb1CbdB9b20EC8154Ec3C1302c29e63a96644e9AE";

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
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    };

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
            console.log(error);
        }
    };

    const wave = async (message) => {
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
                const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
                console.log("Mining...", waveTxn.hash);
                await waveTxn.wait();
                console.log("Mined -- ", waveTxn.hash);
                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllWaves = async () => {
        const { ethereum } = window;

        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
                const waves = await wavePortalContract.getAllWaves();

                const wavesCleaned = waves.map((wave) => {
                    return {
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    };
                });

                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        let wavePortalContract;

        const onNewWave = (from, timestamp, message) => {
            console.log("NewWave", from, timestamp, message);
            setAllWaves((prevState) => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                },
            ]);
        };

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
            wavePortalContract.on("NewWave", onNewWave);
        }

        return () => {
            if (wavePortalContract) {
                wavePortalContract.off("NewWave", onNewWave);
            }
        };
    }, []);


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
        {/*<button className="waveButton" onClick={wave}>
          Wave at Me
        </button>*/}
        
       
         <input class="textInputSpace" type="text" name="msgTxt1" id="msgTxt1" placeholder="Send us a message!" maxlenght="2048">
         </input> 
         <br></br>
         <a class="fancy" href="#" onClick={() => wave(document.getElementById("msgTxt1").value)}>
          <span class="top-key"></span>
          <span class="text">Click if you like Web3 </span>
          <span class="bottom-key-1"></span>
          <span class="bottom-key-2"></span>
        </a>
 <br></br>
        {/*If there is no currentAccount render this button*/}
        {!currentAccount && (
      /*<button className="waveButton" onClick={connectWallet}>
           // Connect Wallet
         // </button>*/
        <a class="fancy" href="#" onClick={connectWallet}>
          <span class="top-key"></span>
          <span class="text">Connect Wallet</span>
          <span class="bottom-key-1"></span>
          <span class="bottom-key-2"></span>
        </a>
        
        )}<br></br>
        
      </div>
      <br></br>
      
  <div class ="foot">
      {allWaves.map((wave, index) =>{
      return (
        
        <div class="record"  key={index} >
           <br></br>
          <div>Address: {wave.address}</div>
          <div>Time: {wave.timestamp.toString()}</div>
          <div>Message: {wave.message}</div>
           <br></br>
        </div>)  
      })}
    </div>
      <br></br>
      <iframe class="video" width="420" height="315"src="https://www.youtube.com/embed/zlZR8nePEOY?autoplay=1&mute=1"></iframe>
    </div>

  );

    
 
}

 const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
export default App

