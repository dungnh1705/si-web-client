import StyledCheckbox from 'components/UI/StyledCheckbox'

import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { union } from 'lodash'

import { StudentSelected, ReloadStudents } from '../recoil'
import StudentsUnionTeamItem from '../components/StudentsUnionTeamItem'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

export default function TeamDetail({ team, unionId }) {
  const [studentIdsSelected, setStudentIdsSelected] = useRecoilState(StudentSelected)
  const [stuIdsInTeam, setStuIdsInTeam] = useState([])
  const reloadStudents = useRecoilValue(ReloadStudents)

  useEffect(() => {
    async function fetchData(teamId, unionId) {
      if (unionId) {
        const res = await doGet('student/getStudentIdsInTeam', {
          classId: sessionHelper().classId,
          unionId: unionId,
          team: teamId
        })
        if (res && res.data.success) {
          const { data } = res.data
          setStuIdsInTeam(data)
        }
      }
    }

    fetchData(team, unionId).finally()
  }, [team, unionId, reloadStudents])

  const handleCheckAll = e => {
    const teamStudentIds = stuIdsInTeam
    const lstIdSelected = studentIdsSelected.map(stu => stu.id)
    if (e.target.checked) {
      const res = union(lstIdSelected, teamStudentIds)
      res.length > 0
        ? setStudentIdsSelected([
            ...studentIdsSelected,
            ...res
              .filter(id => !lstIdSelected.includes(id))
              .map(id => ({
                stuId: id,
                unionId,
                team
              }))
          ])
        : setStudentIdsSelected([...teamStudentIds.map(id => ({ stuId: id, union: unionId, team }))])
    } else {
      setStudentIdsSelected(studentIdsSelected.filter(stu => stu.team !== team))
    }
  }

  const handleChecked = () => {
    const teamStudentIds = stuIdsInTeam
    const checked = studentIdsSelected.filter(stu => teamStudentIds.includes(stu.stuId))

    return checked?.length === teamStudentIds?.length && teamStudentIds?.length !== 0
  }

  if (!stuIdsInTeam) return <></>
  return (
    <>
      {stuIdsInTeam.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover text-nowrap mb-0">
            <thead>
              <tr>
                <th>
                  <StyledCheckbox checked={handleChecked()} onChange={handleCheckAll} />
                </th>
                <th>STT</th>
                <th>Tên Thánh, Họ và Tên</th>
              </tr>
            </thead>
            <tbody>
              {stuIdsInTeam.length < 0 ? (
                <>Chưa có Đoàn sinh</>
              ) : (
                stuIdsInTeam.map((id, index) => <StudentsUnionTeamItem key={`stu-team-item-${id}`} index={index + 1} id={id} union={unionId} team={team} />)
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
