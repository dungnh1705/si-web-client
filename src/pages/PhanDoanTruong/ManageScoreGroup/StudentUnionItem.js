import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import red from '@material-ui/core/colors/red'
import { HolyNameQuery } from 'recoils/selectors'
import { SemesterSelected } from './recoil'
import { DocumentPreviewDialogAtom } from 'components/Dialog/recoil'
import { AbsentMode, SemesterEnum, TemplateType } from 'app/enums'

const StudentUnionItem = ({ student }) => {
  let lstHolyname = useRecoilValue(HolyNameQuery)
  let semester = useRecoilValue(SemesterSelected)
  let setDocumentPreview = useSetRecoilState(DocumentPreviewDialogAtom)

  const handleRowClick = e => {
    e.preventDefault()

    setDocumentPreview({ openPreviewDialog: true, studentId: student.id, templateType: TemplateType.Document })
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
      <tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
        <td>
          {lstHolyname?.find(h => h.id === student.stuHolyId).name} {student.stuFirstName} {student.stuLastName}
        </td>
        {semester === SemesterEnum.semesterOne && (
          <>
            <td>{student.semesterOne[0]?.oldTest ?? ''}</td>
            <td>{student.semesterOne[0]?.fifteenTest ?? ''}</td>
            <td>{student.semesterOne[0]?.lessonTest ?? ''}</td>
            <td>{student.semesterOne[0]?.semesterTest ?? ''}</td>
            <td style={{ backgroundColor: student.semesterOne[0]?.average <= 3.5 ? red[200] : 'inherit' }}>{student.semesterOne[0]?.average ?? ''}</td>
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
          </>
        )}
        {semester === SemesterEnum.semesterTwo && (
          <>
            <td>{student.semesterTwo[0]?.oldTest ?? ''}</td>
            <td>{student.semesterTwo[0]?.fifteenTest ?? ''}</td>
            <td>{student.semesterTwo[0]?.lessonTest ?? ''}</td>
            <td>{student.semesterTwo[0]?.semesterTest ?? ''}</td>
            <td style={{ backgroundColor: student.semesterTwo[0]?.average <= 3.5 ? red[200] : 'inherit' }}>{student.semesterTwo[0]?.average ?? ''}</td>
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
          </>
        )}
        {semester === SemesterEnum.total && (
          <>
            <td>{student.total[0]?.avgSemesterOne ?? ''}</td>
            <td>{student.total[0]?.avgSemesterTwo ?? ''}</td>
            <td style={{ backgroundColor: student.total[0]?.avgTotal <= 3.5 ? red[200] : 'inherit' }}>{student.total[0]?.avgTotal ?? ''}</td>
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
          </>
        )}
      </tr>
    </>
  )
}

export default StudentUnionItem
