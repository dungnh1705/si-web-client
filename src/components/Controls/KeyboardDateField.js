import React from 'react'

import _ from 'lodash'
import moment from 'moment'

import DateField from '../ShareControls/DateField'

export default function KeyboardDateField({ formik, name, label = '', required = false, readOnly = false }) {
  const { values, errors, touched, handleBlur, handleChange } = formik

  const forFormik = () => {
    return {
      name,
      label,
      error: _.get(errors, name) && _.get(touched, name),
      helperText: _.get(errors, name) && _.get(touched, name) && _.get(errors, name),
      value: _.get(values, name) ?? null,
      onBlur: handleBlur,
      onChange: handleChange
    }
  }

  const handChangeDate = date => {
    try {
      if (date === 'Invalid date' || date === 'Invalid Date') return
      if (moment(date).format('YYYY-MM-DD') === 'Invalid date' && date) return
      formik.setFieldValue(name, moment(date).format('YYYY-MM-DD'))
    } catch (err) {
      return
    }
  }

  return <DateField {...forFormik()} onChange={date => handChangeDate(date)} required={required} readOnly={readOnly} />
}
