const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Cards', async function() {
  let user1, user2, player1Id, player2Id

  before(async function() {
    const { users, players } = await fixture.setState({
      users: 2,
      rooms: ([user1]) => [{ as: user1, user_id: user1.id, name: 'Foo Name' }],
      players: ([user1, user2], [room]) => [
        { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
      ],
      turns: ([user1, user2], [player1]) => [
        { as: user1, player_id: player1.id, card: 'black' }
      ]
    })
    user1 = users[0]
    user2 = users[1]
    player1Id = players[0].id
    player2Id = players[1].id
  })

  it('cannot add bet until all players have played', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      bet: 1
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_bet/)
    expect(json.details).to.match(/turn_cannot_bet/)
  })

  it('cannot fold until all players have played', async function() {
    const { response, json } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      fold: true
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.match(/api_turns_validate_fold/)
    expect(json.details).to.match(/turn_cannot_fold/)
  })

  it('can play red', async function() {
    const { response } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      card: 'red'
    })
    expect(response.status).to.equal(201)
  })

  it('cannot play black twice', async function() {
    const { response, json } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      card: 'black'
    })
    expect(response.status).to.equal(400)
    expect(json.message).to.equal('api_turns_validate_card')
    expect(json.details).to.equal('player_does_not_have_card_available')
  })

  it('can play red twice', async function() {
    const { response } = await fetch.post('/turns', user1, {
      player_id: player1Id,
      card: 'red'
    })
    expect(response.status).to.equal(201)
  })

  describe('Without card', async function() {
    beforeEach(async function() {
      const { users, players } = await fixture.setState({
        users: 2,
        rooms: ([user1]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' }
        ],
        players: ([user1, user2], [room]) => [
          { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
          { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
        ]
      })
      user1 = users[0]
      user2 = users[1]
      player1Id = players[0].id
      player2Id = players[1].id

      await fixture.setPlayerCards(player1Id, ['red', 'red', 'red'])
    })

    it('cannot play black', async function() {
      const { response, json } = await fetch.post('/turns', user1, {
        player_id: player1Id,
        card: 'black'
      })
      expect(response.status).to.equal(400)
      expect(json.message).to.equal('api_turns_validate_card')
      expect(json.details).to.equal('player_does_not_have_card')
    })
  })
})
