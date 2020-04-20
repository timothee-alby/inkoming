const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Rooms', async function() {
  const user1Id = uuidv4()

  before(async function() {
    return fixture.clearState()
  })

  it('post', async function() {
    let result = await fetch.post('/rooms', user1Id, {
      name: 'Test room number 1'
    })
    expect(result.response.status).to.equal(201)

    result = await fetch.post('/rooms', user1Id, {
      name: 'Test room number 2'
    })
    expect(result.response.status).to.equal(201)
  })

  it('get', async function() {
    const { json } = await fetch.get('/rooms', user1Id)
    expect(json).to.be.ofSize(2)

    const room = json[0]
    expect(room.name).to.equal('Test room number 1')
  })
})
