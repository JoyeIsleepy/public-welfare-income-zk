# Primus SDK 文档 - Monad Testnet

## 概述

Primus SDK 是一个基于 zkTLS (Zero-Knowledge Transport Layer Security) 技术的数据验证解决方案，支持在保护隐私的同时验证互联网数据的真实性。本文档专注于 Monad Testnet 的集成信息。

## Monad Testnet 部署信息

### 智能合约地址

| 合约名称 | 地址 |
| -------- | ---- |
| Primus   | `0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431` |

## zkTLS SDK 安装

### 前端安装

```bash
# 使用 npm
npm install --save @primuslabs/zktls-js-sdk

# 使用 yarn
yarn add --save @primuslabs/zktls-js-sdk
```

### 后端安装

```bash
# 使用 npm
npm install --save @primuslabs/zktls-core-sdk

# 使用 yarn
yarn add --save @primuslabs/zktls-core-sdk
```

## 前端集成示例

### 基础配置

```javascript
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk";

// 初始化参数，建议在页面初始化时调用
const primusZKTLS = new PrimusZKTLS();
const appId = "YOUR_APPID";
const initAttestaionResult = await primusZKTLS.init(appId);

// 设备类型检测（可选）
let platformDevice = "pc";
if (navigator.userAgent.toLocaleLowerCase().includes("android")) {
    platformDevice = "android";
} else if (navigator.userAgent.toLocaleLowerCase().includes("iphone")) {
    platformDevice = "ios";
}
// const initAttestaionResult = await primusZKTLS.init(appId, "", {platform: platformDevice});
```

### 完整验证流程

```javascript
export async function primusProof() {
    // 设置模板ID和用户地址
    const attTemplateID = "YOUR_TEMPLATEID";
    const userAddress = "YOUR_USER_ADDRESS";
    
    // 生成验证请求
    const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

    // 设置 zkTLS 模式（可选，默认为代理模式）
    const workMode = "proxytls";
    request.setAttMode({
        algorithmType: workMode,
    });

    // 设置验证条件（可选）
    // 1. 哈希结果
    // const attConditions = [
    //  [
    //   { 
    //     field:'YOUR_CUSTOM_DATA_FIELD',
    //     op:'SHA256',
    //   },
    //  ],
    // ];
    
    // 2. 条件结果
    // const attConditions = [
    //  [
    //    {
    //      field: "YOUR_CUSTOM_DATA_FIELD",
    //      op: ">",
    //      value: "YOUR_CUSTOM_TARGET_DATA_VALUE",
    //    },
    //  ],
    // ];
    // request.setAttConditions(attConditions);

    // 将请求对象转换为字符串
    const requestStr = request.toJsonString();

    // 从后端获取签名响应
    const response = await fetch(`http://YOUR_URL:PORT?YOUR_CUSTOM_PARAMETER`);
    const responseJson = await response.json();
    const signedRequestStr = responseJson.signResult;

    // 开始验证过程
    const attestation = await primusZKTLS.startAttestation(signedRequestStr);
    console.log("attestation=", attestation);

    // 验证签名
    const verifyResult = await primusZKTLS.verifyAttestation(attestation);
    console.log("verifyResult=", verifyResult);

    if (verifyResult === true) {
        // 业务逻辑检查，如验证内容和时间戳检查
        // 执行您自己的业务逻辑
    } else {
        // 如果失败，定义您自己的逻辑
    }
}
```

### 测试环境示例（仅用于测试）

```javascript
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk"

// 初始化参数
const primusZKTLS = new PrimusZKTLS();
const appId = "YOUR_APPID";
const appSecret = "YOUR_SECRET"; // 仅用于测试，appSecret 不能写在前端代码中
const initAttestaionResult = await primusZKTLS.init(appId, appSecret);

