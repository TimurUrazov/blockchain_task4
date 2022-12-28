
const { expect } = require("chai");
const UniswapV2Router02Abi = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");
const UniswapRouterV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" 

describe("SwapTest", function () {
  const birdCoinLiquidity = 1_000_000;
  const dogeCoinLiquidity = 1_000_000;
  const consumerBalance = 1_000_000;
  const tokensSupply = 100_000_000;
  const swapAmount = 77;

  async function deployToken(signer, tokenName, tokenSupply = tokensSupply) {
    const tokenFactory = await ethers.getContractFactory(tokenName)
    const token = await tokenFactory.connect(signer).deploy(tokenSupply)
    await token.deployed()
    console.log(`Deployed ${tokenName} to ${token.address}`)
    return token
  }

  it("Swap", async function swap() {
    const [liquidityProvider, consumer] = await ethers.getSigners()

    const liquidityProviderAddress = await liquidityProvider.getAddress();
    const consumerAddress = await consumer.getAddress();
    console.log(`Liquidity provider address: ${liquidityProviderAddress}`)
    console.log(`User address: ${consumerAddress}`)

    console.log(`Deploying BirdCoin and DogeCoin...`)
    const birdCoin = await deployToken(liquidityProvider, "BirdCoin")
    const dogeCoin = await deployToken(liquidityProvider, "DogeCoin")

    expect(await birdCoin.balanceOf(liquidityProvider.address)).to.equal(tokensSupply);
    expect(await dogeCoin.balanceOf(liquidityProvider.address)).to.equal(tokensSupply);

    console.log(`Transferring ${consumerBalance} BirdCoin to ${consumer.address}...`)
    await birdCoin.transfer(consumer.address, consumerBalance);
    console.log(`Transferred ${consumerBalance} BirdCoin to ${consumer.address}`)

    expect(await birdCoin.balanceOf(consumer.address)).to.equal(consumerBalance);

    console.log(`Approving ${birdCoinLiquidity} BirdCoin to ${UniswapRouterV2Address}...`)
    await birdCoin.approve(UniswapRouterV2Address, birdCoinLiquidity);
    console.log(`Approved ${birdCoinLiquidity} BirdCoin to ${UniswapRouterV2Address}`)

    console.log(`Approving ${dogeCoinLiquidity} DogeCoin to ${UniswapRouterV2Address}...`)
    await dogeCoin.approve(UniswapRouterV2Address, dogeCoinLiquidity);
    console.log(`Approved ${dogeCoinLiquidity} DogeCoin to ${UniswapRouterV2Address}`)

    const uniswapRouterV2 = await ethers.getContractAt(UniswapV2Router02Abi.abi, UniswapRouterV2Address);
    
    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);

    console.log(`Adding liquidity for BirdCoin and DogeCoin...`)
    uniswapRouterV2.addLiquidity(
      birdCoin.address,
      dogeCoin.address,
      birdCoinLiquidity,
      dogeCoinLiquidity,
      0,
      0,
      liquidityProvider.address,
      block.timestamp + 1000
    )

    expect(await birdCoin.balanceOf(liquidityProvider.address)).to.equal(tokensSupply - birdCoinLiquidity - dogeCoinLiquidity);

    console.log(`Approving ${swapAmount} BirdCoin to ${UniswapRouterV2Address}...`)
    await birdCoin.connect(consumer).attach(birdCoin.address).approve(UniswapRouterV2Address, swapAmount);

    const birdCoinBalanceBefore = await birdCoin.balanceOf(consumer.address);
    console.log(`User BirdCoin balance before swap: ${birdCoinBalanceBefore}`)

    const dogeCoinBalanceBefore = await dogeCoin.balanceOf(consumer.address);
    console.log(`User DogeCoin balance before swap: ${dogeCoinBalanceBefore}`)

    const path = [birdCoin.address, dogeCoin.address];
  
    console.log(`Swapping ${swapAmount} BirdCoin for DogeCoin...`)
    uniswapRouterV2.connect(consumer).attach(UniswapRouterV2Address).swapExactTokensForTokens(
      swapAmount,
      0,
      path,
      consumer.address,
      block.timestamp + 1000
    )

    console.log(`User BirdCoin balance after swap: ${await birdCoin.balanceOf(consumer.address)}`)
    console.log(`User DogeCoin balance after swap: ${await dogeCoin.balanceOf(consumer.address)}`)

    expect(await birdCoin.balanceOf(consumer.address)).to.equal(birdCoinBalanceBefore - swapAmount);
    expect(await dogeCoin.balanceOf(consumer.address)).to.be.greaterThan(dogeCoinBalanceBefore);
    expect(await dogeCoin.balanceOf(consumer.address)).to.be.lessThanOrEqual(dogeCoinBalanceBefore + swapAmount);
  })
});
