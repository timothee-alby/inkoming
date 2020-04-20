const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Round end', async function() {
  const user1Id = uuidv4()
  const user2Id = uuidv4()
  let player2Id
  let player1Id

  before(async function() {
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
    player1Id = players[0].id
    player2Id = players[1].id
  })

  describe('last standing player', async function() {
    before(async function() {
      await fixture.setState({
        turns: [
          { as: user1Id, player_id: player1Id, bet: 1 },
          { as: user2Id, player_id: player2Id, fold: true }
        ]
      })
    })

    it('cannot play anymore', async function() {
      const { response, json } = await fetch.post('/turns', user1Id, {
        player_id: player1Id,
        fold: true
      })
      expect(response.status).to.equal(400)
      expect(json.message).to.match(/api_turns_validate_order/)
      expect(json.details).to.match(/round_has_ended/)
    })
  })
})
