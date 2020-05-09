import { makeStyles } from '@material-ui/core/styles'

import red from '@material-ui/core/colors/red'
import pink from '@material-ui/core/colors/pink'
import purple from '@material-ui/core/colors/purple'
import deepPurple from '@material-ui/core/colors/deepPurple'
import indigo from '@material-ui/core/colors/indigo'
import blue from '@material-ui/core/colors/blue'
import lightBlue from '@material-ui/core/colors/lightBlue'
import cyan from '@material-ui/core/colors/cyan'
import teal from '@material-ui/core/colors/teal'
import green from '@material-ui/core/colors/green'
import lightGreen from '@material-ui/core/colors/lightGreen'
import lime from '@material-ui/core/colors/lime'
import yellow from '@material-ui/core/colors/yellow'
import amber from '@material-ui/core/colors/amber'
import orange from '@material-ui/core/colors/orange'
import deepOrange from '@material-ui/core/colors/deepOrange'
import brown from '@material-ui/core/colors/brown'
import blueGrey from '@material-ui/core/colors/blueGrey'

const colours = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  blueGrey
]

const useStyles = makeStyles(theme => {
  const fullTheme = {}
  for (let idx = 0; idx < colours.length; idx++) {
    const colour = colours[idx]
    fullTheme[`identity-colour-${idx}`] = {
      color: theme.palette.getContrastText(colour[500]),
      backgroundColor: colour[500],
      '&.identity-colour-light': {
        color: theme.palette.getContrastText(colour[300]),
        backgroundColor: colour[300]
      },
      '&.identity-colour-reverse': {
        color: colour[500],
        backgroundColor: theme.palette.getContrastText(colour[500])
      }
    }
  }
  return fullTheme
})

const makeIdentityHash = identity => {
  return `${identity.nickname}${identity.user_id}`
    .split('')
    .reduce((acc, char) => acc * char.charCodeAt(0), 1)
}

const getColourClass = identity => {
  const identityHash = makeIdentityHash(identity)
  return `identity-colour-${identityHash % colours.length}`
}

export default { useStyles, getColourClass }
