const { expect } = require('chai')
const fetch = require('./helpers/fetch')
const fixture = require('./helpers/fixture')

describe('Room State', async function() {
  let roomId, user1, user3, player2Id, player1Id

  describe('with turns', async function() {
    beforeEach(async function() {
      const { users, rooms, players } = await fixture.setState({
        users: 3,
        rooms: ([user1]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' }
        ],
        players: ([user1, user2], [room]) => [
          {
            as: user1,
            room_id: room.id,
            user_id: user1.id,
            nickname: 'user1'
          },
          { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
        ],
        turns: ([user1, user2], [player1, player2]) => [
          { as: user1, player_id: player1.id, card: 'black' },
          { as: user2, player_id: player2.id, card: 'red' },
          { as: user1, player_id: player1.id, card: 'red' },
          { as: user2, player_id: player2.id, card: 'red' },
          { as: user1, player_id: player1.id, bet: 1 }
        ]
      })
      roomId = rooms[0].id
      user1 = users[0]
      user3 = users[2]
      player1Id = players[0].id
      player2Id = players[1].id
    })

    it('return correct roomState', async function() {
      const { response, json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user1
      )
      expect(response.status).to.equal(200)

      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      expect(roomState.room_id).to.equal(roomId, 'unexpected roomState.room_id')
      expect(roomState.total_players).to.equal(
        2,
        'unexpected roomState.total_players'
      )
      expect(roomState.total_standing_players).to.equal(
        2,
        'unexpected roomState.total_standing_players'
      )
      expect(roomState.player_ids).to.deep.equal(
        [player1Id, player2Id],
        'unexpected roomState.player_ids'
      )
      expect(roomState.standing_player_ids).to.deep.equal(
        [player1Id, player2Id],
        'unexpected roomState.standing_player_ids'
      )
      expect(roomState.total_turns).to.equal(
        5,
        'unexpected roomState.total_turns'
      )
      expect(roomState.total_cards).to.equal(
        4,
        'unexpected roomState.total_cards'
      )
      expect(roomState.total_revealed_cards).to.equal(
        0,
        'unexpected roomState.total_revealed_cards'
      )
      expect(roomState.total_revealed_red_cards).to.equal(
        0,
        'unexpected roomState.total_revealed_red_cards'
      )
      expect(roomState.total_revealed_black_cards).to.equal(
        0,
        'unexpected roomState.total_revealed_black_cards'
      )
      expect(roomState.total_bets).to.equal(
        1,
        'unexpected roomState.total_bets'
      )
      expect(roomState.last_bet).to.equal(1, 'unexpected roomState.last_bet')
      expect(roomState.last_player_ids).to.deep.equal(
        [player1Id, player2Id, player1Id, player2Id, player1Id],
        'unexpected roomState.last_player_ids'
      )
      expect(roomState.last_player_id).to.equal(
        player1Id,
        'unexpected roomState.last_player_id'
      )
      expect(roomState.last_standing_player_ids).to.deep.equal(
        [player1Id, player2Id, player1Id, player2Id, player1Id],
        'unexpected roomState.last_standing_player_ids'
      )
      expect(roomState.last_standing_player_id).to.equal(
        player1Id,
        'unexpected roomState.last_standing_player_id'
      )
      expect(roomState.challenger_player_id).to.equal(
        null,
        'unexpected roomState.challenger_player_id'
      )
      expect(roomState.outcome).to.equal(null, 'unexpected roomState.outcome')
      expect(roomState.last_standing_player_position).to.equal(
        1,
        'unexpected roomState.last_standing_player_position'
      )
      expect(roomState.can_bet).to.equal(true, 'unexpected roomState.can_bet')
      expect(roomState.can_card).to.equal(
        false,
        'unexpected roomState.can_card'
      )
      expect(roomState.can_challenge).to.equal(
        false,
        'unexpected roomState.can_challenge'
      )
      expect(roomState.min_bet).to.equal(2, 'unexpected roomState.min_bet')
      expect(roomState.max_bet).to.equal(4, 'unexpected roomState.max_bet')
      expect(roomState.next_player_id).to.equal(
        player2Id,
        'unexpected roomState.next_player_id'
      )
      expect(roomState.all_players).to.be.ofSize(2)
      expect(roomState.all_turns).to.be.ofSize(5)
      expect(roomState.all_turns[0].card).to.be.null
    })
  })

  describe('without turns', async function() {
    beforeEach(async function() {
      const { users, rooms, players } = await fixture.setState({
        users: 2,
        rooms: ([user1]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' }
        ],
        players: ([user1, user2], [room]) => [
          {
            as: user1,
            room_id: room.id,
            user_id: user1.id,
            nickname: 'user1'
          },
          { as: user2, room_id: room.id, user_id: user2.id, nickname: 'user2' }
        ]
      })
      roomId = rooms[0].id
      user1 = users[0]
      player1Id = players[0].id
      player2Id = players[1].id
    })

    it('cannot view other room states', async function() {
      const { response, json } = await fetch.get(
        `/room_states?room_id=eq.${roomId}`,
        user3
      )
      expect(response.status).to.equal(200)
      expect(json.length).to.equal(0)
    })

    it('cannot view other room states via resource embedding', async function() {
      const { response, json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user3
      )
      expect(response.status).to.equal(200)
      expect(json.length).to.equal(0)
    })

    it('does not return null for total or booleans', async function() {
      const { response, json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user1
      )
      expect(response.status).to.equal(200)

      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      expect(roomState.total_players).to.equal(
        2,
        'unexpected roomState.total_players'
      )
      expect(roomState.total_standing_players).to.equal(
        2,
        'unexpected roomState.total_standing_players'
      )
      expect(roomState.total_turns).to.equal(
        0,
        'unexpected roomState.total_turns'
      )
      expect(roomState.total_cards).to.equal(
        0,
        'unexpected roomState.total_cards'
      )
      expect(roomState.total_revealed_cards).to.equal(
        0,
        'unexpected roomState.total_revealed_cards'
      )
      expect(roomState.total_revealed_red_cards).to.equal(
        0,
        'unexpected roomState.total_revealed_red_cards'
      )
      expect(roomState.total_revealed_black_cards).to.equal(
        0,
        'unexpected roomState.total_revealed_black_cards'
      )
      expect(roomState.total_bets).to.equal(
        0,
        'unexpected roomState.total_bets'
      )
      expect(roomState.min_bet).to.equal(1, 'unexpected roomState.min_bet')
      expect(roomState.max_bet).to.equal(0, 'unexpected roomState.max_bet')
      expect(roomState.can_bet).to.equal(false, 'unexpected roomState.can_bet')
      expect(roomState.can_card).to.equal(true, 'unexpected roomState.can_card')
      expect(roomState.can_challenge).to.equal(
        false,
        'unexpected roomState.can_challenge'
      )
    })
  })

  describe('with only one player', async function() {
    beforeEach(async function() {
      const { users, rooms } = await fixture.setState({
        users: 1,
        rooms: ([user1]) => [
          { as: user1, user_id: user1.id, name: 'Foo Name' }
        ],
        players: ([user1], [room]) => [
          {
            as: user1,
            room_id: room.id,
            user_id: user1.id,
            nickname: 'user1'
          }
        ]
      })
      roomId = rooms[0].id
      user1 = users[0]
    })

    it('is correct', async function() {
      const { response, json } = await fetch.get(
        `/rooms?id=eq.${roomId}&select=*,room_states(*)`,
        user1
      )
      expect(response.status).to.equal(200)

      const [{ room_states: roomStates }] = json
      const [roomState] = roomStates
      expect(roomState.next_player_id).to.equal(
        null,
        'unexpected roomState.max_bet'
      )
      expect(roomState.game_winner_player_id).to.equal(
        null,
        'unexpected roomState.game_winner_player_id'
      )
    })
  })
})
