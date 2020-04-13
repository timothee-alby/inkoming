const { expect } = require('chai')
const fetch = require('./helpers/fetch')

describe('Unroll', async function() {
  // const user0Id = '00000000-0000-0000-0000-000000000000'
  const user1Id = '10000000-0000-0000-0000-000000000000'
  const user2Id = '20000000-0000-0000-0000-000000000000'
  let roomId

  describe('Rooms', async function() {
    it('empty on start', async function() {
      const json = await fetch.get('/rooms', user1Id)
      expect(json).to.be.ofSize(0)
    })

    it('post', async function() {
      const response = await fetch.post('/rooms', user1Id, {
        name: 'Test room number 1'
      })
      expect(response.status).to.equal(201)
    })

    it('get', async function() {
      const json = await fetch.get('/rooms', user1Id)
      expect(json).to.be.ofSize(1)

      const room = json[0]
      expect(room.name).to.equal('Test room number 1')
      roomId = room.id
    })
  })

  describe('Players', async function() {
    it('cannot join without room id', async function() {
      const response = await fetch.post('/players', user1Id, {
        room_id: '9d89f9f7-2caf-40b9-bb99-112bc4170dfb',
        user_id: user1Id
      })
      expect(response.status).to.equal(409)
    })

    it('cannot join without user id', async function() {
      const response = await fetch.post('/players', user1Id, {
        room_id: roomId
      })
      expect(response.status).to.equal(403)
    })

    it('can join', async function() {
      let response = await fetch.post('/players', user1Id, {
        room_id: roomId,
        user_id: user1Id
      })
      expect(response.status).to.equal(201)

      response = await fetch.post('/players', user2Id, {
        room_id: roomId,
        user_id: user2Id
      })
      expect(response.status).to.equal(201)
    })

    it('cannot fake their user id', async function() {
      const response = await fetch.post('/players', user1Id, {
        room_id: roomId,
        user_id: user2Id
      })
      expect(response.status).to.equal(403)
    })

    it('cannot join a room twice', async function() {
      const response = await fetch.post('/players', user1Id, {
        room_id: roomId,
        user_id: user1Id
      })
      expect(response.status).to.not.equal(201)
    })

    it('can only list themselves', async function() {
      const json = await fetch.get('/players', user1Id)
      expect(json).to.be.ofSize(1)
    })
  })
})
