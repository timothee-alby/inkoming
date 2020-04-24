const { expect } = require('chai')
const fetch = require('./helpers/fetch')

describe('Users', async function() {
  it('generate user_id and jwt_token', async function() {
    const { response, json } = await fetch.post('/rpc/generate_user')
    expect(response.status).to.equal(200)
    expect(json.jwt).to.exist
  })
})
