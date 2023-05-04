import React, { useState } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, FormGroup, FormControlLabel, FormControl, Divider, Box, Input } from '@material-ui/core'

import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'
import ButtonLoading from 'components/UI/ButtonLoading'
import { AbsentMode } from 'app/enums'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import ListItemText from '@material-ui/core/ListItemText'

import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import moment from 'moment'

import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { toastState } from 'recoils/atoms'

import { LoadListStudent, LoadSundayList, OpenAbsentForm, ReloadStudentAbsent } from './recoil'

const initForm = { StudentId: '', Reason: '', DateAbsents: [], IsActive: true, Mode: 0, HasPermission: true, Modes: [] }

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const AbsentForm = () => {
  const lstStudent = useRecoilValue(LoadListStudent)
  const lstSunday = useRecoilValue(LoadSundayList)
  const setReloadAbsent = useSetRecoilState(ReloadStudentAbsent)

  const [openForm, setOpenForm] = useRecoilState(OpenAbsentForm)
  const [toast, setToast] = useRecoilState(toastState)
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    StudentId: Yup.string().required('Không để trống'),
    Modes: Yup.array().min(1, 'Phải chọn 1 trong 2 loại ngày nghỉ.'),
    DateAbsents: Yup.array().min(1, 'Phải chọn ít nhất 1 ngày nghỉ.')
  })

  const formData = useFormik({
    initialValues: { ...initForm },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: { StudentId: 'Required' }
  })

  const TextField_Props = (name, label, maxLength) => {
    const { values, errors, touched, handleBlur, handleChange } = formData
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      value: values[name] ?? '',
      onBlur: handleBlur,
      onChange: handleChange,
      inputProps: {
        maxLength: maxLength
      }
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)

    let value = formData.values

    try {
      var res = await doPost(`student/absent`, {
        ...value,
        userId: sessionHelper().userId,
        classId: sessionHelper().classId,
        scholasticId: sessionHelper().scholasticId,
        userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
      })

      if (res && res.data.success) {
        setLoading(false)
        setOpenForm(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadAbsent(reload => reload + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      formData.resetForm({ values: initForm })
    }
  }

  const handleChange = (date, name) => {
    formData.setFieldValue(name, date)
  }

  const handleCloseForm = (e, reason) => {
    if (reason && reason === 'backdropClick') return

    if (!loading) {
      formData.resetForm({ values: initForm })
      setOpenForm(false)
    }
  }

  const handleCheckMode = e => {
    const val = Number(e.target.value)
    const itemExist = formData.values?.Modes.find(v => v === val)
    if (itemExist) {
      formData.setFieldValue(
        'Modes',
        formData.values?.Modes.filter(i => i !== val)
      )
    } else {
      formData.setFieldValue('Modes', [...formData.values?.Modes, val])
    }
  }

  return (
    <Dialog open={openForm} onClose={handleCloseForm}>
      <DialogTitle>Điểm danh</DialogTitle>
      <Divider />
      <DialogContent style={{ padding: '20px 10px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="multi-date-absent-label" shrink style={{ marginLeft: '15px' }}>
                Chọn ngày nghỉ
              </InputLabel>
              <Select
                labelId="multi-date-absent-label"
                id="multiple-chip"
                multiple
                value={formData.values['DateAbsents']}
                onChange={e => handleChange(e.target.value, 'DateAbsents')}
                input={<Input />}
                renderValue={selected => (
                  <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(value => (
                      <Chip key={value} label={moment(value).format('DD/MM/YYYY')} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}>
                {lstSunday.map(item => (
                  <MenuItem key={item} value={item}>
                    <Checkbox checked={formData.values['DateAbsents'].indexOf(item) > -1} />
                    <ListItemText primary={moment(item).format('DD/MM/YYYY')} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              onChange={(event, newValue) => {
                if (newValue) formData.setFieldValue('StudentId', newValue?.id)
              }}
              disableClearable
              noOptionsText="Không có Đoàn sinh phù hợp"
              id="studentId"
              options={lstStudent}
              renderOption={(option, { inputValue }) => {
                const matches = match(option.name, inputValue)
                const parts = parse(option.name, matches)
                return (
                  <div>
                    {parts.map((part, index) => (
                      <span key={`stu-name-${index}-${part.text}`} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}
                  </div>
                )
              }}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField
                  label="Đoàn sinh"
                  variant="outlined"
                  fullWidth={true}
                  {...params}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row className="p-1">
                <FormControlLabel control={<StyledCheckbox onChange={handleCheckMode} value={AbsentMode.Mass} />} label="Nghỉ lễ" labelPlacement="end" />
                <FormControlLabel control={<StyledCheckbox onChange={handleCheckMode} value={AbsentMode.Class} />} label="Nghỉ học" labelPlacement="end" />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row className="p-1">
                <FormControlLabel
                  onChange={e => formData.setFieldValue('HasPermission', e.target.checked)}
                  checked={formData.values['HasPermission']}
                  control={<StyledRadio color="primary" />}
                  label="Có phép"
                  labelPlacement="end"
                />
                <FormControlLabel
                  onChange={e => formData.setFieldValue('HasPermission', !e.target.checked)}
                  checked={!formData.values['HasPermission']}
                  control={<StyledRadio color="primary" />}
                  label="Không phép"
                  labelPlacement="end"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField {...TextField_Props('Reason', 'Lý do', 250)} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6} md={3}>
            <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={handleSave} disabled={!formData.isValid} />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button size="large" onClick={handleCloseForm} variant="outlined" fullWidth>
              Quay về
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default AbsentForm
