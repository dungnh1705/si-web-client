import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { get } from 'lodash'

export default function AutocompleteTextField({ formik, name, label = '', options = [] }) {
  const { values } = formik

  const getDropdownValue = fieldName => {
    const newFieldName = fieldName.includes('Father') ? 'studentMoreInfo.newFatherHolyName' : fieldName.includes('Mother') ? 'studentMoreInfo.newMotherHolyName' : 'newHolyName'

    return options.find(item => item.id === get(values, fieldName)) ?? options.find(item => item.name === get(values, newFieldName))
  }

  return (
    <Autocomplete
      value={getDropdownValue(name)}
      onChange={(event, newValue) => {
        if (newValue) formik.setFieldValue(name, newValue?.id)
      }}
      fullWidth
      clearOnBlur={false}
      onInputChange={(event, newInputValue) => {
        const findIndex = options.findIndex(opt => opt.name === newInputValue)
        if (findIndex < 0) {
          formik.setFieldValue(name, 0)

          if (name.includes('Father')) {
            if (name.includes('MoreInfo')) formik.setFieldValue('studentMoreInfo.newFatherHolyName', newInputValue)
            else formik.setFieldValue('newFatherHolyName', newInputValue)
          } else if (name.includes('Mother')) {
            if (name.includes('MoreInfo')) formik.setFieldValue('studentMoreInfo.newMotherHolyName', newInputValue)
            else formik.setFieldValue('newMotherHolyName', newInputValue)
          } else {
            formik.setFieldValue('newHolyName', newInputValue)
          }
        }
      }}
      id={name}
      options={options}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.name, inputValue)
        const parts = parse(option.name, matches)
        return (
          <div>
            {parts.map((part, index) => (
              <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
            ))}
          </div>
        )
      }}
      getOptionLabel={option => option.name}
      renderInput={params => (
        <TextField
          label={label}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          fullWidth={true}
          {...params}
        />
      )}
    />
  )
}
