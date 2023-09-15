import React from 'react'
import { Grid, Card, IconButton, Tooltip, Divider, Table } from '@material-ui/core'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import { useRecoilState } from 'recoil'
import { groupStudentIdSelectedAtom } from '../recoil'
import _ from 'lodash'

export default function({ item }) {
  const [collapse, setCollapse] = React.useState(true)

  const [selectedIds, setSelectedIds] = useRecoilState(groupStudentIdSelectedAtom)
  const handleClickRow = (e) => {
    const val = e.target.value

    const isChecked = e.target.checked
    isChecked ? setSelectedIds([...selectedIds, val]) : setSelectedIds(selectedIds.filter(i => i !== val))
  }

  const handleCheckAll = (e) => {
    const lstId = item.students.map(s => s.id)

    if (e.target.checked) {
      const res = _.union(selectedIds, lstId)
      setSelectedIds(res)
    } else {
      setSelectedIds(selectedIds.filter(i => !lstId.includes(i)))
    }
  }

  if (!item) return <></>

  return (
    <Card className='card-box mb-3 mt-3 w-100'>
      <div className='card-header d-flex pb-1 pt-1' onClick={() => setCollapse(!collapse)}
           style={{ cursor: 'pointer' }}>
        <div className='card-header--title'>
          {item.team === 0 &&
            <h4 className='font-size-lg mb-0 py-2 font-weight-bold'>Chưa phân đội - {item.students?.length}</h4>}
          {item.team !== 0 && (
            <h4 className='font-size-lg mb-0 py-2 font-weight-bold'>
              Đội: {item.team} - {item.students?.length}
            </h4>
          )}
        </div>
        <Grid container item xs={4} justifyContent='flex-end'>
          <div className='card-header--actions'>
            <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
              <IconButton size='medium' color='primary'>
                {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
      </div>
      <Divider />
      <div className='table-responsive' hidden={collapse}>
        <Table stickyHeader aria-label='sticky table' className='table table-hover text-nowrap mb-0'>
          <thead>
          <tr>
            <th><StyledCheckbox onChange={handleCheckAll} /></th>
            <th>Tên Thánh, Họ và Tên</th>
            <th>Giới tính</th>
          </tr>
          </thead>
          <tbody>
          {[...item.students]
            .sort((a, b) => a.status - b.status || b.isTeamLead - a.isTeamLead || a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
            .map(student => (
              <tr key={`student-row-${student.id}`}>
                <td><StyledCheckbox onChange={handleClickRow} value={student.id}
                                    checked={selectedIds.some(v => v === student.id)} /></td>
                <td>
                  {student.stuHolyname?.name ?? ''} {student.stuFirstName} {student.stuLastName}
                </td>
                <td>{student.stuGender ? 'Nam' : 'Nữ'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}
