// import React, { useEffect, useState } from 'react'
// import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
// import { useRecoilState, useSetRecoilState } from 'recoil'
// // import accounting from 'accounting'
// import _ from 'lodash'
// import { useFormik } from 'formik'
// import Yup from 'utils/Yup'

// import { Morality } from 'app/enums'
// import { toastState, PageYOffset } from 'recoils/atoms'
// import { doPost } from 'utils/axios'
// import NumberFormatCustom from 'utils/NumberFormatCustom'
// import sessionHelper from 'utils/sessionHelper'
// import ScoreUtils from 'utils/ScoreUtils'
// import StringUtils from 'utils/StringUtils'

// import { ReloadStudentList } from './recoil'

// const initValue = { morality: 'Tốt', isActive: true }

// const StudentTotalScoreDetails = ({ student }) => {
//   const setReloadStudent = useSetRecoilState(ReloadStudentList)
//   const setPageYOffset = useSetRecoilState(PageYOffset)

//   const [toast, setToast] = useRecoilState(toastState)
//   const [oldVal, setOldVal] = useState()

//   const validationSchema = Yup.object({
//     comment: Yup.string().min(0).max(250, 'Không nhập nhiều hơn 250 ký tự.').nullable()
//   })

//   const formData = useFormik({
//     initialValues: initValue,
//     validationSchema,
//     validateOnChange: true,
//     validateOnMount: false,
//     enableReinitialize: true
//   })

//   const TextField_Props = (name, label, maxLength, decimalSeparator) => {
//     const { values, errors, touched, handleBlur, handleChange } = formData

//     return {
//       name,
//       label,
//       fullWidth: true,
//       variant: 'outlined',
//       error: errors[name] && touched[name],
//       helperText: errors[name] && touched[name] && errors[name],
//       InputLabelProps: { shrink: true },
//       value: values[name] ?? '',
//       onBlur: handleBlur,
//       onChange: handleChange,
//       inputProps: {
//         maxLength: maxLength,
//         decimalseparator: decimalSeparator,
//         readOnly: !formData.values['isActive']
//       }
//     }
//   }

//   useEffect(() => {
//     const newFormData = student?.total[0] ?? initValue

//     formData.resetForm({ values: newFormData })
//     setOldVal(newFormData)
//   }, [student])

//   // const calculateAvgTotal = () => {
//   //   return accounting.toFixed(((student?.semesterOne[0]?.average ?? 0) + (student?.semesterTwo[0]?.average ?? 0) * 2) / 3, 1)
//   // }

//   // const calculateRating = () => {
//   //   const avg = Number(calculateAvgTotal())
//   //   return ScoreUtils.calculateRating(avg)
//   // }

//   const saveTotalScore = async e => {
//     e.preventDefault()
//     setPageYOffset(window.pageYOffset)

//     if (!_.isEqual(StringUtils.toString(oldVal), StringUtils.toString(formData.values))) {
//       const avgTotal = ScoreUtils.calculateAvgTotal(oldVal, formData.values)

//       const data = {
//         ...formData.values,
//         // classId: student.classId,
//         // studentId: student.id,
//         // scholasticId: sessionHelper().scholasticId,
//         avgSemesterOne: student?.semesterOne[0]?.average,
//         avgSemesterTwo: student?.semesterTwo[0]?.average,
//         avgTotal: avgTotal,
//         ranking: ScoreUtils.calculateRating(avgTotal),
//         userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
//       }
//       try {
//         const res = await doPost(`student/updateTotal`, data)

//         if (res && res.data.success) {
//           setOldVal(data)
//           setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
//           setReloadStudent(old => old + 1)
//           formData.resetForm({ values: data })
//         }
//       } catch (err) {
//         setToast({ ...toast, open: true, message: err.message, type: 'error' })
//       }
//     }
//   }

