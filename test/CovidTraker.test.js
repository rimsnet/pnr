const CovidTraker = artifacts.require('./CovidTraker.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CovidTraker', ([deployer, seller, buyer]) => {
  let covidtracker

  before(async () => {
    covidtracker = await CovidTraker.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await covidtracker.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await covidtracker.name()
      assert.equal(name, 'Dapp University CovidTraker')
    })
  })

  describe('patients', async () => {
    let result, patientCount

    before(async () => {
      result = await covidtracker.createPatient('iPhone X', web3.utils.toWei('1', 'Ether'), 'a', 'b', 'c', 'd', { from: seller })
      patientCount = await covidtracker.patientCount()
    })

    it('creates patients', async () => {
      // SUCCESS
      assert.equal(patientCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), patientCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.serviceCharge, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.isTested, false, 'isTested is correct')

      // FAILURE: Product must have a name
      await await covidtracker.createPatient('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
      // FAILURE: Product must have a price
      await await covidtracker.createPatient('iPhone X', 0, { from: seller }).should.be.rejected;
    })

    it('lists patients', async () => {
      const product = await covidtracker.patients(patientCount)
      assert.equal(product.id.toNumber(), patientCount.toNumber(), 'id is correct')
      assert.equal(product.name, 'iPhone X', 'name is correct')
      assert.equal(product.serviceCharge, '1000000000000000000', 'price is correct')
      assert.equal(product.owner, seller, 'owner is correct')
      assert.equal(product.isTested, false, 'isTested is correct')
    })

    it('sells products', async () => {
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // SUCCESS: Buyer makes purchase
      result = await covidtracker.purchasePatient(patientCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') })

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), patientCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.serviceCharge, '1000000000000000000', 'serviceCharge is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.isTested, true, 'isTested is correct')

      // Check that seller received funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let serviceCharge
      serviceCharge = web3.utils.toWei('1', 'Ether')
      serviceCharge = new web3.utils.BN(serviceCharge)

      const exepectedBalance = oldSellerBalance.add(serviceCharge)

      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

      // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
      await covidtracker.purchasePatient(99, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
      // FAILURE: Buyer tries to buy without enough ether
      await covidtracker.purchasePatient(patientCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
      await covidtracker.purchasePatient(patientCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
      await covidtracker.purchasePatient(patientCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })

  })
})
