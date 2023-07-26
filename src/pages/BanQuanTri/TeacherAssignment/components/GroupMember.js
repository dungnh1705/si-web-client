import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { nanoid } from 'nanoid'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Autocomplete } from '@material-ui/lab'
import { useRecoilValue } from 'recoil'
import { UsersAvailableSelector } from '../recoil'

export default function GroupMember() {
  const usersAvailable = useRecoilValue(UsersAvailableSelector)

  return (
    <Grid container spacing={3} justifyContent={'flex-start'} alignItems={'center'}>
      <Grid item xs={12}>
        Thành viên
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple={true}
          fullWidth
          className="w-100"
          noOptionsText="Không tìm thấy Huynh Trưởng phù hợp"
          onChange={(e, newValue) => {}}
          disableClearable
          id={`leader-${nanoid(2)}`}
          options={usersAvailable}
          renderOption={(option, { inputValue }) => {
            const matches = match(`${option.holyName?.name} ${option.firstName} ${option.lastName}`, inputValue)
            const parts = parse(`${option.holyName?.name} ${option.firstName} ${option.lastName}`, matches)
            return (
              <div className="d-flex align-items-center">
                <div className="p-2">
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </div>
              </div>
            )
          }}
          getOptionLabel={option => option.fullName}
          renderInput={params => (
            <TextField
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              fullWidth
              {...params}
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
