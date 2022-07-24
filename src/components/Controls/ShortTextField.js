import React from 'react'
import { TextField } from '@material-ui/core'

import { get } from 'lodash'
import StringUtils from 'utils/StringUtils'

export default function ShortTextField({ formik, name, label = '', required = false, autoCapitalize = false, readOnly = false, maxLength, onClick }) {
  const forFormik = () => {
    const { values, errors, touched, handleBlur, handleChange } = formik

    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      InputLabelProps: { shrink: true },
      error: get(errors, name) && get(touched, name),
      helperText: get(errors, name) && get(touched, name) && get(errors, name),
      value: autoCapitalize ? StringUtils.capitalize(get(values, name)) : get(values, name) ?? '',
      onBlur: handleBlur,
      onChange: handleChange,
      inputProps: {
        maxLength: maxLength
      },
      InputProps: {
        readOnly: readOnly
      }
    }
  }

  return <TextField {...forFormik()} required={required} onClick={onClick} />
}
