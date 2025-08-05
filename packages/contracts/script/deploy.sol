// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from 'forge-std/Script.sol';
import { WelfareIncome } from '../src/welfare-income-zk.sol';

contract DeployScript is Script {
  WelfareIncome public welfare;

  function setUp() public {}

  function run() public {
    vm.startBroadcast();

    welfare = new WelfareIncome();
    console.log('WelfareIncome contract deployed to:', address(welfare));
    console.log('Owner:', welfare.owner());
    console.log('Platform fee percentage:', welfare.platformFeePercentage());
    console.log('Campaign counter:', welfare.campaignCounter());

    vm.stopBroadcast();
  }
}
