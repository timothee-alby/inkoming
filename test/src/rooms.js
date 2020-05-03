const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Rooms', async function() {
  let user1
  before(async function() {
    const { users } = await fixture.setState({
      users: 1
    })
    user1 = users[0]
  })
  describe('creating', async function() {
    it('allow any user to create', async function() {
      const { response, json } = await fetch.post('/rooms', user1, {
        user_id: user1.id,
        name: 'Test room number 1'
      })
      expect(response.status).to.equal(201)
      expect(json.name).to.equal('Test room number 1')
    })

    it('cannot create with empty name', async function() {
      const { response, json } = await fetch.post('/rooms', user1, {
        user_id: user1.id,
        name: ''
      })
      expect(response.status).to.equal(400)
      expect(json.message).to.match(/name_min_length/)
    })
  })

  describe('listing', async function() {
    let user1, user2

    before(async function() {
      const { users } = await fixture.setState({
        users: 3,
        rooms: ([user1, user2, user3]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' },
          { as: user1, user_id: user1.id, name: 'Bar Name' },
          { as: user3, user_id: user3.id, name: 'Baz Name' }
        ],
        players: ([user1, user2], [room1, room2, room3]) => [
          {
            as: user1,
            room_id: room2.id,
            user_id: user1.id,
            nickname: 'user1'
          },
          {
            as: user2,
            room_id: room1.id,
            user_id: user2.id,
            nickname: 'user2'
          },
          {
            as: user2,
            room_id: room3.id,
            user_id: user2.id,
            nickname: 'user2'
          }
        ]
      })
      user1 = users[0]
      user2 = users[1]
    })

    it('can list created rooms', async function() {
      const { json } = await fetch.get('/rooms', user1)
      expect(json).to.be.ofSize(2)

      const [room1, room2] = json
      expect(room1.name).to.equal('Foo Name')
      expect(room2.name).to.equal('Bar Name')
    })

    it('can list playing rooms', async function() {
      const { json } = await fetch.get('/rooms', user2)
      expect(json).to.be.ofSize(2)

      const [room1, room2] = json
      expect(room1.name).to.equal('Foo Name')
      expect(room2.name).to.equal('Baz Name')
    })
  })
})
