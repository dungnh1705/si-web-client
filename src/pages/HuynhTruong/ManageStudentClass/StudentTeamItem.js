import React, { Fragment } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Typography, Select, MenuItem, FormControlLabel } from '@material-ui/core'

// import StyledRadio from 'components/UI/StyledRadio'
import { StudentDialogAtom } from 'components/Dialog/recoil'

import { ViewModes, StudentStatus, AbsentMode } from 'app/enums'
import { HolyNameQuery } from 'recoils/selectors'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { toastState, loadingState } from 'recoils/atoms'
import { ViewMode } from 'recoils/atoms'

import { ReloadStudentClass, AssignmentQuery } from './recoil'

const StudentTeamItem = ({ student, team, viewAbsentMode, index }) => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const lstTeam = useRecoilValue(AssignmentQuery)
  const viewMode = useRecoilValue(ViewMode)

  const setLoading = useSetRecoilState(loadingState)
  const setReloadStudent = useSetRecoilState(ReloadStudentClass)

  const [toast, setToast] = useRecoilState(toastState)
  const [studentDialog, setStudentDialog] = useRecoilState(StudentDialogAtom)

  const handleChange = async e => {
    e.preventDefault()
    setLoading(true)

    const newTeam = e.target.value
    try {
      const res = await doPost(`student/updateStudentTeam`, {
        studentIds: [student.id],
        classId: sessionHelper().classId,
        team: newTeam
      })

      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadStudent(reload => reload + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  // const handleAddAbsent = async (e, hasPermission) => {
  //   e.preventDefault()
  //   setLoading(true)
  //
  //   const val = {
  //     StudentId: student.id,
  //     DateAbsent: new Date(),
  //     IsActive: true,
  //     Mode: 0,
  //     ScholasticId: sessionHelper().scholasticId,
  //     UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
  //     UserId: sessionHelper().userId,
  //     ClassId: sessionHelper().classId,
  //     HasPermission: hasPermission,
  //     Modes: [e.target.value]
  //   }
  //
  //   try {
  //     var res = await doPost(`student/absent`, val)
  //     if (res && res.data.success) {
  //       setLoading(false)
  //       setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
  //     }
  //   } catch (err) {
  //     setLoading(false)
  //     setToast({ ...toast, open: true, message: err.message, type: 'error' })
  //   }
  // }

  const checkDisabled = status => {
    return status === StudentStatus.ChangeChurch || status === StudentStatus.LeaveStudy
  }

  const handleRowClick = () => {
    setStudentDialog({ ...studentDialog, stuDialog: true, pageCall: 'HT-Student', student: student })
  }

  const findClassName = student => {
    if (student.status === StudentStatus.ChangeChurch) {
      return 'tr-student__change-church'
    }

    if (student.status === StudentStatus.LeaveStudy) {
      return 'tr-student__absent'
    }

    if (student.isNewStudent) {
      return 'tr-student__new-student'
    }

    return ''
  }

  return (
    <tr className={`align-items-center tr__active tr-student ${findClassName(student)}`}>
      {viewMode === ViewModes.XepDoi && (
        <Fragment>
          <td className="td-center">
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={team} onChange={handleChange} disabled={checkDisabled(student.status)}>
              <MenuItem value="0" key="team-disabled" disabled>
                N/A
              </MenuItem>
              {lstTeam?.map(i => {
                return (
                  <MenuItem value={i} key={`teams-class-${i}`}>
                    {i}
                  </MenuItem>
                )
              })}
            </Select>
          </td>
          <td className="td-center">{index}</td>
        </Fragment>
      )}
      <td onClick={handleRowClick} className="td-student">
        {student?.studentClass?.find(sl => sl.classId === Number(sessionHelper().classId))?.isTeamLead && <span className="td-student__team-leader" />}
        <Typography>
          {lstHolyName.find(h => h.id === student.stuHolyId).name}
          <br />
          {student.stuFirstName} {student.stuLastName}
        </Typography>
      </td>
      <td>
        {student.status === StudentStatus.ChangeChurch && <span className="badge badge-danger">Chuyển xứ</span>}
        {student.status === StudentStatus.LeaveStudy && <span className="badge badge-warning">Nghỉ luôn</span>}
        {student.studentClass[0].stayInClass && <span className="badge badge-dark">Ở lại lớp</span>}
      </td>
      {/*<td className='td-center'>*/}
      {/*  {team !== 0 && viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Mass && (*/}
      {/*    <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Mass}*/}
      {/*                                                                  onChange={e => handleAddAbsent(e, true)} />} />*/}
      {/*  )}*/}
      {/*  {team !== 0 && viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Class && (*/}
      {/*    <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Class}*/}
      {/*                                                                  onChange={e => handleAddAbsent(e, true)} />} />*/}
      {/*  )}*/}
      {/*</td>*/}
      {/*<td className='td-center'>*/}
      {/*  {team !== 0 && viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Mass && (*/}
      {/*    <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Mass}*/}
      {/*                                                                  onChange={e => handleAddAbsent(e, false)} />} />*/}
      {/*  )}*/}
      {/*  {team !== 0 && viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Class && (*/}
      {/*    <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Class}*/}
      {/*                                                                  onChange={e => handleAddAbsent(e, false)} />} />*/}
      {/*  )}*/}
      {/*</td>*/}
    </tr>
  )
}

export default StudentTeamItem
