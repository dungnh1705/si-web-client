import React, { useEffect, useState } from 'react'
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { useRecoilState, useSetRecoilState } from 'recoil'
// import accounting from 'accounting'
import _ from 'lodash'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'

import { Morality } from 'app/enums'
import { toastState, PageYOffset } from 'recoils/atoms'
import { doPost } from 'utils/axios'
import NumberFormatCustom from 'utils/NumberFormatCustom'
import sessionHelper from 'utils/sessionHelper'
import ScoreUtils from 'utils/ScoreUtils'
import StringUtils from 'utils/StringUtils'

import { ReloadStudentList } from './recoil'

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

  // const calculateAvgTotal = () => {
  //   return accounting.toFixed(((student?.semesterOne[0]?.average ?? 0) + (student?.semesterTwo[0]?.average ?? 0) * 2) / 3, 1)
  // }

  // const calculateRating = () => {
  //   const avg = Number(calculateAvgTotal())
  //   return ScoreUtils.calculateRating(avg)
  // }

  const saveTotalScore = async e => {
    e.preventDefault()
    setPageYOffset(window.pageYOffset)

    if (!_.isEqual(StringUtils.toString(oldVal), StringUtils.toString(formData.values))) {
      const avgTotal = ScoreUtils.calculateAvgTotal(oldVal, formData.values)

      const data = {
        ...formData.values,
        // classId: student.classId,
        // studentId: student.id,
        // scholasticId: sessionHelper().scholasticId,
        avgSemesterOne: student?.semesterOne[0]?.average,
        avgSemesterTwo: student?.semesterTwo[0]?.average,
        avgTotal: avgTotal,
        ranking: ScoreUtils.calculateRating(avgTotal),
        userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
      }
      try {
        const res = await doPost(`student/updateTotal`, data)

        if (res && res.data.success) {
          setOldVal(data)
          setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
          setReloadStudent(old => old + 1)
          formData.resetForm({ values: data })
        }
      } catch (err) {
        setToast({ ...toast, open: true, message: err.message, type: 'error' })
      }
    }
  }

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
          {...TextField_Props('avgTotal', 'TB Cả Năm', 3)}
          type="text"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
          onBlur={saveTotalScore}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          {...TextField_Props('ranking', 'Xếp loại')}
          type="text"
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Đạo đức</InputLabel>
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
            label="Đạo đức"
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
    </>
  )
}

export default StudentTotalScoreDetails
