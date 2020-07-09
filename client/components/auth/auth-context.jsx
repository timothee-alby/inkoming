import OError from '@overleaf/o-error'
import React from 'react'
import milou from '~/lib/milou'
import JwtHelper from '~/lib/jwt-helper'
import RequestError from '~/components/request-error'

const USER_CACHE_KEY = 'fdn_user'

export const AuthContext = React.createContext(null)
export const useAuth = () => React.useContext(AuthContext)

const createServerUser = async (setUserJwt, setError) => {
  try {
    const { jwt } = await milou({
      method: 'POST',
      url: `${process.env.API_URL}/rpc/generate_user`
    })
    setUserJwt(jwt)
  } catch (error) {
    setError(
      OError.tag(error, 'cannot generate user', {
        retryable: true
      })
    )
  }
}

const AuthProvider = ({ children }) => {
  const [error, setError] = React.useState(null)
  const [userName, setUserName] = React.useState()
  const [userJwt, setUserJwt] = React.useState()
  const [userId, setUserId] = React.useState()
  const [isBeginner, setIsBeginner] = React.useState(false)
  const [tutorialCloseCount, setTutorialCloseCount] = React.useState(0)

  // store values in local storage
  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(USER_CACHE_KEY)) || {}
    const newUser = {}
    if (userJwt) newUser.jwt = userJwt
    if (userName) newUser.name = userName
    if (isBeginner === true || isBeginner === false)
      newUser.isBeginner = isBeginner
    if (tutorialCloseCount) newUser.tutorialCloseCount = tutorialCloseCount

    const newStoredUser = Object.assign(storedUser, newUser)

    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(newStoredUser))
  }, [userJwt, userName, isBeginner, tutorialCloseCount])

  // extract userId from userJwt
  React.useEffect(() => {
    if (!userJwt) return
    const { user_id: userId } = JwtHelper.getPayload(userJwt)
    setUserId(userId)
  }, [userJwt])

  // get stored values from local storage
  React.useEffect(() => {
    const {
      jwt: storedUserJwt,
      name: storedUserName,
      isBeginner: storedIsBeginner,
      tutorialCloseCount: storedTutorialCloseCount
    } = JSON.parse(localStorage.getItem(USER_CACHE_KEY)) || {}

    if (storedUserName) {
      setUserName(storedUserName)
    }

    if (storedIsBeginner) {
      setIsBeginner(storedIsBeginner)
    }

    if (storedTutorialCloseCount) {
      setTutorialCloseCount(storedTutorialCloseCount)
    }

    if (storedUserJwt) {
      setUserJwt(storedUserJwt)
    } else {
      createServerUser(setUserJwt, setUserId, setError)
    }
  }, [])

  if (error) {
    return <RequestError error={error} />
  }

  return (
    <AuthContext.Provider
      value={{
        userJwt,
        userId,
        userName,
        setUserName,
        isBeginner,
        setIsBeginner,
        tutorialCloseCount,
        setTutorialCloseCount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
