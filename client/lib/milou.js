import useSWR from 'swr'

const makeFetchHeaders = ({ method, jwt, singleObject, preferReturn }) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (jwt) headers.Authorization = `Bearer ${jwt}`

  singleObject = singleObject || method === 'POST'
  if (singleObject) headers.Accept = 'application/vnd.pgrst.object+json'

  preferReturn = preferReturn || method === 'POST' ? 'representation' : null
  if (preferReturn) headers.Prefer = `return=${preferReturn}`

  return headers
}

const makeFetchFunction = options => {
  const fetchOptions = {}
  fetchOptions.method = options.method || 'GET'
  fetchOptions.headers = makeFetchHeaders(options)

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  return async url => {
    const response = await fetch(url, fetchOptions)
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  }
}

const milou = options => {
  return useSWR(options.url, makeFetchFunction(options))
}

export default milou
