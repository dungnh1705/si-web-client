import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core'

import { DocumentPreviewDialogAtom } from 'components/Dialog/recoil'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import { AbsentMode, SemesterEnum, TemplateType } from 'app/enums'
import { HolyNameQuery } from 'recoils/selectors'
import { toastState } from 'recoils/atoms'
import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

import { SemesterSelected } from './recoil'

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
      content: "\"\"",
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentUnionItem = ({ student }) => {
  const lstHolyname = useRecoilValue(HolyNameQuery)
  const semester = useRecoilValue(SemesterSelected)

  const [toast, setToast] = useRecoilState(toastState)

  const setDocumentPreview = useSetRecoilState(DocumentPreviewDialogAtom)

  const [beUpClass, setBeUpClass] = useState(student.total[0]?.beUpClass)

  const classStyle = useStyle()

  const handleRowClick = e => {
    e.preventDefault()
    setDocumentPreview({ openPreviewDialog: true, studentId: student.id, templateType: TemplateType.Document })
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
      classAb = student.absents?.filter(ab => ab.absentMode === AbsentMode.Class && ab.semesterCode === 1)
      massAb = student.absents?.filter(ab => ab.absentMode === AbsentMode.Mass && ab.semesterCode === 1)
    }

    if (semester === SemesterEnum.semesterTwo) {
      classAb = student.absents?.filter(ab => ab.absentMode === AbsentMode.Class && ab.semesterCode === 2)
      massAb = student.absents?.filter(ab => ab.absentMode === AbsentMode.Mass && ab.semesterCode === 2)
    }

    if (semester === SemesterEnum.total) {
      classAb = student.absents?.filter(ab => ab.absentMode === AbsentMode.Class)
      massAb = student.absents?.filter(ab => ab.absentMode === AbsentMode.Mass)
    }

    return {
      classHasPermission: classAb?.filter(ca => ca.hasPermission)?.length > 0 ? classAb?.filter(ca => ca.hasPermission)?.length : '',
      classNonPermission: classAb?.filter(ca => !ca.hasPermission)?.length > 0 ? classAb?.filter(ca => !ca.hasPermission)?.length : '',
      massHasPermission: massAb?.filter(ca => ca.hasPermission)?.length > 0 ? massAb?.filter(ca => ca.hasPermission)?.length : '',
      massNonPermission: massAb?.filter(ca => !ca.hasPermission)?.length > 0 ? massAb?.filter(ca => !ca.hasPermission)?.length : ''
    }
  }

  return (
    <>
      {semester === SemesterEnum.semesterOne && (
        <tr
          className="tr__active"
          onClick={handleRowClick}
          style={{
            backgroundColor: student.semesterOne[0]?.average < 3.5 ? red[200] : 'inherit'
          }}>
          <td className={classStyle.pinCell}>
            {lstHolyname?.find(h => h.id === student.stuHolyId).name} {student.stuFirstName} {student.stuLastName}
          </td>
          <td>{student.semesterOne[0]?.oldTest ?? ''}</td>
          <td>{student.semesterOne[0]?.fifteenTest ?? ''}</td>
          <td>{student.semesterOne[0]?.lessonTest ?? ''}</td>
          <td>{student.semesterOne[0]?.semesterTest ?? ''}</td>
          <td>{student.semesterOne[0]?.average ?? ''}</td>
          <td>{student.semesterOne[0]?.ranking}</td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
          <td>{student.semesterOne[0]?.morality ?? ''}</td>
          <td>{student.semesterOne[0]?.comment ?? ''}</td>
        </tr>
      )}
      {semester === SemesterEnum.semesterTwo && (
        <tr
          className="tr__active"
          onClick={handleRowClick}
          style={{
            backgroundColor: student.semesterTwo[0]?.average < 3.5 ? red[100] : 'inherit'
          }}>
          <td>
            {lstHolyname?.find(h => h.id === student.stuHolyId).name} {student.stuFirstName} {student.stuLastName}
          </td>
          <td>{student.semesterTwo[0]?.oldTest ?? ''}</td>
          <td>{student.semesterTwo[0]?.fifteenTest ?? ''}</td>
          <td>{student.semesterTwo[0]?.lessonTest ?? ''}</td>
          <td>{student.semesterTwo[0]?.semesterTest ?? ''}</td>
          <td>{student.semesterTwo[0]?.average ?? ''}</td>
          <td>{student.semesterTwo[0]?.ranking}</td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
          <td>{student.semesterTwo[0]?.morality ?? ''}</td>
          <td>{student.semesterTwo[0]?.comment ?? ''}</td>
        </tr>
      )}
      {semester === SemesterEnum.total && (
        <tr
          style={{
            backgroundColor: student.total[0]?.avgTotal < 3.5 ? red[100] : 'inherit'
          }}>
          <td onClick={handleRowClick} className="td--active">
            {lstHolyname?.find(h => h.id === student.stuHolyId).name} {student.stuFirstName} {student.stuLastName}
          </td>
          <td>{student.total[0]?.avgSemesterOne ?? ''}</td>
          <td>{student.total[0]?.avgSemesterTwo ?? ''}</td>
          <td>{student.total[0]?.avgTotal ?? ''}</td>
          <td>{student.total[0]?.ranking ?? ''}</td>
          {/* Nghỉ học có phép */}
          <td>{sumAbsents().classHasPermission}</td>
          {/* Nghỉ học không phép */}
          <td>{sumAbsents().classNonPermission}</td>
          {/* Nghỉ lễ phép */}
          <td>{sumAbsents().massHasPermission}</td>
          {/* Nghỉ lễ không phép */}
          <td>{sumAbsents().massNonPermission}</td>
          <td>{student.total[0]?.morality ?? ''}</td>
          <td>{student.total[0]?.comment ?? ''}</td>
          <td>
            <StyledCheckbox checked={beUpClass} onClick={handleCheckUpClass} />
          </td>
        </tr>
      )}
    </>
  )
}

export default StudentUnionItem