//   return (
//     <>
//       <Grid item xs={3}>
//         <TextField
//           fullWidth
//           label="TB HKI"
//           type="text"
//           InputLabelProps={{
//             shrink: true
//           }}
//           variant="outlined"
//           InputProps={{
//             readOnly: true
//           }}
//           value={student?.semesterOne[0]?.average ?? ''}
//         />
//       </Grid>
//       <Grid item xs={3}>
//         <TextField
//           fullWidth
//           label="TB HKII"
//           type="text"
//           InputLabelProps={{
//             shrink: true
//           }}
//           variant="outlined"
//           InputProps={{
//             readOnly: true
//           }}
//           value={student?.semesterTwo[0]?.average ?? ''}
//         />
//       </Grid>
//       <Grid item xs={3}>
//         <TextField
//           {...TextField_Props('avgTotal', 'TB Cả Năm', 3)}
//           type="text"
//           InputProps={{
//             inputComponent: NumberFormatCustom
//           }}
//           onBlur={saveTotalScore}
//         />
//       </Grid>
//       <Grid item xs={3}>
//         <TextField
//           {...TextField_Props('ranking', 'Xếp loại')}
//           type="text"
//           InputProps={{
//             readOnly: true
//           }}
//         />
//       </Grid>
//       <Grid item xs={3}>
//         <FormControl variant="outlined" fullWidth>
//           <InputLabel>Đạo đức</InputLabel>
//           <Select
//             inputlabelprops={{ shrink: true }}
//             inputProps={{
//               name: 'total-morality',
//               id: 'default-total-morality',
//               readOnly: !formData.values['isActive']
//             }}
//             value={formData.values['morality'] ?? undefined}
//             onChange={e => formData.setFieldValue('morality', e.target.value)}
//             onBlur={saveTotalScore}
//             label="Đạo đức"
//             MenuProps={{
//               anchorOrigin: {
//                 vertical: 'bottom',
//                 horizontal: 'left'
//               },
//               transformOrigin: {
//                 vertical: 'top',
//                 horizontal: 'left'
//               },
//               getContentAnchorEl: null
//             }}>
//             {Morality.map(m => (
//               <MenuItem key={m.Id + 1} value={m.Name}>
//                 {m.Name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>
//       <Grid item xs={9}>
//         <TextField {...TextField_Props('comment', `Nhận xét`, 250)} type="text" onBlur={saveTotalScore} />
//       </Grid>
//     </>
//   )
// }

// export default StudentTotalScoreDetails

//
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import red from '@material-ui/core/colors/red'
import { makeStyles, Hidden } from '@material-ui/core'

import StyledCheckbox from 'components/UI/StyledCheckbox'
import { AbsentMode, SemesterEnum } from 'app/enums'
import { toastState } from 'recoils/atoms'
import sessionHelper from 'utils/sessionHelper'
import { doGet, doPost } from 'utils/axios'

