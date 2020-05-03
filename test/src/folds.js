const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('folds', async function() {
  let user1, user2, player2Id

  before(async function() {
    const { users, players } = await fixture.setState({
      users: 2,
      rooms: ([user1]) => [{ as: user1, user_id: user1.id, name: 'Foo Name' }],
      players: ([user1, user2], [room]) => [
        { as: user1, room_id: room.id, user_id: user1.id, nickname: 'user1' },
        { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
      ],
      turns: ([user1, user2], [player1, player2]) => [
        { as: user1, player_id: player1.id, card: 'black' },
        { as: user2, player_id: player2.id, card: 'red' },
        { as: user1, player_id: player1.id, card: 'red' },
        { as: user2, player_id: player2.id, card: 'red' }
      ]
    })

    user1 = users[0]
    user2 = users[1]
    player2Id = players[1].id
    await fixture.setState({
      turns: [{ as: user1, player_id: players[0].id, bet: 1 }]
    })
  })

  it('can fold', async function() {
    const { response } = await fetch.post('/turns', user2, {
      player_id: player2Id,
      fold: true
    })
    expect(response.status).to.equal(201)
  })
})
