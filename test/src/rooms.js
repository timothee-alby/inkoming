const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Rooms', async function() {
  describe('creating', async function() {
    it('allow any user to create', async function() {
      const userId = uuidv4()
      const { response, json } = await fetch.post('/rooms', userId, {
        user_id: userId,
        name: 'Test room number 1'
      })
      expect(response.status).to.equal(201)
      expect(json.name).to.equal('Test room number 1')
    })

    it('cannot create with empty name', async function() {
      const userId = uuidv4()
      const { response, json } = await fetch.post('/rooms', userId, {
        user_id: userId,
        name: ''
      })
      expect(response.status).to.equal(400)
      expect(json.message).to.match(/name_min_length/)
    })
  })

  describe('listing', async function() {
    const user1Id = uuidv4()
    const user2Id = uuidv4()

    before(async function() {
      const user0Id = uuidv4()
      await fixture.setState({
        rooms: [
          { as: user1Id, user_id: user1Id, name: 'Foo Name' },
          { as: user1Id, user_id: user1Id, name: 'Bar Name' },
          { as: user0Id, user_id: user0Id, name: 'Baz Name' }
        ],
        players: ([room1, room2, room3]) => [
          {
            as: user1Id,
            room_id: room2.id,
            user_id: user1Id,
            nickname: 'user1'
          },
          {
            as: user2Id,
            room_id: room1.id,
            user_id: user2Id,
            nickname: 'user2'
          },
          {
            as: user2Id,
            room_id: room3.id,
            user_id: user2Id,
            nickname: 'user2'
          }
        ]
      })
    })

    it('can list created rooms', async function() {
      const { json } = await fetch.get('/rooms', user1Id)
      expect(json).to.be.ofSize(2)

      const [room1, room2] = json
      expect(room1.name).to.equal('Foo Name')
      expect(room2.name).to.equal('Bar Name')
    })

    it('can list playing rooms', async function() {
      const { json } = await fetch.get('/rooms', user2Id)
      expect(json).to.be.ofSize(2)

      const [room1, room2] = json
      expect(room1.name).to.equal('Foo Name')
      expect(room2.name).to.equal('Baz Name')
    })
  })
})
