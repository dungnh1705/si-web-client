import React, { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField, ClickAwayListener } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import accounting from 'accounting'

export default function InlineTextField({ label, value, handleChanged, isNumber, isCurrency = false, isRequired = false, isEditable = false, isMoreInfo = false, handleClickIcon, icon, ...rest }) {
  const inputRef = React.useRef()
  const [localValue, setLocalValue] = useState(value)
  const [showAction, setShowAction] = useState(false)
  const [valueBeforeChange, setValueBeforeChange] = useState(value)
  const [isValid, setIsValid] = useState(false)

  const handleChange = e => {
    if (isNumber) {
      const regex = RegExp(/^\d*\.?\d*$/g)
      if (!regex.test(e.target.value)) {
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    }
    setLocalValue(e.target.value)
  }

  const cancelChange = () => {
    setLocalValue(value)
    setShowAction(false)
    setIsValid(false)
  }

  const handleFocus = e => {
    setShowAction(true)
  }

  const handleClickOk = () => {
    if (isValid) return
    handleChanged(rest.field, localValue, isMoreInfo)
    setShowAction(false)
  }

  const handleClick = e => {
    handleClickIcon(e, localValue)
  }

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    setLocalValue(valueBeforeChange)
  }, [valueBeforeChange])

  return (
    <>
      {!showAction && (
        <TextField
          inputRef={inputRef}
          fullWidth
          label={label}
          value={isCurrency ? accounting.formatMoney(localValue) : localValue}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          {...rest}
          onFocus={handleFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" onClick={handleClick} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={icon} />
              </InputAdornment>
            ),
            readOnly: true
          }}
        />
      )}
      {showAction && (
        <ClickAwayListener onClickAway={cancelChange} mouseEvent="onMouseDown" touchEvent="onTouchStart">
          <TextField
            error={isValid}
            type={isCurrency ? 'number' : 'text'}
            helperText={isValid ? 'Invalid format' : ''}
            fullWidth
            label={label}
            value={localValue}
            variant="outlined"
            onChange={handleChange}
            autoFocus
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={icon} />
                </InputAdornment>
              ),
              endAdornment: isEditable ? (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleClickOk} color="primary" disabled={isRequired && !localValue}>
                    <DoneIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={cancelChange}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : (
                <></>
              ),
              readOnly: !isEditable
            }}
            {...rest}
          />
        </ClickAwayListener>
      )}
    </>
  )
}
