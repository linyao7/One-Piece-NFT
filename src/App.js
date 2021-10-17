import './App.css';
import onepiece from './assets/one-piece.jpg';
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import myEpicNft from './utils/MyEpicNFT.json';

import { Grid, Typography, Button } from '@mui/material';

//Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const OPENSEA_LINK = process.env.REACT_APP_OPENSEA_LINK;
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
console.log("contract add is: ", CONTRACT_ADDRESS)

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if(!ethereum) {
      console.log("Make sure you have Metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    //check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }

    //alert user if they are not connected to the right network
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain: ", chainId);

    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        alert("Get Metamask!");
        return;
      }

      //fancy method to request access to account
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListener = () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        //This will essentially "capture" the event emitted when our contract throws it.
        //Similar to webhooks
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log("Minted from: %s, Token Id: %i", from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()} `);
        })

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      } 
    } catch (error) {
      console.log(error);
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Minting... please wait. ");
        await nftTxn.wait();

        console.log(`Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  })

  return (
    <div className="App" >
      <div 
        className="container" 
        style={{
          backgroundImage: `url(${onepiece})`,
          width: window.innerWidth,
          height: window.innerHeight
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h2'>One Piece NFT</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6'>
              "I'll be the next Pirate King!"
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {currentAccount === "" ? (
                  <Button variant='contained' onClick={connectWallet} >
                    Connect to Wallet
                  </Button>
                ) : (
                  <Button variant='contained' onClick={askContractToMintNft}>
                    Mint NFT
                  </Button>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button variant='contained' onClick={() => {window.open(OPENSEA_LINK)}}>View My NFT Collection</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <div>
          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default App;
