# Uniswap V2 exchange example

The project demonstrates how the exchange of custom tokens is done. Here we use [UniswapV2Router02](https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02) to prevent interference between separate transactions. The tokens conform ERC-20 protocol. In [swapping function](https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02#swapexacttokensfortokens) we set parameter ```amountOutMin``` to ```0```, but in production you should be carefull. For a real project, this value should be calculated using our SDK or the price oracle - this helps leads to uncharacteristically low prices for the case, which may be the result of a front or any other type of price manipulation.

## Building and running:
Preliminary add your ALCHEMY_API_KEY to environment variables.
```
npm i
npx hardhat test
```

## Logging output:
```
Liquidity provider address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Deploying BirdCoin and DogeCoin...
Deployed BirdCoin to 0xc3023a2c9f7B92d1dd19F488AF6Ee107a78Df9DB
Deployed DogeCoin to 0x124dDf9BdD2DdaD012ef1D5bBd77c00F05C610DA
Transferring 1000000 BirdCoin to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8...
Transferred 1000000 BirdCoin to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Approving 1000000 BirdCoin to 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D...
Approved 1000000 BirdCoin to 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Approving 1000000 DogeCoin to 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D...
Approved 1000000 DogeCoin to 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Adding liquidity for BirdCoin and DogeCoin...
Approving 77 BirdCoin to 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D...
User BirdCoin balance before swap: 1000000
User DogeCoin balance before swap: 0
Swapping 77 BirdCoin for DogeCoin...
User BirdCoin balance after swap: 999923
User DogeCoin balance after swap: 76
```
