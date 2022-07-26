import React, { useState } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Card, Tooltip, IconButton, Typography, Divider, Grid } from '@material-ui/core'

import { RegisterMode } from 'app/enums'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { NewStudentSelected, IsEditNewStu, NewStudentQuery } from './recoil'

const StudentList = () => {
  const [collapse, setCollapse] = useState(true)
  const setSelectedStudent = useSetRecoilState(NewStudentSelected)
  const setIsEdit = useSetRecoilState(IsEditNewStu)
  const lstNewStudent = useRecoilValue(NewStudentQuery)

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  const handleRowClick = (e, student) => {
    e.preventDefault()

    setSelectedStudent(student)
    setIsEdit(true)
  }

  return (
    <>
      {lstNewStudent?.map((item, i) => (
        <Grid item xs={12} lg={6} key={`new-stu-${i}`}>
          <Card className="card-box mb-1 w-100">
            <div className="card-header d-flex pb-1 pt-1" onClick={handleCollapse} style={{ cursor: 'pointer' }}>
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                  Đăng ký {Number(item?.mode) === RegisterMode.Offline ? 'Offline' : 'Online'} - {item?.students?.length}
                </h4>
              </div>
              <div className="card-header--actions">
                <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                  <IconButton size="medium" color="primary">
                    {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <Divider />
            <div className="card-body pb-1 font-weight-bold" hidden={collapse}>
              <div className="table-responsive">
                <table className="table table-hover text-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Tên Thánh, Họ và Tên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item?.students.map((stu, i) => (
                      <tr key={`res-stu-${stu.id}`} onClick={e => handleRowClick(e, stu)}>
                        <td className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                          <Typography>{`${stu?.stuHolyname?.name} ${stu?.stuFirstName} ${stu?.stuLastName}`}</Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default StudentList
