import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  text: {
    fontWeight: 600,
    fontSize: '120px',
    fill: theme.palette.darkSpace.main
  }
}))

const BetLabelIcon = props => {
  const classes = useStyles()
  const { label, ...other } = props

  return (
    <SvgIcon {...other}>
      <svg
        height="24"
        width="24"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <g>
            <rect
              x="216.377"
              y="203.538"
              width="22.048"
              height="75.175"
              transform="matrix(1,0,0,1,0,0)"
              fill="rgb(39,53,84)"
            />
            <rect
              x="216.377"
              y="277.502"
              width="22.048"
              height="228.245"
              transform="matrix(1,0,0,1,0,0)"
              fill="rgb(39,53,84)"
            />
            <path
              d=" M 129.169 504.557 L 191.964 278.694 L 213.212 284.572 L 152.366 504.557 L 129.169 504.557 Z "
              fill="rgb(39,53,84)"
            />
            <path
              d=" M 326.428 504.557 L 263.612 278.694 L 242.36 284.572 L 303.208 504.557 L 326.428 504.557 Z "
              fill="rgb(39,53,84)"
            />
            <circle
              cx="227.40239496046448"
              cy="278.71363400252756"
              r="22.400852056191724"
              fill="rgb(255,90,72)"
            />
            <rect
              x="188.935"
              y="267.69"
              width="76.932"
              height="22.047"
              transform="matrix(1,0,0,1,0,0)"
              fill="rgb(255,90,72)"
            />
            <rect
              x="73.178"
              y="25.165"
              width="137.914"
              height="197.725"
              transform="matrix(-0.341,0.94,-0.94,-0.341,307.208,32.724)"
              fill="rgb(144,236,255)"
            />
            <rect
              x="237.38"
              y="112.496"
              width="124.544"
              height="137.386"
              transform="matrix(-0.341,0.94,-0.94,-0.341,572.187,-38.686)"
              fill="rgb(114,218,232)"
            />
            <rect
              x="404.234"
              y="159.34"
              width="49.033"
              height="137.386"
              transform="matrix(-0.341,0.94,-0.94,-0.341,789.357,-97.218)"
              fill="rgb(242,95,126)"
            />
            <path
              d=" M 55.715 6.3 L 63.653 9.18 C 70.93 11.822 74.722 19.935 72.082 27.21 L 26.294 153.382 C 23.653 160.658 15.54 164.451 8.264 161.81 L 0.327 158.93 L 55.715 6.3 L 55.715 6.3 Z "
              fill="rgb(0,44,64)"
            />
            <path
              d=" M 507.119 218.014 C 510.756 219.336 512.816 222.944 511.694 226.033 L 491.101 282.777 C 489.981 285.868 486.085 287.315 482.449 285.995 L 480.963 285.456 L 505.633 217.476 L 507.119 218.014 L 507.119 218.014 Z "
              fill="rgb(0,44,64)"
            />
            <rect
              x="152.55"
              y="-20.856"
              width="15.331"
              height="186.699"
              transform="matrix(-0.341,0.94,-0.94,-0.341,283.012,-53.385)"
              fill="rgb(213,246,255)"
            />
            <rect
              x="308.646"
              y="75.366"
              width="15.331"
              height="123.845"
              transform="matrix(-0.341,0.94,-0.94,-0.341,553.287,-113.2)"
              fill="rgb(213,246,255)"
            />
            <path
              d=" M 28.013 82.636 L 28.019 82.616 L 28.019 82.616 L 55.099 7.826 C 55.099 7.826 44.105 10.226 19.041 79.362 L 19.041 79.362 C 19.038 79.369 19.036 79.375 19.033 79.382 C 19.03 79.388 19.028 79.394 19.027 79.401 L 19.027 79.401 C -6.031 148.538 0.871 157.426 0.871 157.426 L 28.005 82.655 L 28.005 82.655 L 28.013 82.636 L 28.013 82.636 Z "
              fill="rgb(255,255,255)"
            />
          </g>
          <text
            transform="matrix(0.942,0.335,-0.335,0.942,53.962,146.042)"
            className={classes.text}
          >
            {label}
          </text>
        </g>
      </svg>
    </SvgIcon>
  )
}

export default BetLabelIcon
