// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DogeCoin is ERC20 {
  constructor(uint supply) ERC20("DogeCoin", "DC") {
    _mint(msg.sender, supply);
  }
}
