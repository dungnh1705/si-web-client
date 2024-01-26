import React from 'react'
import { makeStyles, Button } from '@material-ui/core'

const useStyles = makeStyles({
  active: {
    background: '#ECF3FF',
    color: '#1877F2'
  },
  button: {
    marginRight: '8px',
    borderRadius: '48px'
  }
})

export default function FilterTab({ value, handleChange }) {
  const classes = useStyles()
  return (
    <div className="mx-2">
      <Button className={`${classes.button} ${value === 0 ? classes.active : ''}`} onClick={handleChange}>
        Tất cả
      </Button>
      <Button className={`${classes.button} ${value === 1 ? classes.active : ''}`} onClick={handleChange}>
        Chưa đọc
      </Button>
    </div>
  )
}
