export const POST_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.pgrst.object+json',
  Prefer: 'return=representation'
}

export const getPostHeader = jwt => ({
  Authorization: `Bearer ${jwt}`,
  ...POST_HEADERS
})

export const getGetHeader = jwt => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${jwt}`
})
