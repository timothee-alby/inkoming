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
    rooms: [
      { as: user1Id, user_id: user1Id, name: 'Foo Name' },
      { as: user3Id, user_id: user3Id, name: 'Bar Name' }
    ],
    players: ([room1, room2]) => [
      { as: user1Id, room_id: room1.id, user_id: user1Id, nickname: 'user1' },
      { as: user2Id, room_id: room1.id, user_id: user2Id, nickname: 'user2' },
      { as: user3Id, room_id: room1.id, user_id: user3Id, nickname: 'user3' }
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

describe('Round Reset', async function() {
  describe('On Pending', async function() {
    beforeEach(async function() {
      await setPendingState()
    })

    it('cannot reset', async function() {
      const { response, json } = await fetch.post('/rpc/reset_round', user2Id, {
        player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('round_has_no_outcome')
    })
  })

  describe('On Won', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal second red card
          { as: user1Id, player_id: player1Id, target_player_id: player2Id }
        ]
      })
    })

    it('users cannot fake their player_id', async function() {
      const { response, json } = await fetch.post('/rpc/reset_round', user3Id, {
        player_id: player2Id
      })
      expect(response.status).to.equal(403)
      expect(json.message).to.equal('insufficient_privilege')
      expect(json.details).to.equal('invalid_player_id')
    })

    it('add one point to challenger', async function() {
      const { response } = await fetch.post('/rpc/reset_round', user2Id, {
        player_id: player2Id
      })
      expect(response.status).to.equal(200)

      const { json } = await fetch.get(
        `/player_states?room_id=eq.${roomId}`,
        user1Id
      )
      const [player1State, player2State, player3State] = json
      expect(player1State.points).to.equal(1)
      expect(player2State.points).to.equal(0)
      expect(player3State.points).to.equal(0)
    })
  })

  describe('On Lost', async function() {
    beforeEach(async function() {
      await setPendingState()
      await fixture.setState({
        reveals: [
          // reveal black card
          { as: user1Id, player_id: player1Id, target_player_id: player3Id }
        ]
      })
    })

    it('remove one card from challenger', async function() {
      const { response } = await fetch.post('/rpc/reset_round', user2Id, {
        player_id: player2Id
      })
      expect(response.status).to.equal(200)

      const { json } = await fetch.get(
        `/player_states?room_id=eq.${roomId}`,
        user1Id
      )
      const [player1State, player2State, player3State] = json
      expect(player1State.total_cards).to.equal(3)
      expect(player2State.total_cards).to.equal(4)
      expect(player3State.total_cards).to.equal(4)

      expect(player1State.points).to.equal(0)
      expect(player2State.points).to.equal(0)
      expect(player3State.points).to.equal(0)
    })
  })
})
