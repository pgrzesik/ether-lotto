const RandomMock = artifacts.require('./RandomMock.sol');
const MicroLotto = artifacts.require('./MicroLotto.sol');
const {
  mineBlock,
  getBalance,
  getEventFromLogs,
  assertThrowsInvalidOpcode,
  assertNumberEqual,
  assertValueEqual,
  assertValueAlmostEqual
} = require('./Helpers.js');

const MAX_NUMBER = 10;

const TICKET_FEE = 0.1;
const TICKET_FEE_WEI = web3.toWei(TICKET_FEE, 'ether');

const LOTTO_FEE_PERCENT = 0.01;
const LOTTO_FEE_PERCENT_WEI = web3.toWei(LOTTO_FEE_PERCENT, 'ether');

const EXPECTED_PRIZE = TICKET_FEE_WEI - (LOTTO_FEE_PERCENT * TICKET_FEE_WEI);

contract(`MicroLotto with max number of ${MAX_NUMBER} and fee percent ${LOTTO_FEE_PERCENT}`, accounts => {
  const OWNER = accounts[0];
  const PLAYER = accounts[1];
  const EXPECTED_NUMBER = 1;

  let lotto;
  let initialBalance;

  beforeEach(async () => {
    const random = await RandomMock.new(EXPECTED_NUMBER, {
      from: OWNER
    });

    lotto = await MicroLotto.new(random.address, LOTTO_FEE_PERCENT_WEI, MAX_NUMBER, {
      from: OWNER,
    });

  });

  context(`Given filled ticket on number ${EXPECTED_NUMBER}`, () => {
    let fillTicketResult;

    beforeEach(async () => {
      fillTicketResult = await lotto.fillTicket(EXPECTED_NUMBER, {
        from: PLAYER,
        value: TICKET_FEE_WEI,
      });
    });

    it('Should emit TicketFilled event', async () => {
      const event = getEventFromLogs(fillTicketResult.logs, 'TicketFilled');
      assert.ok(event);
      assert.equal(event.args.account, PLAYER);
      assertNumberEqual(event.args.selectedNumber, EXPECTED_NUMBER);
    });

    it(`Should have prize equal to ${EXPECTED_PRIZE}`, async () => {
      const prize = await lotto.prize();
      assertNumberEqual(prize, EXPECTED_PRIZE);
    });

  });

});
