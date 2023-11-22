import React, { Fragment, useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import red from '@material-ui/core/colors/red'
import { makeStyles, Hidden } from '@material-ui/core'

import StyledCheckbox from 'components/UI/StyledCheckbox'
import { AbsentMode, SemesterEnum } from 'app/enums'
import { toastState } from 'recoils/atoms'
import sessionHelper from 'utils/sessionHelper'
import { doGet, doPost } from 'utils/axios'

import { SemesterSelected } from 'recoils/atoms'
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

const StudentUnionTeamBodyItem = ({ studentId }) => {
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
    const { scholasticId } = sessionHelper()
    const avg = name === 'average' ? (newVal === 0 || !newVal ? null : newVal) : null

    const oldScoreFrom = JSON.parse(student.score.scoreForm)
    const newScoreForm = oldScoreFrom.map(item => {
      if (item.Key === name) {
        return { ...item, Value: newVal }
      }
      return item
    })

    const newScore = {
      ...student.score,
      [name]: newVal,
      average: avg,
      semesterCode: semester,
      studentId: student.id,
      scholasticId,
      scoreForm: JSON.stringify(newScoreForm)
    }

    try {
      const res = await doPost(`student/updateStudentScore`, newScore)
      if (res && res.data.success) {
        // setToast({ ...toast, open: true, message: 'Cập nhật thành công', type: 'success' })
        setReload(old => old + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.data.message, type: 'error' })
    }
  }

  useEffect(() => {
    async function fetch() {
      const { groupId, scholasticId } = sessionHelper()

      const res = await doGet('student/getStudentScoreInTeam', {
        groupId,
        studentId,
        semesterCode: semester,
        scholasticId
      })
      if (res && res.data.success) {
        const { data } = res.data

        setStudent({ ...student, ...data })
      }
    }

    if (!student) fetch().finally()
  }, [])

  useEffect(() => {
    if (student?.score) {
      setBeUpClass(student?.score?.beUpClass)
    }
  }, [student])

  useEffect(() => {
    async function fetch() {
      const { groupId, scholasticId } = sessionHelper()

      const res = await doGet('student/getStudentScoreInTeam', {
        groupId,
        studentId,
        semesterCode: semester,
        scholasticId
      })
      if (res && res.data.success) {
        const { data } = res.data

        setStudent({ ...student, ...data })
      }
    }

    if (reload > 0) {
      fetch().finally()
    }
  }, [reload])

  return (
    <Fragment>
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
          {JSON.parse(student.score?.scoreForm)?.map(item => (
            <td key={`${student.id}-${item.Key}`}>
              <ScoreTextField value={item.Value} handleSave={handleSaveScore} name={item.Key} isNumber minWidth="50px" />
            </td>
          ))}
          <td align={'center'}>
            {student.score?.attendanceScore}
          </td>
          <td align={'center'}>
            <ScoreTextField value={student.score?.average} handleSave={handleSaveScore} name="average" isNumber minWidth="50px" />
          </td>
          <td align={'center'}>{student.score?.ranking}</td>
          <td align={'center'}>
            <ScoreTextField value={student.score?.morality} handleSave={handleSaveScore} name="morality" minWidth="80px" />
          </td>
          <td align={'center'}>
            <ScoreTextField value={student.score?.comment} handleSave={handleSaveScore} name="comment" minWidth="400px" />
          </td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
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

          <td>
            <ScoreTextField value={student.score?.morality} handleSave={handleSaveScore} name="morality" minWidth="100px" />
          </td>
          <td>
            <ScoreTextField value={student.score?.comment} handleSave={handleSaveScore} name="comment" minWidth="400px" />
          </td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
          <td>
            <StyledCheckbox checked={beUpClass} onClick={handleCheckUpClass} />
          </td>
        </tr>
      )}
    </Fragment>
  )
}

export default StudentUnionTeamBodyItem
