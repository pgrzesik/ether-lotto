pragma solidity ^0.4.15;


contract Random {
    function generate(uint blockNumber, uint maxNumber) public constant returns (uint);
}


contract MicroLotto {
    struct Ticket {
        address account;
    }

    Random public random;
    uint public ticketFee;
    uint public lottoFeePercent;
    uint public accumulatedValue;
    uint public maxNumber;
    uint public lastBlock;
    mapping(uint => Ticket[]) public ticketsPerNumber;

    event TicketFilled(address indexed account, uint selectedNumber);
    event Won(address indexed account, uint selectedNumber, uint profit);
    event Cumulation(uint drawnNumber, uint value);

    modifier updatesBlock() {
        _;
        lastBlock = block.number;
    }

    function MicroLotto(
        Random _random,
        uint _ticketFee,
        uint _lottoFeePercent,
        uint _maxNumber
    )
        updatesBlock
    {
        require(_maxNumber >= 2);

        random = _random;
        ticketFee = _ticketFee;
        lottoFeePercent = _lottoFeePercent;
        maxNumber = _maxNumber;
    }

    function fillTicket(uint selectedNumber) public payable updatesBlock {
        require(selectedNumber >= 1 && selectedNumber <= maxNumber);
        require(msg.value == ticketFee);

        // TODO: Implement me

        TicketFilled(msg.sender, selectedNumber);
    }

    function draw() public updatesBlock {
        require(block.number > lastBlock + 1);

        // TODO: Implement me
    }

    function prize() public constant returns (uint) {
        // TODO: Implement me
    }
}
