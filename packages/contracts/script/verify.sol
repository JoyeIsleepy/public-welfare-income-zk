// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from 'forge-std/Script.sol';
import { WelfareIncome } from '../src/welfare-income-zk.sol';

contract VerifyScript is Script {
  function run() public view {
    // 硬编码的合约地址
    address contractAddress = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;

    console.log('Checking contract at address:', contractAddress);

    // 检查合约是否存在
    uint256 codeSize;
    assembly {
      codeSize := extcodesize(contractAddress)
    }

    if (codeSize > 0) {
      console.log('Contract found! Code size:', codeSize);

      // 尝试调用合约函数
      WelfareIncome welfare = WelfareIncome(contractAddress);

      try welfare.owner() returns (address owner) {
        console.log('Contract owner:', owner);
      } catch {
        console.log('Failed to call owner() function');
      }

      try welfare.campaignCounter() returns (uint256 counter) {
        console.log('Campaign counter:', counter);
      } catch {
        console.log('Failed to call campaignCounter() function');
      }

      try welfare.platformFeePercentage() returns (uint256 fee) {
        console.log('Platform fee percentage:', fee);
      } catch {
        console.log('Failed to call platformFeePercentage() function');
      }
    } else {
      console.log('No contract found at this address');
    }
  }
}
