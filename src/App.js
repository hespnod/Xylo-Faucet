import './App.css';
import faucetContract from './ethereum/faucet';
// import { ethers } from 'ethers';
import { useState, useEffect } from "react";
import { GoMarkGithub } from "react-icons/go";

function App() {

  const ethers = require("ethers");

  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  useEffect(() => {
    getConnectedAccounts();
    addWalletListner();
  });

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      // Meta Mask is installed
      try {
        /* Get Provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Get Accounts
        const accounts = await provider.send("eth_requestAccounts", []);
        //Get Singer
        setSigner(provider.getSigner());
        //Local Contract Instance
        setFcContract(faucetContract(provider));
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      alert("Please install MetaMask first :");
    }
  };
  const getConnectedAccounts = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* Get Provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Get Accounts
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          //Get Singer
          setSigner(provider.getSigner());
          //Local Contract Instance
          setFcContract(faucetContract(provider));
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using connect wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask first :");
    }
  };

  const addWalletListner = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      setWalletAddress("");
    }
  };

  const getXYLhandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      const resp = await fcContractWithSigner.requestToken();
      console.log(resp);
      setWithdrawSuccess("Operation Successfull enjoy your tokens :-)");
      setTransactionData(resp.hash);
    } catch (err) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  return (
    <div className="main">
      <nav className="navbar">
        <span className="heading">
          <h2>Xylo Token Faucet (XYL)   </h2>
        </span>
        <button className="connect" onClick={connectWallet}>{walletAddress && walletAddress.length > 0 ? `Connected: ${walletAddress.substring(0, 4)}...${walletAddress.substring(38)}` : "Connect Wallet"}</button>
      </nav>
      <div className="mt-5">{withdrawError && (<div className='error'>{withdrawError}</div>)}</div>
      <div className="mt-5">{withdrawSuccess && (<div className='success'>{withdrawSuccess}</div>)}</div>
      <div className='middleBlock'>
        <div className="input">
          <input type="text" className="address" placeholder="Enter your wallet address (0x0)" defaultValue={walletAddress} />
          <button className="send" onClick={getXYLhandler} disabled={walletAddress ? false : true}>Get Tokens</button>
          <div className="trans">
            <article className="data">
              <p className="tdata">Transaction Data</p>
              <div className="innerdata">
                <p className="innertrans">{transactionData ? `Transaction Hash:${transactionData}` : "--"}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <footer className="links">
        <article className="github">
          <a href="https://github.com/hespnod" target='_blank' rel="noopener noreferrer"><h2><GoMarkGithub /></h2></a>
        </article>
        <article className="linkedin">
          <a href="https://www.linkedin.com/in/rishabh-sharma-4755b423a/" target='_blank' rel="noopener noreferrer"><img src="./faucet-front-end/img/icons8-linkedin-48.png" alt="LinkedIn" /></a>
        </article>
      </footer>
    </div >
  );
}
export default App;
