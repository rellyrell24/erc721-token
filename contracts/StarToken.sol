// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract StarToken is ERC721 {

  struct Star {
    string name;
    string date;
  }

  mapping(uint256 => Star) public tokenIdToStarInfo;
  mapping(uint256 => uint256) public tokenIdToPrice;

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

  function createStar(string memory _name, string memory _date, uint256 _tokenId) public {
    Star memory newStar = Star(_name, _date);
    tokenIdToStarInfo[_tokenId] = newStar;
    _mint(msg.sender, _tokenId);
  }

  function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
    require(ownerOf(_tokenId) == msg.sender);
    tokenIdToPrice[_tokenId] = _price;
  }

  function _make_payable(address x) internal pure returns (address payable) {
    return payable(address(uint160(x)));
  }

  function buyStar(uint256 _tokenId) public payable {
    require(tokenIdToPrice[_tokenId] > 0, "The should be up for sale");
    uint256 starCost = tokenIdToPrice[_tokenId];
    address ownerAddress = ownerOf(_tokenId);
    require(msg.value > starCost, "You need to have enough ether");
    transferFrom(ownerAddress, msg.sender, _tokenId);
    address payable ownerAddressPayable = _make_payable(ownerAddress);
    ownerAddressPayable.transfer(starCost);
    if (msg.value > starCost) {
      address payable buyer = _make_payable(msg.sender);
      buyer.transfer(msg.value - starCost);
    }
  }

  function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
    address owner1 = ownerOf(_tokenId1);
    address owner2 = ownerOf(_tokenId2);
    require(msg.sender == owner1 || msg.sender == owner2);
    transferFrom(owner1, owner2, _tokenId1);
    transferFrom(owner2, owner1, _tokenId2);
  }

  function transferStar(address _to, uint256 _tokenId) public {
    require(msg.sender == ownerOf(_tokenId));
    transferFrom(msg.sender, _to, _tokenId);
  }

  function lookUpTokenIdToStarInfo(uint256 _tokenId) public view returns (string memory _name, string memory _date) {
    _name = tokenIdToStarInfo[_tokenId].name;
    _date = tokenIdToStarInfo[_tokenId].date;
  }
}
