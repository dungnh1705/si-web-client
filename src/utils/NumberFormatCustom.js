import React from 'react'
import NumberFormat from 'react-number-format'

const NumberFormatCustom = props => {
  const { inputRef, onChange, maxLength, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      thousandSeparator
      isNumericString
      allowNegative={false}
      decimalScale={maxLength === 4 ? '2' : '1'}
    />
  )
}

export default NumberFormatCustom
