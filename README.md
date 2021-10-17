mkdir epic-nfts
cd epic-nfts
npm init -y
npm install --save-dev hardhat

npx hardhat

npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers

npm install @openzeppelin/contracts

npx hardhat run scripts/sample-script.js

change solidity: "0.8.4", to solidity: "0.8.0", in your hardhat.config.json
npx hardhat run scripts/run.js

<!-- My json file
https://jsonkeeper.com/b/CZZ6 -->

npx hardhat run scripts/deploy.js --network rinkeby

<!-- use metamask wallet and connect to rinkeby network
get test ethers from rinkeby faucets

sample nfts
https://testnets.opensea.io/collection/squarenft-mws390s0ca -->


<!-- Let's say you want to change your contract. You'd need to do 3 things:
1. We need to deploy it again.
2. We need to update the contract address on our frontend.
3. We need to update the abi file on our frontend.  -->


<!-- will need to hardcode OPENSEA_LINK for collection -->

npm install --save dotenv
