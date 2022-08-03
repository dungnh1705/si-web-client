import React, { useEffect, useState } from 'react'
import { Grid, MenuItem, TextField, FormControl, InputLabel, Select } from '@material-ui/core'
import { useFormik } from 'formik'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { doPost } from 'utils/axios'
import _ from 'lodash'

import { Morality, SemesterEnum } from 'app/enums'
import NumberFormatCustom from 'utils/NumberFormatCustom'
import Yup from 'utils/Yup'
import sessionHelper from 'utils/sessionHelper'
import StringUtils from 'utils/StringUtils'
import ScoreUtils from 'utils/ScoreUtils'
import { PageYOffset, toastState } from 'recoils/atoms'

import { ReloadStudentList, WorkingSemester } from './recoil'

const initialValues = { oldTest: '', fifteenTest: '', lessonTest: '', semesterTest: '', average: '', morality: 'Tốt', comment: '', isActive: true }

const StudentScoreDetails = ({ student }) => {
  const setReloadStudent = useSetRecoilState(ReloadStudentList)
  const setPageYOffset = useSetRecoilState(PageYOffset)

  const [toast, setToast] = useRecoilState(toastState)
  const workingSemester = useRecoilValue(WorkingSemester)
  const [oldValue, setOldValue] = useState()

  const validationSchema = Yup.object({
    oldTest: Yup.number('Phải nhập số').min(0).max(9, 'Không được nhập lớn hơn 9').nullable(),
    fifteenTest: Yup.number('Phải nhập số').min(0).max(10, 'Không được nhập lớn hơn 10').nullable(),
    lessonTest: Yup.number('Phải nhập số').min(0).max(10, 'Không được nhập lớn hơn 10').nullable(),
    semesterTest: Yup.number('Phải nhập số').min(0).max(10, 'Không được nhập lớn hơn 10').nullable(),
    comment: Yup.string().min(0).max(250, 'Không nhập nhiều hơn 250 ký tự').nullable(),
    average: Yup.number('Phải nhập số').min(0).max(10, 'Không được nhập lớn hơn 10').nullable()
  })

  const formData = useFormik({
    initialValues: initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    enableReinitialize: true
  })

  const TextField_Props = (name, label, maxLength, decimalSeparator) => {
    const { values, errors, handleBlur, handleChange } = formData

    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: errors[name],
      helperText: errors[name],
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
    const newFormData =
      workingSemester === SemesterEnum.semesterOne
        ? student.semesterOne?.length > 0
          ? { ...student.semesterOne[0] }
          : initialValues
        : workingSemester === SemesterEnum.semesterTwo
        ? student.semesterTwo?.length > 0
          ? { ...student.semesterTwo[0] }
          : initialValues
        : initialValues

    setOldValue(newFormData)

    formData.resetForm({ values: newFormData })
  }, [workingSemester])

  const saveScores = async e => {
    e.preventDefault()

    if (formData.isValid) {
      setPageYOffset(window.pageYOffset)

      if (!_.isEqual(StringUtils.toString(oldValue), StringUtils.toString(formData.values))) {
        const newAverage = ScoreUtils.calculateAvgScore(workingSemester, oldValue, formData.values)

        const data = {
          ...formData.values,
          average: newAverage,
          ranking: ScoreUtils.calculateRating(newAverage)
        }

        try {
          var res =
            workingSemester === SemesterEnum.semesterOne
              ? await doPost(`student/updateSemesterOne`, {
                  ...data,
                  classId: student.classId,
                  studentId: student.id,
                  scholasticId: sessionHelper().scholasticId,
                  userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
                })
              : await doPost(`student/updateSemesterTwo`, {
                  ...data,
                  classId: student.classId,
                  studentId: student.id,
                  scholasticId: sessionHelper().scholasticId,
                  userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
                })

          if (res && res.data.success) {
            // console.log({ ...data })
            setOldValue(data)
            setReloadStudent(reload => reload + 1)
            setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
            formData.resetForm({ values: data })
          }
        } catch (err) {
          setToast({ ...toast, open: true, message: err.message, type: 'error' })
        }
      }
    }
  }

  // const isDisabledButton = () => {
  //   return !formData.isValid || !formData.values['isActive'] || (workingSemester === 302 ? !student.semesterOne[0]?.average : false)
  // }

  return (
    <>
      <Grid item xs={2} sm={3}>
        <TextField
          {...TextField_Props('oldTest', `Miệng`, 3)}
          type="text"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
          onBlur={saveScores}
        />
      </Grid>
      <Grid item xs={2} sm={3}>
        <TextField
          {...TextField_Props('fifteenTest', `15'`, 3)}
          type="text"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
          onBlur={saveScores}
        />
      </Grid>
      <Grid item xs={2} sm={3}>
        <TextField
          {...TextField_Props('lessonTest', `1 Tiết`, 4)}
          type="text"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
          onBlur={saveScores}
        />
      </Grid>
      <Grid item xs={2} sm={3}>
        <TextField
          {...TextField_Props('semesterTest', `Học kỳ`, 4)}
          type="text"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
          onBlur={saveScores}
        />
      </Grid>
      <Grid item xs={2} sm={3}>
        <TextField
          {...TextField_Props('average', 'TB', 3)}
          type="text"
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
          onBlur={saveScores}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          {...TextField_Props('ranking', 'Xếp loại')}
          type="text"
          InputProps={{
            readOnly: true
          }}
        />
      </Grid>
      <Grid item xs={5} sm={4}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Hạnh kiểm</InputLabel>
          <Select
            inputlabelprops={{ shrink: true }}
            inputProps={{
              name: 'select-morality',
              id: 'default-morality',
              readOnly: !formData.values['isActive']
            }}
            value={formData.values['morality'] ?? 'Tốt'}
            onChange={e => {
              formData.setFieldValue('morality', e.target.value)
            }}
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
            }}
            onBlur={saveScores}>
            {Morality.map(m => (
              <MenuItem key={m.Id} value={m.Name}>
                {m.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField {...TextField_Props('comment', `Nhận xét`, 250)} type="text" onBlur={saveScores} />
      </Grid>
      {/* <Grid container item xs={12} justify="flex-end">
        <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={saveScores} disabled={isDisabledButton()} />
      </Grid> */}
    </>
  )
}

export default StudentScoreDetails
