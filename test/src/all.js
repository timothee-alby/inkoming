const { expect } = require('chai')
const fetch = require('./helpers/fetch')

describe('Unroll', async function() {
  // const user0Id = '00000000-0000-0000-0000-000000000000'
  const user1Id = '10000000-0000-0000-0000-000000000000'
  const user2Id = '20000000-0000-0000-0000-000000000000'
  let roomId
  let player1Id
  let player2Id

  describe('Rooms', async function() {
    it('empty on start', async function() {
      const json = await fetch.get('/rooms', user1Id)
      expect(json).to.be.ofSize(0)
    })

    it('post', async function() {
      let response = await fetch.post('/rooms', user1Id, {
        name: 'Test room number 1'
      })
      expect(response.status).to.equal(201)

      response = await fetch.post('/rooms', user1Id, {
        name: 'Test room number 2'
      })
      expect(response.status).to.equal(201)
    })

    it('get', async function() {
      const json = await fetch.get('/rooms', user1Id)
      expect(json).to.be.ofSize(2)

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
      const json = await response.json()
      expect(json.message).to.match(/players_room_id_fkey/)
    })

    it('cannot join without user id', async function() {
      const response = await fetch.post('/players', user1Id, {
        room_id: roomId
      })
      expect(response.status).to.equal(403)
      const json = await response.json()
      expect(json.message).to.match(/players_user_id_policy/)
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
      const json = await response.json()
      expect(json.message).to.match(/players_user_id_policy/)
    })

    it('cannot join a room twice', async function() {
      const response = await fetch.post('/players', user1Id, {
        room_id: roomId,
        user_id: user1Id
      })
      expect(response.status).to.equal(409)
      const json = await response.json()
      expect(json.message).to.match(/players_room_id_user_id_key/)
    })

    it('can only list themselves', async function() {
      let json = await fetch.get('/players', user1Id)
      expect(json).to.be.ofSize(1)
      let player = json[0]
      player1Id = player.id

      json = await fetch.get('/players', user2Id)
      expect(json).to.be.ofSize(1)
      player = json[0]
      player2Id = player.id
    })
  })

  describe('Turns', async function() {
    it('can add turns', async function() {
      const response = await fetch.post('/turns', user1Id, {
        player_id: player1Id,
        card: 'black'
      })
      expect(response.status).to.equal(201)
    })

    it('cannot add turns for other players', async function() {
      const response = await fetch.post('/turns', user1Id, {
        player_id: player2Id
      })
      expect(response.status).to.equal(403)
    })

    it('cannot add turns with invalid cards', async function() {
      const response = await fetch.post('/turns', user2Id, {
        player_id: player2Id,
        card: 'blue'
      })
      expect(response.status).to.equal(400)
      const json = await response.json()
      expect(json.message).to.match(/invalid input value for enum card/)
    })

    it('cannot add turns without card or bet', async function() {
      const response = await fetch.post('/turns', user2Id, {
        player_id: player2Id
      })
      expect(response.status).to.equal(400)
      const json = await response.json()
      expect(json.message).to.match(/turns_card_or_bet_not_null/)
    })

    it('cannot add turns out of order', async function() {
      const response = await fetch.post('/turns', user1Id, {
        player_id: player1Id,
        card: 'red'
      })
      expect(response.status).to.equal(403)
      const json = await response.json()
      expect(json.message).to.match(/turns_in_turn_policy/)
    })
  })

  describe('Room state', async function() {
    describe('Card mode', async function() {
      it('cannot add bet until all players have played', async function() {
        const response = await fetch.post('/turns', user2Id, {
          player_id: player2Id,
          bet: 1
        })
        expect(response.status).to.equal(403)
        const json = await response.json()
        expect(json.message).to.match(/turns_can_bet_policy/)
      })

      it('can play red', async function() {
        const response = await fetch.post('/turns', user2Id, {
          player_id: player2Id,
          card: 'red'
        })
        expect(response.status).to.equal(201)
      })

      it('removes played cards from player', async function() {
        let json = await fetch.get('/players', user1Id)
        expect(json).to.be.ofSize(1)
        let player = json[0]
        expect(player.cards).to.be.equalTo(['red', 'red', 'red'])

        json = await fetch.get('/players', user2Id)
        expect(json).to.be.ofSize(1)
        player = json[0]
        expect(player.cards).to.be.equalTo(['black', 'red', 'red'])
      })

      it('cannot play black twice', async function() {
        const response = await fetch.post('/turns', user1Id, {
          player_id: player1Id,
          card: 'black'
        })
        expect(response.status).to.equal(400)
        const json = await response.json()
        expect(json.message).to.match(/api_turns_validate_card/)
        expect(json.details).to.match(/player_does_not_have_card/)
      })

      it('can play red twice', async function() {
        const response = await fetch.post('/turns', user1Id, {
          player_id: player1Id,
          card: 'red'
        })
        expect(response.status).to.equal(201)

        const json = await fetch.get('/players', user1Id)
        expect(json).to.be.ofSize(1)
        const player = json[0]
        expect(player.cards).to.be.equalTo(['red', 'red'])
      })
    })

    describe('Bet mode', async function() {
      before(async function() {
        const response = await fetch.post('/turns', user2Id, {
          player_id: player2Id,
          card: 'red'
        })
        expect(response.status).to.equal(201)
      })

      it('cannot bet 0', async function() {
        const response = await fetch.post('/turns', user1Id, {
          player_id: player1Id,
          bet: 0
        })
        expect(response.status).to.equal(403)
        const json = await response.json()
        expect(json.message).to.match(/turns_min_bet_policy/)
      })

      it('can bet once all players have played', async function() {
        const response = await fetch.post('/turns', user1Id, {
          player_id: player1Id,
          bet: 1
        })
        expect(response.status).to.equal(201)
      })

      it('cannot card once a players has bet', async function() {
        const response = await fetch.post('/turns', user2Id, {
          player_id: player2Id,
          card: 'red'
        })
        expect(response.status).to.equal(400)
        const json = await response.json()
        expect(json.message).to.match(/api_turns_validate_card/)
        expect(json.details).to.match(/turn_cannot_card/)
      })

      it('cannot bet lower or equal to min bet', async function() {
        const response = await fetch.post('/turns', user2Id, {
          player_id: player2Id,
          bet: 1
        })
        expect(response.status).to.equal(403)
        const json = await response.json()
        expect(json.message).to.match(/turns_min_bet_policy/)
      })

      it('cannot bet higher than max bet', async function() {
        const response = await fetch.post('/turns', user2Id, {
          player_id: player2Id,
          bet: 9
        })
        expect(response.status).to.equal(403)
        const json = await response.json()
        expect(json.message).to.match(/turns_max_bet_policy/)
      })
    })
  })
})
