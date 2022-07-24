import React, { useState } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, FormGroup, FormControlLabel, FormControl, Divider } from '@material-ui/core'

import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'
import ButtonLoading from 'components/UI/ButtonLoading'
import { AbsentMode } from 'app/enums'

import Autocomplete from '@material-ui/lab/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { KeyboardDatePicker } from '@material-ui/pickers'
import config from 'config'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { toastState } from 'recoils/atoms'

import { LoadListStudent, OpenAbsentForm, ReloadStudentAbsent } from './recoil'

const initForm = { StudentId: '', Reason: '', DateAbsent: new Date(), IsActive: true, Mode: 0, HasPermission: true, Modes: [] }

const AbsentForm = () => {
  let lstStudent = useRecoilValue(LoadListStudent)
  let [openForm, setOpenForm] = useRecoilState(OpenAbsentForm)
  let [toast, setToast] = useRecoilState(toastState)
  let setReloadAbsent = useSetRecoilState(ReloadStudentAbsent)
  let [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    StudentId: Yup.string().required('Không để trống'),
    Modes: Yup.array().min(1, 'Phải chọn 1 trong 2 loại ngày nghỉ.')
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

  const DatePicker_Props = (name, label) => {
    const { values, errors, touched, handleBlur, handleChange } = formData
    return {
      name,
      label,
      fullWidth: true,
      inputVariant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      format: 'dd/MM/yyyy',
      value: values[name] ?? null,
      autoOk: true,
      onBlur: handleBlur,
      onChange: handleChange,
      KeyboardButtonProps: {
        'aria-label': 'change date'
      }
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)

    let value = formData.values

    try {
      var res = await doPost(`${config.ApiEndpoint}/student/absent`, {
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

  const handleChangeDate = (date, name) => {
    formData.setFieldValue(name, date)
  }

  const handleCloseForm = () => {
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
            <KeyboardDatePicker {...DatePicker_Props('DateAbsent', 'Ngày nghỉ')} onChange={date => handleChangeDate(date, 'DateAbsent')} />
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
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  fullWidth={true}
                  {...params}
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
          <Grid item xs={6} md={2}>
            <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={handleSave} disabled={!formData.isValid} />
          </Grid>
          <Grid item xs={6} md={2}>
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
