import OError from '@overleaf/o-error'

class RequestError extends OError {
  constructor(response, body) {
    const info = {
      status: response.status,
      url: response.url,
      details: body.details,
      message: body.message,
      code: body.code,
      hint: body.hint
    }
    if (!body.message.match(/ /) && !body.details.match(/ /)) {
      info.serverKey = `${body.message}.${body.details}`
    }
    super(response.statusText, info)
  }
}

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
      throw new RequestError(response, await response.json())
    }
    return response.json()
  }
}

const milou = async options => {
  return makeFetchFunction(options)(options.url)
}

export { makeFetchFunction, makeFetchHeaders }

export default milou
