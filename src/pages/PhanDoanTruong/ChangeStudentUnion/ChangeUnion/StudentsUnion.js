import React, { useState, useEffect } from 'react'
import { Card } from '@material-ui/core'
import StyledCheckbox from 'components/UI/StyledCheckbox'

import { useRecoilValue, useRecoilState } from 'recoil'
import { ReloadStudents, StudentSelected } from '../recoil'

import StudentsUnionTeam from './StudentsUnionTeam'
import StudentsUnionTeamItem from '../components/StudentsUnionTeamItem'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

const StudentsUnion = ({ unionId }) => {
  const [lsTeam, setLsTeam] = useState([])
  const [stuIdsNotInAnyUnion, setStuIdsNotInAnyUnion] = useState([])
  const [studentIdsSelected, setStudentIdsSelected] = useRecoilState(StudentSelected)

  const reloadStudents = useRecoilValue(ReloadStudents)

  useEffect(() => {
    async function fetchData() {
      if (unionId !== 1) {
        const res = await doGet(`assignment/getTeamInUnion`, { unionId })
        const totalTeam = res.data.data
        setLsTeam(Array.from({ length: totalTeam }, (_, i) => i))
      } else {
        const { classId } = sessionHelper()
        const res = await doGet(`student/getStudentInUnion`, { classId, unionId })
        setStuIdsNotInAnyUnion(res.data.data?.map(stu => stu.id))
      }
    }

    fetchData().finally()
  }, [unionId, reloadStudents])

  const handleCheckAll = e => {
    if (e.target.checked) {
      setStudentIdsSelected([...stuIdsNotInAnyUnion.map(id => ({ stuId: id, union: 0, team: -1 }))])
    } else {
      setStudentIdsSelected([...studentIdsSelected.filter(stu => stu.union !== 0 || stu.team !== -1)])
    }
  }

  const handleChecked = () => {
    return studentIdsSelected.length === stuIdsNotInAnyUnion.length
  }

  return (
    <Card className="card-box mb-1 w-100">
      {unionId === 1 && stuIdsNotInAnyUnion?.length >= 1 && (
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
              {stuIdsNotInAnyUnion?.map((id, index) => (
                <StudentsUnionTeamItem key={`stu-team-no-union-${id}`} id={id} union={0} team={-1} index={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {unionId !== 1 && (
        <>
          {lsTeam.map((team, index) => (
            <StudentsUnionTeam key={`union-${unionId}-team-${index}`} team={team} unionId={unionId} />
          ))}
        </>
      )}
    </Card>
  )
}

export default StudentsUnion
