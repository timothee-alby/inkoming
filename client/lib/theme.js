import { createMuiTheme } from '@material-ui/core/styles'

const colours = {
  // primary
  myrtieGreen: '#397367',
  brunswickGreen: '#2e6054',
  hokersGreen: '#43786d',
  winterdreamGreen: '#53877d',

  // secondary
  sunray: '#DDA448',
  maximumYellowRed: '#E7BC5F',

  // misc
  cBlue: '#2D728F',
  mauveTaupe: '#74444b',
  maximumBlueGreen: '#5ABCB9',
  powderBlue: '#ACE3E9',
  tealBlue: '#3D809A'
}

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: { main: colours.myrtieGreen },
    secondary: { main: colours.sunray },
    background: {
      default: colours.powderBlue,
      header: { main: colours.cBlue, gradient: colours.tealBlue },
      action: {
        main: colours.myrtieGreen,
        gradient: colours.brunswickGreen,
        hover: {
          main: colours.winterdreamGreen,
          gradient: colours.hokersGreen
        }
      }
    }
  }
})

export default theme
