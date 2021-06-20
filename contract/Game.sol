contract Game {
    uint256 public constant TICKET_PRICE = 1e16;

    mapping(address => uint256) public winners;
    address public owner;
    uint256 public prize = 0;
    mapping(address => uint8) public commitments;
    address[] public players;
    uint8 maximum = 5;
    uint8 public winnerNumber;
    address[] private localWinners;

    uint256 public ticketDeadline;
    uint256 public revealDeadline;
    uint16 public revealDuration = 1 minutes;
    uint16 public duration = 5 minutes;

    constructor() public {
        owner = msg.sender;
        ticketDeadline = block.timestamp + duration;
        revealDeadline = ticketDeadline + revealDuration;
    }

    function join(uint8 number) public payable {
        require(number <= maximum);
        require(msg.value == TICKET_PRICE);
        require(block.timestamp < ticketDeadline);
        commitments[msg.sender] == number;
        players.push(msg.sender);
        prize += TICKET_PRICE;
    }

    function revealNumber() public {
        require(
            block.timestamp >= revealDeadline,
            "You need to wait for reveal deadline"
        );
        if (prize == 0) {
            ticketDeadline = block.timestamp + duration;
            revealDeadline = ticketDeadline + revealDuration;
        } else {
            bytes32 random =
                keccak256(abi.encodePacked(blockhash(block.number - 1)));
            uint256 finalNumber = uint256(random) % maximum;
            for (uint256 i = 0; i < players.length; i++) {
                if (commitments[players[i]] == finalNumber) {
                    localWinners.push(players[i]);
                    delete commitments[players[i]];
                }
            }
            if (localWinners.length == 0) {
                ticketDeadline = block.timestamp + duration;
                revealDeadline = ticketDeadline + revealDuration;
                winnerNumber = uint8(finalNumber);
                delete players;
            } else {
                uint256 singlePrize = prize / localWinners.length;
                for (uint256 i = 0; i < localWinners.length; i++) {
                    winners[localWinners[i]] += singlePrize;
                }
                winnerNumber = uint8(finalNumber);
                ticketDeadline = block.timestamp + duration;
                revealDeadline = ticketDeadline + revealDuration;
            }
        }
    }

    function withdraw() public {
        require(winners[msg.sender] > 0);
        payable(msg.sender).transfer(winners[msg.sender]);
    }
}
