import React, { useEffect, useState } from 'react'
import { TextField } from '@material-ui/core'

export default function ScoreTextField(props) {
  const { value, handleSave, name, isNumber, minWidth } = props

  const [isValid, setIsValid] = useState(true)
  const [currentVal, setCurrentVal] = useState(value)
  const [newVal, setNewVal] = useState(value)

  function handleOnChange(e) {
    const changedVal = e.target.value

    if (isNumber && Number(changedVal) !== Number(currentVal)) {
      const regex = RegExp(/^\d*\.?\d*$/g)
      if (!regex.test(changedVal) || Number(changedVal) > 10) {
        setIsValid(false)
      } else {
        setIsValid(true)
        setNewVal(changedVal)
      }
    }

    if (!isNumber) {
      setNewVal(changedVal)
    }
  }

  function handleOnBlur(e) {
    if (isNumber && Number(newVal) !== Number(currentVal) && isValid) {
      setCurrentVal(newVal)
      handleSave(name, newVal)
    }

    if (!isNumber && newVal !== currentVal) {
      setCurrentVal(newVal)
      handleSave(name, newVal)
    }
  }

  useEffect(() => {
    if (value) setNewVal(value)
  }, [value])

  return <TextField value={newVal} variant="outlined" style={{ minWidth: minWidth }} onChange={handleOnChange} onBlur={handleOnBlur} type="text" error={!isValid} />
}
