import React from 'react'
import { Typography, Select, MenuItem, FormControlLabel } from '@material-ui/core'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'

import StyledRadio from 'components/UI/StyledRadio'
import { StudentDialogAtom } from 'components/Dialog/recoil'

import { ViewModes, StudentStatus, AbsentMode } from 'app/enums'
import { loadingState, toastState, ViewMode, PageYOffset } from 'recoils/atoms'
import { HolyNameQuery, UnionQuery } from 'recoils/selectors'
import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

import { ReloadStudentGroup } from './recoil'

const StudentTeamItem = ({ student, unionId, viewAbsentMode, team, index }) => {
  const lstUnion = useRecoilValue(UnionQuery)
  const lstHolyname = useRecoilValue(HolyNameQuery)
  const viewMode = useRecoilValue(ViewMode)

  const [toast, setToast] = useRecoilState(toastState)
  const [studentDialog, setStudentDialog] = useRecoilState(StudentDialogAtom)

  const setReloadStudent = useSetRecoilState(ReloadStudentGroup)
  const setLoading = useSetRecoilState(loadingState)
  const setPageYOffset = useSetRecoilState(PageYOffset)

  const handleChange = async e => {
    e.preventDefault()
    setLoading(true)

    const newUnion = e.target.value

    try {
      const res = await doPost(`student/updateStudentUnion`, { studentId: student.id, classId: student.classId, unionId: newUnion })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadStudent(reload => reload + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleClickRow = () => {
    setPageYOffset(window.pageYOffset)
    setStudentDialog({ ...studentDialog, stuDialog: true, pageCall: 'PDT-Student', student: student })
  }

  const handleAddAbsent = async (e, hasPermission) => {
    e.preventDefault()
    setLoading(true)

    const val = {
      StudentId: student.id,
      DateAbsent: new Date(),
      IsActive: true,
      Mode: 0,
      ScholasticId: sessionHelper().scholasticId,
      UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
      UserId: sessionHelper().userId,
      ClassId: sessionHelper().classId,
      HasPermission: hasPermission,
      Modes: [e.target.value]
    }

    try {
      var res = await doPost(`student/absent`, val)
      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
      }
    } catch (err) {
      setLoading(false)
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const checkDisabled = status => {
    return status === StudentStatus.ChangeChurch || status === StudentStatus.LeaveStudy
  }

  return (
    <tr className="align-items-center">
      {viewMode === ViewModes.XepChiDoan && (
        <td>
          <Select id="union-select" onChange={handleChange} value={unionId} disabled={checkDisabled(student.status)}>
            <MenuItem value={1} disabled>
              N/A
            </MenuItem>
            {lstUnion.map((union, index) => {
              return (
                <MenuItem value={union.unionId} key={`union-${index + 88}`}>
                  {union.unionCode}
                </MenuItem>
              )
            })}
          </Select>
        </td>
      )}
      <td>{index}</td>
      <td style={{ cursor: 'pointer' }} onClick={handleClickRow}>
        <Typography>
          {lstHolyname.find(h => h.id === student.stuHolyId).name}
          <br />
          {student.stuFirstName} {student.stuLastName}
        </Typography>
      </td>
      {unionId !== 1 && viewMode === ViewModes.DiemDanh && team !== 0 && (
        <>
          <td className="td-center">
            {viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Mass && (
              <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Mass} onChange={e => handleAddAbsent(e, true)} />} />
            )}
            {viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Class && (
              <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Class} onChange={e => handleAddAbsent(e, true)} />} />
            )}
          </td>
          <td className="td-center">
            {viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Mass && (
              <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Mass} onChange={e => handleAddAbsent(e, false)} />} />
            )}
            {viewMode === ViewModes.DiemDanh && viewAbsentMode === AbsentMode.Class && (
              <FormControlLabel style={{ margin: 0 }} control={<StyledRadio value={AbsentMode.Class} onChange={e => handleAddAbsent(e, false)} />} />
            )}
          </td>
        </>
      )}
      {viewMode === ViewModes.DanhSachNghi && (
        <td>
          {student.status === StudentStatus.ChangeChurch && <span className="badge badge-danger">Chuyển xứ</span>}
          {student.status === StudentStatus.LeaveStudy && <span className="badge badge-warning">Nghỉ luôn</span>}
        </td>
      )}
    </tr>
  )
}

export default StudentTeamItem
