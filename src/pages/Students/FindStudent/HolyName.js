import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { TextField, IconButton, Grid, ClickAwayListener, InputAdornment } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBible } from '@fortawesome/free-solid-svg-icons'
import Autocomplete from '@material-ui/lab/Autocomplete'

import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

import { HolyNameQuery } from 'recoils/selectors'

const HolyName = ({ formData, holyname, field, handleSaveHolyName, isEditable, isMoreInfo = false }) => {
  const [showAction, setShowAction] = useState(false)
  const [localValue, setLocalValue] = useState()
  const [oldValue, setOldValue] = useState()
  const lstHolyName = useRecoilValue(HolyNameQuery)

  const handleCancel = () => {
    if (oldValue) {
      isMoreInfo ? formData.setFieldValue(field, oldValue) : formData.setFieldValue(`studentMoreInfo.${field}`, oldValue)
      setOldValue(null)
    }
    setShowAction(false)
  }

  const handleOk = () => {
    setOldValue(localValue)
    handleSaveHolyName(field, localValue, isMoreInfo)
    setShowAction(false)
  }

  return (
    <>
      {isEditable && (
        <>
          <ClickAwayListener onClickAway={handleCancel}>
            <Grid container item xs={12} sm={6} lg={4}>
              <Grid item xs={12}>
                <Autocomplete
                  disableClearable
                  // value={lstHolyName[lstHolyName.findIndex((item) => item.id === (isMoreInfo ? formData.values[`studentMoreInfo.${field}`] : formData.values[field]))] || lstHolyName[0]}
                  value={holyname}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setLocalValue(newValue?.id)
                      isMoreInfo ? formData.setFieldValue(field, newValue?.id) : formData.setFieldValue(`studentMoreInfo.${field}`, newValue?.id)
                      setShowAction(true)
                    }
                  }}
                  onOpen={() => {
                    setOldValue(holyname?.id)
                  }}
                  id={`stuholyname-${field}`}
                  options={lstHolyName}
                  renderOption={(option, { inputValue }) => {
                    const matches = match(option.name, inputValue)
                    const parts = parse(option.name, matches)
                    return (
                      <div>
                        {parts.map((part, index) => (
                          <span key={`stuf-holy-${index}`} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                            {part.text}
                          </span>
                        ))}
                      </div>
                    )
                  }}
                  getOptionLabel={option => option?.name}
                  renderInput={params => {
                    params = {
                      ...params,
                      InputProps: {
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faBible} />
                          </InputAdornment>
                        )
                      }
                    }
                    return (
                      <TextField
                        label="Tên Thánh"
                        InputLabelProps={{
                          shrink: true
                        }}
                        variant="outlined"
                        fullWidth
                        {...params}
                      />
                    )
                  }}
                />
              </Grid>
              {showAction && (
                <Grid container item xs={12} alignContent="flex-end" justifyContent="flex-end" alignItems="flex-end" style={{ textAlign: 'right' }}>
                  <Grid item xs={12}>
                    <IconButton size="medium" edge="end" color="primary" onClick={handleOk}>
                      <DoneIcon />
                    </IconButton>
                    <IconButton size="medium" edge="end" onClick={handleCancel}>
                      <ClearIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </ClickAwayListener>
        </>
      )}
      {!isEditable && (
        <Grid item xs={12} sm={6} lg={4}>
          <TextField
            value={holyname?.name}
            label="Tên Thánh"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faBible} />
                </InputAdornment>
              ),
              readOnly: true
            }}
          />
        </Grid>
      )}
    </>
  )
}

export default HolyName
