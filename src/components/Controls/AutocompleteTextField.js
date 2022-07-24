import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { get } from 'lodash'

export default function AutocompleteTextField({ formik, name, label = '', options = [] }) {
  const { values } = formik

  return (
    <Autocomplete
      value={options.find(item => item.id === get(values, name))}
      onChange={(event, newValue) => {
        if (newValue) formik.setFieldValue(name, newValue?.id)
      }}
      fullWidth
      freeSolo
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
