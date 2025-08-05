// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WelfareIncomeZK
 * @dev 公益慈善捐款合约
 * 支持创建捐款活动、接受捐款、自动分发资金等功能
 */
contract WelfareIncome {
  // 活动状态枚举
  enum CampaignStatus {
    Active, // 进行中
    Completed, // 已完成
    Cancelled, // 已取消
    Failed // 失败（未达到目标且时间过期）
  }

  // 活动类型枚举
  enum CampaignType {
    DisasterRelief, // 自然灾害救助
    PovertyAlleviation // 贫困救助
  }

  // 捐款活动结构体
  struct Campaign {
    uint256 id; // 活动ID
    string title; // 活动标题
    string description; // 活动描述
    address creator; // 创建者地址
    address payable beneficiary; // 受益人地址
    uint256 targetAmount; // 目标金额
    uint256 raisedAmount; // 已筹集金额
    uint256 deadline; // 截止时间
    CampaignType campaignType; // 活动类型
    CampaignStatus status; // 活动状态
    bool fundsWithdrawn; // 资金是否已提取
    mapping(address => uint256) donations; // 每个地址的捐款金额
  }

  // 状态变量
  mapping(uint256 => Campaign) public campaigns;
  uint256 public campaignCounter;
  address public owner;
  uint256 public platformFeePercentage = 2; // 平台手续费2%

  // 事件定义
  event CampaignCreated(
    uint256 indexed campaignId,
    address indexed creator,
    address indexed beneficiary,
    string title,
    uint256 targetAmount,
    uint256 deadline,
    CampaignType campaignType
  );

  event DonationMade(
    uint256 indexed campaignId,
    address indexed donor,
    uint256 amount,
    uint256 totalRaised
  );

  event FundsWithdrawn(
    uint256 indexed campaignId,
    address indexed beneficiary,
    uint256 amount,
    uint256 platformFee
  );

  event CampaignStatusChanged(
    uint256 indexed campaignId,
    CampaignStatus oldStatus,
    CampaignStatus newStatus
  );

  event RefundMade(
    uint256 indexed campaignId,
    address indexed donor,
    uint256 amount
  );

  // 修饰符
  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can call this function');
    _;
  }

  modifier campaignExists(uint256 _campaignId) {
    require(
      _campaignId > 0 && _campaignId <= campaignCounter,
      'Campaign does not exist'
    );
    _;
  }

  modifier onlyCreator(uint256 _campaignId) {
    require(
      msg.sender == campaigns[_campaignId].creator,
      'Only campaign creator can call this function'
    );
    _;
  }

  // 构造函数
  constructor() {
    owner = msg.sender;
    campaignCounter = 0;
  }

  /**
   * @dev 创建新的捐款活动
   * @param _title 活动标题
   * @param _description 活动描述
   * @param _beneficiary 受益人地址
   * @param _targetAmount 目标金额（wei）
   * @param _durationInDays 活动持续天数
   * @param _campaignType 活动类型
   */
  function createCampaign(
    string memory _title,
    string memory _description,
    address payable _beneficiary,
    uint256 _targetAmount,
    uint256 _durationInDays,
    CampaignType _campaignType
  ) external returns (uint256) {
    require(bytes(_title).length > 0, 'Title cannot be empty');
    require(bytes(_description).length > 0, 'Description cannot be empty');
    require(_beneficiary != address(0), 'Invalid beneficiary address');
    require(_targetAmount > 0, 'Target amount must be greater than 0');
    require(_durationInDays > 0, 'Duration must be greater than 0');

    campaignCounter++;
    uint256 deadline = block.timestamp + (_durationInDays * 1 days);

    Campaign storage newCampaign = campaigns[campaignCounter];
    newCampaign.id = campaignCounter;
    newCampaign.title = _title;
    newCampaign.description = _description;
    newCampaign.creator = msg.sender;
    newCampaign.beneficiary = _beneficiary;
    newCampaign.targetAmount = _targetAmount;
    newCampaign.raisedAmount = 0;
    newCampaign.deadline = deadline;
    newCampaign.campaignType = _campaignType;
    newCampaign.status = CampaignStatus.Active;
    newCampaign.fundsWithdrawn = false;

    emit CampaignCreated(
      campaignCounter,
      msg.sender,
      _beneficiary,
      _title,
      _targetAmount,
      deadline,
      _campaignType
    );

    return campaignCounter;
  }

  /**
   * @dev 向指定活动捐款
   * @param _campaignId 活动ID
   */
  function donate(
    uint256 _campaignId
  ) external payable campaignExists(_campaignId) {
    require(msg.value > 0, 'Donation amount must be greater than 0');

    Campaign storage campaign = campaigns[_campaignId];
    require(campaign.status == CampaignStatus.Active, 'Campaign is not active');
    require(block.timestamp <= campaign.deadline, 'Campaign has expired');

    campaign.donations[msg.sender] += msg.value;
    campaign.raisedAmount += msg.value;

    emit DonationMade(
      _campaignId,
      msg.sender,
      msg.value,
      campaign.raisedAmount
    );

    // 检查是否达到目标金额
    if (campaign.raisedAmount >= campaign.targetAmount) {
      _updateCampaignStatus(_campaignId, CampaignStatus.Completed);
    }
  }

  /**
   * @dev 提取活动资金（只有受益人可以调用）
   * @param _campaignId 活动ID
   */
  function withdrawFunds(
    uint256 _campaignId
  ) external campaignExists(_campaignId) {
    Campaign storage campaign = campaigns[_campaignId];
    require(
      msg.sender == campaign.beneficiary,
      'Only beneficiary can withdraw funds'
    );
    require(!campaign.fundsWithdrawn, 'Funds already withdrawn');
    require(
      campaign.status == CampaignStatus.Completed ||
        (block.timestamp > campaign.deadline && campaign.raisedAmount > 0),
      'Cannot withdraw funds yet'
    );

    // 如果时间过期但未达到目标，更新状态
    if (
      block.timestamp > campaign.deadline &&
      campaign.status == CampaignStatus.Active
    ) {
      if (campaign.raisedAmount >= campaign.targetAmount) {
        _updateCampaignStatus(_campaignId, CampaignStatus.Completed);
      } else {
        _updateCampaignStatus(_campaignId, CampaignStatus.Failed);
        revert('Campaign failed to reach target amount');
      }
    }

    campaign.fundsWithdrawn = true;

    uint256 totalAmount = campaign.raisedAmount;
    uint256 platformFee = (totalAmount * platformFeePercentage) / 100;
    uint256 beneficiaryAmount = totalAmount - platformFee;

    // 转账给受益人
    campaign.beneficiary.transfer(beneficiaryAmount);

    // 转账平台手续费给合约拥有者
    if (platformFee > 0) {
      payable(owner).transfer(platformFee);
    }

    emit FundsWithdrawn(
      _campaignId,
      campaign.beneficiary,
      beneficiaryAmount,
      platformFee
    );
  }

  /**
   * @dev 申请退款（活动失败时）
   * @param _campaignId 活动ID
   */
  function requestRefund(
    uint256 _campaignId
  ) external campaignExists(_campaignId) {
    Campaign storage campaign = campaigns[_campaignId];
    require(
      campaign.status == CampaignStatus.Failed ||
        campaign.status == CampaignStatus.Cancelled ||
        (block.timestamp > campaign.deadline &&
          campaign.raisedAmount < campaign.targetAmount),
      'Refund not available'
    );

    uint256 donatedAmount = campaign.donations[msg.sender];
    require(donatedAmount > 0, 'No donation found');

    campaign.donations[msg.sender] = 0;
    campaign.raisedAmount -= donatedAmount;

    payable(msg.sender).transfer(donatedAmount);

    emit RefundMade(_campaignId, msg.sender, donatedAmount);
  }

  /**
   * @dev 取消活动（只有创建者可以调用）
   * @param _campaignId 活动ID
   */
  function cancelCampaign(
    uint256 _campaignId
  ) external campaignExists(_campaignId) onlyCreator(_campaignId) {
    Campaign storage campaign = campaigns[_campaignId];
    require(campaign.status == CampaignStatus.Active, 'Campaign is not active');
    require(!campaign.fundsWithdrawn, 'Funds already withdrawn');

    _updateCampaignStatus(_campaignId, CampaignStatus.Cancelled);
  }

  /**
   * @dev 获取活动基本信息
   * @param _campaignId 活动ID
   */
  function getCampaignInfo(
    uint256 _campaignId
  )
    external
    view
    campaignExists(_campaignId)
    returns (
      string memory title,
      string memory description,
      address creator,
      address beneficiary,
      uint256 targetAmount,
      uint256 raisedAmount,
      uint256 deadline,
      CampaignType campaignType,
      CampaignStatus status,
      bool fundsWithdrawn
    )
  {
    Campaign storage campaign = campaigns[_campaignId];
    return (
      campaign.title,
      campaign.description,
      campaign.creator,
      campaign.beneficiary,
      campaign.targetAmount,
      campaign.raisedAmount,
      campaign.deadline,
      campaign.campaignType,
      campaign.status,
      campaign.fundsWithdrawn
    );
  }

  /**
   * @dev 获取用户在特定活动中的捐款金额
   * @param _campaignId 活动ID
   * @param _donor 捐款人地址
   */
  function getDonationAmount(
    uint256 _campaignId,
    address _donor
  ) external view campaignExists(_campaignId) returns (uint256) {
    return campaigns[_campaignId].donations[_donor];
  }

  /**
   * @dev 检查活动是否已过期并更新状态
   * @param _campaignId 活动ID
   */
  function checkAndUpdateCampaignStatus(
    uint256 _campaignId
  ) external campaignExists(_campaignId) {
    Campaign storage campaign = campaigns[_campaignId];

    if (
      campaign.status == CampaignStatus.Active &&
      block.timestamp > campaign.deadline
    ) {
      if (campaign.raisedAmount >= campaign.targetAmount) {
        _updateCampaignStatus(_campaignId, CampaignStatus.Completed);
      } else {
        _updateCampaignStatus(_campaignId, CampaignStatus.Failed);
      }
    }
  }

  /**
   * @dev 更新平台手续费比例（只有合约拥有者可以调用）
   * @param _newFeePercentage 新的手续费比例
   */
  function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
    require(_newFeePercentage <= 5, 'Platform fee cannot exceed 5%');
    platformFeePercentage = _newFeePercentage;
  }

  /**
   * @dev 获取所有活动数量
   */
  function getTotalCampaigns() external view returns (uint256) {
    return campaignCounter;
  }

  /**
   * @dev 内部函数：更新活动状态
   * @param _campaignId 活动ID
   * @param _newStatus 新状态
   */
  function _updateCampaignStatus(
    uint256 _campaignId,
    CampaignStatus _newStatus
  ) internal {
    CampaignStatus oldStatus = campaigns[_campaignId].status;
    campaigns[_campaignId].status = _newStatus;
    emit CampaignStatusChanged(_campaignId, oldStatus, _newStatus);
  }

  /**
   * @dev 紧急情况下转移合约拥有权
   * @param _newOwner 新拥有者地址
   */
  function transferOwnership(address _newOwner) external onlyOwner {
    require(_newOwner != address(0), 'Invalid new owner address');
    owner = _newOwner;
  }

  /**
   * @dev 获取合约余额
   */
  function getContractBalance() external view returns (uint256) {
    return address(this).balance;
  }
}
