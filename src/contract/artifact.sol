 // SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
 


interface IERC20Token {
   function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
 
 contract  ArtifactHouse {
     
    uint internal artifactsLength = 0;
    address internal cUsdTokenAddress =     0x686c626E48bfC5DC98a30a9992897766fed4Abd3;

    struct  Artifact {
        address payable owner;
        string image;
        string name;
        string description;
         uint price;
          bool forSale; 
      
    }

       mapping (uint =>  Artifact) internal artifacts;
        modifier onlyOwner(uint _index){
      require(msg.sender == artifacts[_index].owner, "Only the owner can access this funciton" );
      _;
    }

       
     function addArtifact (
        string memory _image,
        string memory _name,
        string memory _description,
        uint _price

          ) public {
       Artifact storage artifactt = artifacts[artifactsLength];

        artifactt.owner = payable(msg.sender);
           artifactt.image = _image;
            artifactt.name = _name;
            artifactt.description = _description;
           artifactt.price = _price;

          
        artifactsLength++;
          }

                
      function buyArtifact(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            artifacts[_index].owner,
            artifacts[_index].price
          ),
          "Transfer failed."
        );

         artifacts[_index].owner = payable(msg.sender);
         
    }

  function getArtifact(uint _index) public view returns (
        address payable,
        string memory,  
        string memory,  
        string memory,
        uint
        
      
    ) {

      return (  
            artifacts[_index].owner,
            artifacts[_index].image,
             artifacts[_index].name,
             artifacts[_index].description,
            artifacts[_index].price

                          
        );
    }

 //Function using which the owner can change the price of the artifact
    function changePrice(uint _index, uint _price) public onlyOwner(_index){
      artifacts[_index].price = _price;
    }

    //Function to set the artifact for sale or not for sale depending on the current state
    function toggleForSale(uint _index) public onlyOwner(_index){
      artifacts[_index].forSale = !artifacts[_index].forSale;
    
}
    
 function getartifactsLength() public view returns (uint) {
        return (artifactsLength);
    }

    
    function ReformArtifactImage(uint _index, string memory _image) public {
        require(msg.sender == artifacts[_index].owner, "Only creator can perform this operation");
        artifacts[_index].image = _image;
    }

    
 }


    