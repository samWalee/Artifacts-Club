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

contract ArtifactHouse {
    uint256 private artifactsLength = 0;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // fee to pay for visiting an artifact
    uint256 public visitFee = 1 ether;

    struct Artifact {
        address payable owner;
        string image;
        string name;
        string description;
        uint256 price;
        uint256 visitors;
        bool onSale;
        bool onDisplay;
    }

    mapping(uint256 => Artifact) private artifacts;
    // keeps of addresses that have booked a visit for an artifact
    mapping(uint256 => mapping(address => bool)) bookedVisit;
    // keeps track of artifact's id that exist
    mapping(uint256 => bool) exists;

    /// @dev modifier to check if artifact exist
    modifier exist(uint256 _index) {
        require(exists[_index], "Query of non existent artifact");
        _;
    }

    /// @dev modifier to check if caller is artifact owner
    modifier onlyArtifactOwner(uint256 _index) {
        require(
            msg.sender == artifacts[_index].owner,
            "Only owner can perform this operation"
        );
        _;
    }

    /// @dev modifier to check if caller is a valid customer
    modifier onlyValidCustomer(uint256 _index) {
        require(
            artifacts[_index].owner != msg.sender,
            "You can't buy your own artifact"
        );
        _;
    }

    /// @dev modifer to check if _price is valid
    modifier checkPrice(uint256 _price) {
        require(_price > 0, "Price needs to be at least one wei");
        _;
    }

    /// @dev modifier to check if image url is not an empty string
    modifier checkImageUrl(string calldata _image) {
        require(bytes(_image).length > 0, "Empty image url");
        _;
    }

    /// @dev adds an artifact on the platform
    function addArtifact(
        string calldata _image,
        string calldata _name,
        string calldata _description,
        uint256 _price
    ) external checkPrice(_price) checkImageUrl(_image) {
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_description).length > 0, "Empty description");
        artifacts[artifactsLength] = Artifact(
            payable(msg.sender),
            _image,
            _name,
            _description,
            _price,
            0, // number of visits
            true, // onSale initialised as true
            false // onDisplay initialised as false
        );
        exists[artifactsLength] = true;
        artifactsLength++;
    }

    /// @dev buys an artifact with _index
    function buyArtifact(uint256 _index)
        external
        payable
        exist(_index)
        onlyValidCustomer(_index)
    {
        address owner = artifacts[_index].owner;
        artifacts[_index].owner = payable(msg.sender);
        artifacts[_index].onSale = false;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                owner,
                artifacts[_index].price
            ),
            "Transfer failed."
        );
    }

    /// @dev toggles the onDisplay property for whether visits for artifact is allowed
    function toggleOnDisplay(uint256 _index)
        public
        exist(_index)
        onlyArtifactOwner(_index)
    {
        require(
            !artifacts[_index].onSale,
            "Artifacts on sale can't be displayed"
        );
        artifacts[_index].onDisplay = !artifacts[_index].onDisplay;
    }

    /// @dev toggles the onSale property of an artifact
    function toggleOnSale(uint256 _index)
        public
        exist(_index)
        onlyArtifactOwner(_index)
    {
        require(
            !artifacts[_index].onDisplay,
            "Artifacts on sale can't be displayed"
        );
        artifacts[_index].onSale = !artifacts[_index].onSale;
    }

    /// @dev books a visit for an artifact
    function bookVisit(uint256 _index)
        public
        exist(_index)
        onlyValidCustomer(_index)
    {
        require(artifacts[_index].onDisplay, "Artifact isn't on display");
        require(!bookedVisit[_index][msg.sender], "Already booked");
        artifacts[_index].visitors += 1;
        bookedVisit[_index][msg.sender] = true;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                artifacts[_index].owner,
                visitFee
            ),
            "Transfer failed."
        );
    }

    function getArtifact(uint256 _index)
        public
        view
        exist(_index)
        returns (Artifact memory)
    {
        return (artifacts[_index]);
    }

    function getartifactsLength() public view returns (uint256) {
        return (artifactsLength);
    }

    /// @dev changes the image url of an artifact
    function ReformArtifactImage(uint256 _index, string calldata _image)
        public
        exist(_index)
        onlyArtifactOwner(_index)
        checkImageUrl(_image)
    {
        artifacts[_index].image = _image;
    }

    /// @dev puts an artifact back on sale
    function reListArtifact(uint256 _index, uint256 _price)
        external
        exist(_index)
        onlyArtifactOwner(_index)
        checkPrice(_price)
    {
        artifacts[_index].onSale = true;
        artifacts[_index].price = _price;
        artifacts[_index].onDisplay = false;
    }
}
