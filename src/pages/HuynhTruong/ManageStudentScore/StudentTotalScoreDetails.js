import React, { useEffect, useState } from 'react'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import accounting from 'accounting'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'
import { useRecoilState, useSetRecoilState } from 'recoil'
import _ from 'lodash'

import { Morality } from 'app/enums'

import config from 'config'
import { doPost } from 'utils/axios'
import { ReloadStudentList, PageYOffset } from './recoil'

import { toastState } from 'recoils/atoms'

import sessionHelper from 'utils/sessionHelper'
import ScoreUtils from 'utils/ScoreUtils'
import StringUtils from 'utils/StringUtils'

const initValue = { morality: 'Tốt', isActive: true }

const StudentTotalScoreDetails = ({ student }) => {
  const setReloadStudent = useSetRecoilState(ReloadStudentList)
  const setPageYOffset = useSetRecoilState(PageYOffset)

  const [toast, setToast] = useRecoilState(toastState)
  const [oldVal, setOldVal] = useState()

  const validationSchema = Yup.object({
    comment: Yup.string().min(0).max(250, 'Không nhập nhiều hơn 250 ký tự.').nullable()
  })

  const formData = useFormik({
    initialValues: initValue,
    validationSchema,
    validateOnChange: true,
    validateOnMount: false,
    enableReinitialize: true
  })

  const TextField_Props = (name, label, maxLength, decimalSeparator) => {
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
        maxLength: maxLength,
        decimalseparator: decimalSeparator,
        readOnly: !formData.values['isActive']
      }
    }
  }

  useEffect(() => {
    const newFormData = student?.total[0] ?? initValue

    formData.resetForm({ values: newFormData })
    setOldVal(newFormData)
  }, [student])

  const calculateAvgTotal = () => {
    return accounting.toFixed(((student?.semesterOne[0]?.average ?? 0) + (student?.semesterTwo[0]?.average ?? 0) * 2) / 3, 1)
  }
  const calculateRating = () => {
    const avg = Number(calculateAvgTotal())
    return ScoreUtils.calculateRating(avg)
  }

  const saveTotalScore = async e => {
    e.preventDefault()
    setPageYOffset(window.pageYOffset)

    if (!_.isEqual(StringUtils.toString(oldVal), StringUtils.toString(formData.values))) {
      let data = {
        ...formData.values,
        // classId: student.classId,
        // studentId: student.id,
        // scholasticId: sessionHelper().scholasticId,
        avgSemesterOne: student?.semesterOne[0]?.average,
        avgSemesterTwo: student?.semesterTwo[0]?.average,
        avgTotal: calculateAvgTotal(),
        ranking: calculateRating(),
        userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
      }
      try {
        const res = await doPost(`student/updateTotal`, data)

        if (res && res.data.success) {
          setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
          setReloadStudent(old => old + 1)
        }
      } catch (err) {
        setToast({ ...toast, open: true, message: err.message, type: 'error' })
      }
    }
  }

  // const isDisabledSaveButton = () => {
  //   return (
  //     !formData.isValid ||
  //     student?.semesterOne.length === 0 ||
  //     student?.semesterTwo.length === 0 ||
  //     !(student?.total.length === 0 ? formData.values['isActive'] : student?.total[0]?.isActive)
  //   )
  // }

  return (
    <>
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="TB HKI"
          type="text"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          InputProps={{
            readOnly: true
          }}
          value={student?.semesterOne[0]?.average ?? ''}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="TB HKII"
          type="text"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          InputProps={{
            readOnly: true
          }}
          value={student?.semesterTwo[0]?.average ?? ''}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="TB Cả năm"
          type="text"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          InputProps={{
            readOnly: true
          }}
          value={calculateAvgTotal()}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          label="Xếp loại"
          type="text"
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          InputProps={{
            readOnly: true
          }}
          value={calculateRating()}
        />
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Hạnh kiểm</InputLabel>
          <Select
            inputlabelprops={{ shrink: true }}
            inputProps={{
              name: 'total-morality',
              id: 'default-total-morality',
              readOnly: !formData.values['isActive']
            }}
            value={formData.values['morality'] ?? 'Tốt'}
            onChange={e => formData.setFieldValue('morality', e.target.value)}
            onBlur={saveTotalScore}
            label="Hạnh kiểm"
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left'
              },
              getContentAnchorEl: null
            }}>
            {Morality.map(m => (
              <MenuItem key={m.Id + 1} value={m.Name}>
                {m.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <TextField {...TextField_Props('comment', `Nhận xét`, 250)} type="text" onBlur={saveTotalScore} />
      </Grid>
      {/* <Grid container item xs={12} justify="flex-end">
        <Button variant="contained" color="primary" onClick={saveTotalScore} disabled={isDisabledSaveButton()}>
          Lưu và khóa
        </Button>
      </Grid> */}
    </>
  )
}

export default StudentTotalScoreDetails
