import React, { useState, useEffect } from 'react'
import { Grid, Tooltip, IconButton, Divider, CardContent } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { union } from 'lodash'
//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StyledCheckbox from 'components/UI/StyledCheckbox'

import StudentsUnionTeamItem from '../components/StudentsUnionTeamItem'
import { StudentSelected, ReloadStudents } from '../recoil'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

const StudentsUnionTeam = ({ team, unionId }) => {
  const [stuIdsInTeam, setStuIdsInTeam] = useState([])
  const reloadStudents = useRecoilValue(ReloadStudents)
  useEffect(() => {
    async function fetchData(teamId, unionId) {
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

    fetchData(team, unionId).finally()
  }, [team, unionId, reloadStudents])

  const [collapse, setCollapse] = useState(true)

  const [studentIdsSelected, setStudentIdsSelected] = useRecoilState(StudentSelected)

  const handleCheckAll = e => {
    if (e.target.checked) {
      const lstIdSelected = studentIdsSelected.map(stu => stu.stuId)
      const res = union(lstIdSelected, stuIdsInTeam)
      res.length > 0
        ? setStudentIdsSelected([
            ...studentIdsSelected,
            ...res
              .filter(id => !lstIdSelected.includes(id))
              .map(id => ({
                stuId: id,
                union: unionId,
                team
              }))
          ])
        : setStudentIdsSelected([...stuIdsInTeam.map(id => ({ stuId: id, union: unionId, team }))])
    } else {
      setStudentIdsSelected(studentIdsSelected.filter(stu => stu.union !== unionId || stu.team !== team))
    }
  }

  const handleChecked = () => {
    const checked = studentIdsSelected.filter(stu => stuIdsInTeam.includes(stu.stuId))

    return checked.length === stuIdsInTeam.length
  }

  return (
    <>
      {stuIdsInTeam.length > 0 && (
        <div className="card-header d-flex pb-1 pt-1 header__active" onClick={() => setCollapse(!collapse)}>
          <div className="card-header--title">
            {team === 0 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân đội - {stuIdsInTeam.length}</h4>}
            {team !== 0 && (
              <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                Đội: {team} - {stuIdsInTeam.length}
              </h4>
            )}
          </div>
          <Grid container item xs={3} justifyContent="flex-end">
            <div className="card-header--actions">
              <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                <IconButton size="medium" color="primary">
                  {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>
      )}
      {!collapse && stuIdsInTeam.length >= 1 && (
        <>
          <CardContent>
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
                  {stuIdsInTeam.length <= 0 && <>Chưa có Đoàn sinh</>}
                  {stuIdsInTeam.map((id, index) => (
                    <StudentsUnionTeamItem key={`stu-team-item-${id}`} id={id} index={index + 1} union={unionId} team={team} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <Divider />
        </>
      )}
    </>
  )
}

export default StudentsUnionTeam
