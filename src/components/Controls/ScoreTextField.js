import React, { useEffect, useState } from 'react'
import { TextField } from '@material-ui/core'

export default function ScoreTextField(props) {
  const { value, handleSave, name, isNumber, minWidth ,textAlign} = props

  const [isValid, setIsValid] = useState(true)
  const [currentVal, setCurrentVal] = useState(value === 0 || !value ? '' : value)
  const [newVal, setNewVal] = useState(value === 0 || !value ? '' : value)

  function handleOnChange(e) {
    const changedVal = e.target.value

    if (isNumber && Number(changedVal) !== Number(currentVal ?? 0)) {
      const regex = RegExp(/^\d*\.?\d*$/g)
      if (!regex.test(changedVal) || Number(changedVal) > 10) {
        setIsValid(false)
      } else {
        setIsValid(true)
      }
    }

    setNewVal(changedVal)
  }

  function handleOnBlur(e) {
    if (isNumber && isValid) {
      setCurrentVal(newVal)
      handleSave(name, newVal)
    }

    if (!isNumber && newVal !== currentVal) {
      setCurrentVal(newVal)
      handleSave(name, newVal)
    }
  }

  useEffect(() => {
    setNewVal(value ?? '')
  }, [value])
  console.log(textAlign)
  console.log(value)
  return <TextField InputProps={{inputProps: {style: { textAlign: name==="comment"?"left":"center" },}}}  value={newVal} variant="outlined" style={{ minWidth: minWidth  }} onChange={handleOnChange} onBlur={handleOnBlur} type="text" error={!isValid} />
}
