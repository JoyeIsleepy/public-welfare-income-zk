// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import '../src/welfare-income-zk.sol';

contract WelfareIncomeTest is Test {
  WelfareIncome public welfareIncome;

  // Receive ETH function (for platform fees)
  receive() external payable {}

  // Test accounts
  address public owner;
  address public creator;
  address public beneficiary;
  address public donor1;
  address public donor2;
  address public newOwner;

  // Test constants
  uint256 public constant TARGET_AMOUNT = 10 ether;
  uint256 public constant DURATION_DAYS = 30;
  string public constant CAMPAIGN_TITLE = 'Test Relief Campaign';
  string public constant CAMPAIGN_DESCRIPTION =
    'This is a test relief campaign';

  function setUp() public {
    // Setup test accounts
    owner = address(this);
    creator = vm.addr(1);
    beneficiary = vm.addr(2);
    donor1 = vm.addr(3);
    donor2 = vm.addr(4);
    newOwner = vm.addr(5);

    // Deploy contract
    welfareIncome = new WelfareIncome();

    // Give test accounts some ETH
    vm.deal(creator, 100 ether);
    vm.deal(donor1, 100 ether);
    vm.deal(donor2, 100 ether);
    vm.deal(beneficiary, 1 ether);
  }

  // ============ Contract Deployment Tests ============

  function testDeployment() public {
    assertEq(welfareIncome.owner(), owner);
    assertEq(welfareIncome.campaignCounter(), 0);
    assertEq(welfareIncome.platformFeePercentage(), 2);
  }

  // ============ Campaign Creation Tests ============

  function testCreateCampaign() public {
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    assertEq(campaignId, 1);
    assertEq(welfareIncome.campaignCounter(), 1);

    // 验证活动信息
    (
      string memory title,
      string memory description,
      address campaignCreator,
      address campaignBeneficiary,
      uint256 targetAmount,
      uint256 raisedAmount,
      uint256 deadline,
      WelfareIncome.CampaignType campaignType,
      WelfareIncome.CampaignStatus status,
      bool fundsWithdrawn
    ) = welfareIncome.getCampaignInfo(campaignId);

    assertEq(title, CAMPAIGN_TITLE);
    assertEq(description, CAMPAIGN_DESCRIPTION);
    assertEq(campaignCreator, creator);
    assertEq(campaignBeneficiary, beneficiary);
    assertEq(targetAmount, TARGET_AMOUNT);
    assertEq(raisedAmount, 0);
    assertEq(
      uint(campaignType),
      uint(WelfareIncome.CampaignType.DisasterRelief)
    );
    assertEq(uint(status), uint(WelfareIncome.CampaignStatus.Active));
    assertEq(fundsWithdrawn, false);
    assertTrue(deadline > block.timestamp);
  }

  function testCreateCampaignEmptyTitle() public {
    vm.prank(creator);
    vm.expectRevert('Title cannot be empty');
    welfareIncome.createCampaign(
      '',
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );
  }

  function testCreateCampaignEmptyDescription() public {
    vm.prank(creator);
    vm.expectRevert('Description cannot be empty');
    welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      '',
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );
  }

  function testCreateCampaignInvalidBeneficiary() public {
    vm.prank(creator);
    vm.expectRevert('Invalid beneficiary address');
    welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(address(0)),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );
  }

  function testCreateCampaignZeroTargetAmount() public {
    vm.prank(creator);
    vm.expectRevert('Target amount must be greater than 0');
    welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      0,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );
  }

  function testCreateCampaignZeroDuration() public {
    vm.prank(creator);
    vm.expectRevert('Duration must be greater than 0');
    welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      0,
      WelfareIncome.CampaignType.DisasterRelief
    );
  }

  // ============ Donation Tests ============

  function testDonate() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate
    uint256 donationAmount = 2 ether;
    vm.prank(donor1);
    welfareIncome.donate{ value: donationAmount }(campaignId);

    // 验证捐款信息
    (, , , , , uint256 raisedAmount, , , , ) = welfareIncome.getCampaignInfo(
      campaignId
    );
    assertEq(raisedAmount, donationAmount);
    assertEq(
      welfareIncome.getDonationAmount(campaignId, donor1),
      donationAmount
    );
  }

  function testDonateMultiple() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 多次捐款
    uint256 donation1 = 2 ether;
    uint256 donation2 = 3 ether;

    vm.prank(donor1);
    welfareIncome.donate{ value: donation1 }(campaignId);

    vm.prank(donor1);
    welfareIncome.donate{ value: donation2 }(campaignId);

    // 验证累计捐款
    (, , , , , uint256 raisedAmount, , , , ) = welfareIncome.getCampaignInfo(
      campaignId
    );
    assertEq(raisedAmount, donation1 + donation2);
    assertEq(
      welfareIncome.getDonationAmount(campaignId, donor1),
      donation1 + donation2
    );
  }

  function testDonateCompleteCampaign() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate达到目标金额
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // 验证活动状态变为已完成
    (, , , , , , , , WelfareIncome.CampaignStatus status, ) = welfareIncome
      .getCampaignInfo(campaignId);
    assertEq(uint(status), uint(WelfareIncome.CampaignStatus.Completed));
  }

  function testDonateZeroAmount() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 尝试零金额捐款
    vm.prank(donor1);
    vm.expectRevert('Donation amount must be greater than 0');
    welfareIncome.donate{ value: 0 }(campaignId);
  }

  function testDonateExpiredCampaign() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 时间推进到截止日期之后
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // 尝试向过期活动捐款
    vm.prank(donor1);
    vm.expectRevert('Campaign has expired');
    welfareIncome.donate{ value: 1 ether }(campaignId);
  }

  function testDonateNonexistentCampaign() public {
    vm.prank(donor1);
    vm.expectRevert('Campaign does not exist');
    welfareIncome.donate{ value: 1 ether }(999);
  }

  // ============ Fund Withdrawal Tests ============

  function testWithdrawFunds() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate达到目标
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // 记录提取前的余额
    uint256 beneficiaryBalanceBefore = beneficiary.balance;
    uint256 ownerBalanceBefore = owner.balance;

    // 受益人提取资金
    vm.prank(beneficiary);
    welfareIncome.withdrawFunds(campaignId);

    // 验证提取结果
    uint256 platformFee = (TARGET_AMOUNT * 2) / 100; // 2%手续费
    uint256 beneficiaryAmount = TARGET_AMOUNT - platformFee;

    assertEq(beneficiary.balance, beneficiaryBalanceBefore + beneficiaryAmount);
    assertEq(owner.balance, ownerBalanceBefore + platformFee);

    // 验证活动状态
    (, , , , , , , , , bool fundsWithdrawn) = welfareIncome.getCampaignInfo(
      campaignId
    );
    assertTrue(fundsWithdrawn);
  }

  function testWithdrawFundsNotBeneficiary() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate达到目标
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // 非受益人尝试提取资金
    vm.prank(donor1);
    vm.expectRevert('Only beneficiary can withdraw funds');
    welfareIncome.withdrawFunds(campaignId);
  }

  function testWithdrawFundsAlreadyWithdrawn() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate达到目标
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // 第一次提取
    vm.prank(beneficiary);
    welfareIncome.withdrawFunds(campaignId);

    // 尝试第二次提取
    vm.prank(beneficiary);
    vm.expectRevert('Funds already withdrawn');
    welfareIncome.withdrawFunds(campaignId);
  }

  function testWithdrawFundsAfterDeadlineFailure() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Partial donation (below target)
    vm.prank(donor1);
    welfareIncome.donate{ value: 5 ether }(campaignId);

    // Fast forward past deadline
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // Beneficiary tries to withdraw funds - should fail because target not reached
    vm.prank(beneficiary);
    vm.expectRevert('Campaign failed to reach target amount');
    welfareIncome.withdrawFunds(campaignId);
  }

  function testWithdrawFundsAfterDeadlineSuccess() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donation that reaches target
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // Fast forward past deadline
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // Record balances before withdrawal
    uint256 beneficiaryBalanceBefore = beneficiary.balance;
    uint256 ownerBalanceBefore = address(this).balance;

    // Beneficiary withdraws funds successfully
    vm.prank(beneficiary);
    welfareIncome.withdrawFunds(campaignId);

    // Verify withdrawal
    uint256 platformFee = (TARGET_AMOUNT * 2) / 100;
    uint256 beneficiaryAmount = TARGET_AMOUNT - platformFee;

    assertEq(beneficiary.balance, beneficiaryBalanceBefore + beneficiaryAmount);
    assertEq(address(this).balance, ownerBalanceBefore + platformFee);

    // Verify funds withdrawn flag
    (, , , , , , , , , bool fundsWithdrawn) = welfareIncome.getCampaignInfo(
      campaignId
    );
    assertTrue(fundsWithdrawn);
  }

  // ============ Refund Tests ============

  function testRequestRefund() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 部分捐款
    uint256 donationAmount = 3 ether;
    vm.prank(donor1);
    welfareIncome.donate{ value: donationAmount }(campaignId);

    // 时间推进到截止日期之后（活动失败）
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // 记录退款前余额
    uint256 balanceBefore = donor1.balance;

    // 申请退款
    vm.prank(donor1);
    welfareIncome.requestRefund(campaignId);

    // 验证退款
    assertEq(donor1.balance, balanceBefore + donationAmount);
    assertEq(welfareIncome.getDonationAmount(campaignId, donor1), 0);
  }

  function testRequestRefundNoDonation() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 时间推进到截止日期之后
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // 尝试申请退款（没有捐款）
    vm.prank(donor1);
    vm.expectRevert('No donation found');
    welfareIncome.requestRefund(campaignId);
  }

  function testRequestRefundActiveCampaign() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate
    vm.prank(donor1);
    welfareIncome.donate{ value: 2 ether }(campaignId);

    // 尝试在活动仍活跃时申请退款
    vm.prank(donor1);
    vm.expectRevert('Refund not available');
    welfareIncome.requestRefund(campaignId);
  }

  // ============ Campaign Cancellation Tests ============

  function testCancelCampaign() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 取消活动
    vm.prank(creator);
    welfareIncome.cancelCampaign(campaignId);

    // 验证活动状态
    (, , , , , , , , WelfareIncome.CampaignStatus status, ) = welfareIncome
      .getCampaignInfo(campaignId);
    assertEq(uint(status), uint(WelfareIncome.CampaignStatus.Cancelled));
  }

  function testCancelCampaignNotCreator() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 非创建者尝试取消活动
    vm.prank(donor1);
    vm.expectRevert('Only campaign creator can call this function');
    welfareIncome.cancelCampaign(campaignId);
  }

  function testCancelCompletedCampaign() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // Donate完成活动
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // 尝试取消已完成的活动
    vm.prank(creator);
    vm.expectRevert('Campaign is not active');
    welfareIncome.cancelCampaign(campaignId);
  }

  // ============ Permission and Management Tests ============

  function testUpdatePlatformFee() public {
    uint256 newFee = 3;
    welfareIncome.updatePlatformFee(newFee);
    assertEq(welfareIncome.platformFeePercentage(), newFee);
  }

  function testUpdatePlatformFeeNotOwner() public {
    vm.prank(creator);
    vm.expectRevert('Only owner can call this function');
    welfareIncome.updatePlatformFee(3);
  }

  function testUpdatePlatformFeeExceedsLimit() public {
    vm.expectRevert('Platform fee cannot exceed 5%');
    welfareIncome.updatePlatformFee(6);
  }

  function testTransferOwnership() public {
    welfareIncome.transferOwnership(newOwner);
    assertEq(welfareIncome.owner(), newOwner);
  }

  function testTransferOwnershipNotOwner() public {
    vm.prank(creator);
    vm.expectRevert('Only owner can call this function');
    welfareIncome.transferOwnership(newOwner);
  }

  function testTransferOwnershipInvalidAddress() public {
    vm.expectRevert('Invalid new owner address');
    welfareIncome.transferOwnership(address(0));
  }

  // ============ Status Update Tests ============

  function testCheckAndUpdateCampaignStatus() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 部分捐款
    vm.prank(donor1);
    welfareIncome.donate{ value: 5 ether }(campaignId);

    // 时间推进到截止日期之后
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // 检查并更新状态
    welfareIncome.checkAndUpdateCampaignStatus(campaignId);

    // 验证状态变为失败
    (, , , , , , , , WelfareIncome.CampaignStatus status, ) = welfareIncome
      .getCampaignInfo(campaignId);
    assertEq(uint(status), uint(WelfareIncome.CampaignStatus.Failed));
  }

  function testCheckAndUpdateCampaignStatusCompleted() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    // 达到目标金额的捐款
    vm.prank(donor1);
    welfareIncome.donate{ value: TARGET_AMOUNT }(campaignId);

    // 时间推进到截止日期之后
    vm.warp(block.timestamp + DURATION_DAYS * 1 days + 1);

    // 检查并更新状态
    welfareIncome.checkAndUpdateCampaignStatus(campaignId);

    // 验证状态保持为已完成
    (, , , , , , , , WelfareIncome.CampaignStatus status, ) = welfareIncome
      .getCampaignInfo(campaignId);
    assertEq(uint(status), uint(WelfareIncome.CampaignStatus.Completed));
  }

  // ============ Utility Function Tests ============

  function testGetTotalCampaigns() public {
    assertEq(welfareIncome.getTotalCampaigns(), 0);

    // 创建几个活动
    vm.startPrank(creator);
    welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    welfareIncome.createCampaign(
      'Second Campaign',
      'Second campaign description',
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.PovertyAlleviation
    );
    vm.stopPrank();

    assertEq(welfareIncome.getTotalCampaigns(), 2);
  }

  function testGetContractBalance() public {
    // Create campaign并捐款
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    vm.prank(donor1);
    welfareIncome.donate{ value: 5 ether }(campaignId);

    assertEq(welfareIncome.getContractBalance(), 5 ether);
  }

  // ============ Event Tests ============

  function testCampaignCreatedEvent() public {
    vm.expectEmit(true, true, true, true);
    emit WelfareIncome.CampaignCreated(
      1,
      creator,
      beneficiary,
      CAMPAIGN_TITLE,
      TARGET_AMOUNT,
      block.timestamp + DURATION_DAYS * 1 days,
      WelfareIncome.CampaignType.DisasterRelief
    );

    vm.prank(creator);
    welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );
  }

  function testDonationMadeEvent() public {
    // Create campaign
    vm.prank(creator);
    uint256 campaignId = welfareIncome.createCampaign(
      CAMPAIGN_TITLE,
      CAMPAIGN_DESCRIPTION,
      payable(beneficiary),
      TARGET_AMOUNT,
      DURATION_DAYS,
      WelfareIncome.CampaignType.DisasterRelief
    );

    uint256 donationAmount = 2 ether;
    vm.expectEmit(true, true, false, true);
    emit WelfareIncome.DonationMade(
      campaignId,
      donor1,
      donationAmount,
      donationAmount
    );

    vm.prank(donor1);
    welfareIncome.donate{ value: donationAmount }(campaignId);
  }
}