import { SemesterSelected } from './recoil'
import ScoreTextField from 'components/Controls/ScoreTextField'

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    backgroundColor: 'white',
    zIndex: 1,

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2.5px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentTotalScoreDetails = ({ studentId }) => {
  const classStyle = useStyle()

  const [student, setStudent] = useState(undefined)
  const [reload, setReload] = useState(0)
  const [beUpClass, setBeUpClass] = useState(false)

  const semester = useRecoilValue(SemesterSelected)
  const [toast, setToast] = useRecoilState(toastState)
  const handleRowClick = e => {
    e.preventDefault()
  }

  const handleCheckUpClass = async e => {
    const val = e.target.checked
    const { scholasticId, firstName, lastName } = sessionHelper()

    const newData = {
      scholasticId,
      userFullName: `${firstName} ${lastName}`,
      studentId: student.id,
      beUpClass: val
    }

    try {
      const res = await doPost(`student/updateBeUpClass`, newData)
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setBeUpClass(val)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.data.message, type: 'error' })
    }
  }

  const sumAbsents = () => {
    let classAb, massAb

    if (semester === SemesterEnum.semesterOne) {
      classAb = student?.absents?.filter(ab => ab.absentMode === AbsentMode.Class && ab.semesterCode === 1)
      massAb = student?.absents?.filter(ab => ab.absentMode === AbsentMode.Mass && ab.semesterCode === 1)
    }

    if (semester === SemesterEnum.semesterTwo) {
      classAb = student?.absents?.filter(ab => ab.absentMode === AbsentMode.Class && ab.semesterCode === 2)
      massAb = student?.absents?.filter(ab => ab.absentMode === AbsentMode.Mass && ab.semesterCode === 2)
    }

    if (semester === SemesterEnum.total) {
      classAb = student?.absents?.filter(ab => ab.absentMode === AbsentMode.Class)
      massAb = student?.absents?.filter(ab => ab.absentMode === AbsentMode.Mass)
    }

    return {
      classHasPermission: classAb?.filter(ca => ca.hasPermission)?.length > 0 ? classAb?.filter(ca => ca.hasPermission)?.length : '',
      classNonPermission: classAb?.filter(ca => !ca.hasPermission)?.length > 0 ? classAb?.filter(ca => !ca.hasPermission)?.length : '',
      massHasPermission: massAb?.filter(ca => ca.hasPermission)?.length > 0 ? massAb?.filter(ca => ca.hasPermission)?.length : '',
      massNonPermission: massAb?.filter(ca => !ca.hasPermission)?.length > 0 ? massAb?.filter(ca => !ca.hasPermission)?.length : ''
    }
  }

  async function handleSaveScore(name, newVal) {
    const { firstName, lastName, scholasticId } = sessionHelper()
    const avg = name === 'average' ? (newVal === 0 || !newVal ? null : newVal) : null
    const newScore = { ...student.score, [name]: newVal, average: avg, userFullName: `${firstName} ${lastName}`, semesterCode: semester, studentId: student.id, scholasticId }

    try {
      const res = await doPost(`student/updateStudentScore`, newScore)
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: 'Cập nhật thành công', type: 'success' })

        setReload(old => old + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.data.message, type: 'error' })
    }
  }

  useEffect(() => {
    async function fetch() {
      const { scholasticId } = sessionHelper()

      const res = await doGet('student/getStudentScoreInTeam', { studentId, semesterCode: semester, scholasticId })
      if (res && res.data.success) {
        const { data } = res.data

        setStudent({ ...student, ...data })
      }
    }
    if (!student) fetch()
  }, [])

  useEffect(() => {
    if (student?.score) {
      setBeUpClass(student?.score?.beUpClass)
    }
  }, [student])

  useEffect(() => {
    async function fetch() {
      const { scholasticId } = sessionHelper()

      const res = await doGet('student/getStudentScoreInTeam', { studentId, semesterCode: semester, scholasticId })
      if (res && res.data.success) {
        const { data } = res.data

        setStudent({ ...student, ...data })
      }
    }

    if (reload > 0) {
      fetch()
    }
  }, [reload])

  return (
    <>
      {student && (semester === SemesterEnum.semesterOne || semester === SemesterEnum.semesterTwo) && (
        <tr
          className="tr__active"
          style={{
            backgroundColor: student.score?.average < 3.5 && student.score?.average > 0 ? red[200] : 'inherit'
          }}>
          <td className={classStyle.pinCell} onClick={handleRowClick}>
            {student.holyName}&nbsp;
            <Hidden mdUp>
              <br />
            </Hidden>
            {student.firstName} {student.lastName}
          </td>
          {/* <td>
            <ScoreTextField value={student.score?.oldTest} handleSave={handleSaveScore} name="oldTest" isNumber minWidth="80px" />
          </td> */}
          <td>
            <ScoreTextField value={student.score?.fifteenTest} handleSave={handleSaveScore} name="fifteenTest" isNumber minWidth="80px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.lessonTest} handleSave={handleSaveScore} name="lessonTest" isNumber minWidth="80px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.semesterTest} handleSave={handleSaveScore} name="semesterTest" isNumber minWidth="80px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.average} handleSave={handleSaveScore} name="average" isNumber minWidth="80px" />
          </td>
          <td>{student.score?.ranking}</td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
          <td>
            <ScoreTextField value={student.score?.morality} handleSave={handleSaveScore} name="morality" minWidth="100px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.comment} handleSave={handleSaveScore} name="comment" minWidth="700px" />
          </td>
        </tr>
      )}

      {student && semester === SemesterEnum.total && (
        <tr
          style={{
            backgroundColor: student.score?.avgTotal < 3.5 && student.score?.average > 0 ? red[100] : 'inherit'
          }}>
          <td onClick={handleRowClick} className="td--active">
            {student.holyName}&nbsp;
            <Hidden mdUp>
              <br />
            </Hidden>
            {student.firstName} {student.lastName}
          </td>
          <td>
            <ScoreTextField value={student.score?.avgSemesterOne} handleSave={handleSaveScore} name="avgSemesterOne" isNumber minWidth="80px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.avgSemesterTwo} handleSave={handleSaveScore} name="avgSemesterTwo" isNumber minWidth="80px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.avgTotal} handleSave={handleSaveScore} name="avgTotal" isNumber minWidth="80px" />
          </td>
          <td>{student.score?.ranking ?? ''}</td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
          <td>
            <ScoreTextField value={student.score?.morality} handleSave={handleSaveScore} name="morality" minWidth="100px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.comment} handleSave={handleSaveScore} name="comment" minWidth="700px" />
          </td>
          <td>
            <StyledCheckbox checked={beUpClass} onClick={handleCheckUpClass} />
          </td>
        </tr>
      )}
    </>
  )
}

export default StudentTotalScoreDetails
