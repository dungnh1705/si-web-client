import { withStyles } from '@material-ui/core/styles'
import { Card } from '@material-ui/core'

const CardOnModal = withStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 900,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  }
}))(Card)

export default CardOnModal
