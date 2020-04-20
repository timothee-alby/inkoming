const fixture = require('./fixture')

before(async function() {
  await fixture.clearState()
})
