const { v4: uuidv4 } = require('uuid')
const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

let roomId, user1Id, user2Id, user3Id, player1Id, player2Id, player3Id
const setPendingState = async function() {
  user1Id = uuidv4()
  user2Id = uuidv4()
  user3Id = uuidv4()
  const { rooms, players } = await fixture.setState({
    rooms: [{ as: user1Id, user_id: user1Id, name: 'Foo Name' }],
    players: ([room]) => [
      { as: user1Id, room_id: room.id, user_id: user1Id , nickname: 'user1'},
      { as: user2Id, room_id: room.id, user_id: user2Id , nickname: 'user2'},
      { as: user3Id, room_id: room.id, user_id: user3Id , nickname: 'user3'}
    ],
    turns: ([player1, player2, player3]) => [
      { as: user1Id, player_id: player1.id, card: 'red' },
      { as: user2Id, player_id: player2.id, card: 'red' },
      { as: user3Id, player_id: player3.id, card: 'black' },
      { as: user1Id, player_id: player1.id, bet: 2 },
      { as: user2Id, player_id: player2.id, fold: true },
      { as: user3Id, player_id: player3.id, fold: true }
    ],
    reveals: ([player1, player2]) => [
      { as: user1Id, player_id: player1.id, target_player_id: player1.id }
    ]
  })
  roomId = rooms[0].id
  player1Id = players[0].id
  player2Id = players[1].id
  player3Id = players[2].id
}

describe('Round Outcome', async function() {
  describe('Winning', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal second red card
          { as: user1Id, player_id: player1Id, target_player_id: player2Id }
        ]
      })
    })

    it('cannot reveal anymore', async function() {
      const { response, json } = await fetch.post('/rpc/reveal_card', user1Id, {
        player_id: player1Id,
        target_player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('round_has_outcome')
    })

    it('has won outcome', async function() {
      const { json } = await fetch.get(
        `/room_states?room_id=eq.${roomId}`,
        user2Id
      )
      const [roomState] = json
      expect(roomState.challenger_player_id).to.equal(player1Id)
      expect(roomState.total_revealed_cards).to.equal(2)
      expect(roomState.total_revealed_red_cards).to.equal(2)
      expect(roomState.total_revealed_black_cards).to.equal(0)
      expect(roomState.outcome).to.equal('won')
    })
  })

  describe('Losing', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal black card
          { as: user1Id, player_id: player1Id, target_player_id: player3Id }
        ]
      })
    })

    it('cannot reveal anymore', async function() {
      const { response, json } = await fetch.post('/rpc/reveal_card', user1Id, {
        player_id: player1Id,
        target_player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('round_has_outcome')
    })

    it('has lost outcome', async function() {
      const { json } = await fetch.get(
        `/room_states?room_id=eq.${roomId}`,
        user2Id
      )
      const [roomState] = json
      expect(roomState.challenger_player_id).to.equal(player1Id)
      expect(roomState.total_revealed_cards).to.equal(2)
      expect(roomState.total_revealed_red_cards).to.equal(1)
      expect(roomState.total_revealed_black_cards).to.equal(1)
      expect(roomState.outcome).to.equal('lost')
    })
  })
})
