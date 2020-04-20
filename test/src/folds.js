const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('folds', async function() {
  const user1Id = uuidv4()
  const user2Id = uuidv4()
  let player2Id

  before(async function() {
    await fixture.clearState()
    const { players } = await fixture.setState({
      rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }],
      players: ([room]) => [
        { as: user1Id, room_id: room.id, user_id: user1Id },
        { as: user2Id, room_id: room.id, user_id: user2Id }
      ],
      turns: ([player1, player2]) => [
        { as: user1Id, player_id: player1.id, card: 'black' },
        { as: user2Id, player_id: player2.id, card: 'red' },
        { as: user1Id, player_id: player1.id, card: 'red' },
        { as: user2Id, player_id: player2.id, card: 'red' }
      ]
    })

    player2Id = players[1].id
    await fixture.setState({
      turns: [{ as: user1Id, player_id: players[0].id, bet: 1 }]
    })
  })

  it('can fold', async function() {
    const { response } = await fetch.post('/turns', user2Id, {
      player_id: player2Id,
      fold: true
    })
    expect(response.status).to.equal(201)
  })
})