export async function primusProof() {
    const attTemplateID = "YOUR_TEMPLATEID";
    const userAddress = "YOUR_USER_ADDRESS";
    
    const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);
    
    // 设置 zkTLS 模式
    const workMode = "proxytls";
    request.setAttMode({
        algorithmType: workMode,
    });

    const requestStr = request.toJsonString();
    
    // 直接签名请求（仅测试环境）
    const signedRequestStr = await primusZKTLS.sign(requestStr);
    
    const attestation = await primusZKTLS.startAttestation(signedRequestStr);
    console.log("attestation=", attestation);
    
    const verifyResult = await primusZKTLS.verifyAttestation(attestation)
    console.log("verifyResult=", verifyResult);

    if (verifyResult === true) {
        // 业务逻辑处理
    } else {
        // 失败处理逻辑
    }
}
```

## 后端集成示例

### Express.js 后端实现

```javascript
const express = require("express");
const cors = require("cors");
const { PrimusZKTLS } = require("@primuslabs/zktls-js-sdk");

const app = express();
const port = YOUR_PORT;

// 测试用途，开发者可以修改
app.use(cors());

// 监听客户端的签名请求并签名验证请求
app.get("/primus/sign", async (req, res) => {
  const appId = "YOUR_APPID";
  const appSecret = "YOUR_SECRET";

  // 创建 PrimusZKTLS 对象
  const primusZKTLS = new PrimusZKTLS();

  // 通过初始化函数设置 appId 和 appSecret
  await primusZKTLS.init(appId, appSecret);

  // 签名验证请求
  console.log("signParams=", req.query.signParams);
  const signResult = await primusZKTLS.sign(req.query.signParams);
  console.log("signResult=", signResult);

  // 返回签名结果
  res.json({ signResult });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

## 智能合约集成

### 安装合约库

```bash
# 使用 Hardhat
npm install @primuslabs/zktls-contracts

# 使用 Foundry
forge install primus-labs/zktls-contracts
```

### 智能合约示例

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 如果使用 foundry，可以在 remappings.txt 中添加：
// @primuslabs/zktls-contracts=lib/zktls-contracts/

import { IPrimusZKTLS, Attestation } from "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";

contract AttestorTest {
   address public primusAddress;

   constructor(address _primusAddress) {
      // 替换为您要部署的网络上的 Primus 合约地址
      // Monad Testnet: 0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431
      primusAddress = _primusAddress;
   }

   function verifySignature(Attestation calldata attestation) public view returns(bool) {
        IPrimusZKTLS(primusAddress).verifyAttestation(attestation);

        // 业务逻辑检查，如验证内容和时间戳检查
        // 执行您自己的业务逻辑
        return true;
   }
}
```

### 链上交互示例

```javascript
// 开始验证过程
const attestation = await primusZKTLS.startAttestation(signedRequestStr);
console.log("attestation=", attestation);

if (verifyResult === true) {
    // 业务逻辑检查，如验证内容和时间戳检查
    // 执行您自己的业务逻辑

    // 与智能合约交互
    // 设置合约地址和 ABI
    const contractAddress = "0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431"; // Monad Testnet
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    // 调用合约验证方法
    const result = await contract.verifySignature(attestation);
    console.log("Contract verification result:", result);
}
```

## zkTLS 模式

Primus zkTLS SDK 支持两种模式：

1. **代理模式 (Proxy Mode)** - 默认模式
2. **MPC 模式 (MPC Mode)** - 多方计算模式

```javascript
// 设置 zkTLS 模式
primusZKTLS.setAttMode({
    algorithmType: "proxytls", // 或 "mpctls"
});
```

## 验证逻辑类型

1. **明文验证结果** - 默认返回明文验证结果
2. **哈希验证结果** - 返回 SHA256 哈希的数据项以保护隐私

## 注意事项

- 在生产环境中，`appSecret` 不应写在前端代码中
- 建议在页面初始化时调用 `init` 函数
- 目前支持 Android 设备，iOS 支持即将推出
- 所有示例代码都应根据具体业务需求进行调整
- 在 Monad Testnet 上部署合约时，请使用提供的 Primus 合约地址

## 相关链接

- [GitHub Repository](https://github.com/primus-labs/zktls-js-sdk)
- [Discord Community](https://discord.gg/AYGSqCkZTz)
- [Developer Hub](https://dev.primuslabs.xyz)