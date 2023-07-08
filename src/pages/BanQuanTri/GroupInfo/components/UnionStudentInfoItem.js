import React from 'react'
import { Grid, Card, IconButton, Tooltip, Divider, Table, makeStyles } from '@material-ui/core'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import moment from 'moment'

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#dbdcef'
    }
  }
})

export default function UnionStudentInfoItem({ item }) {
  const styleClass = useStyle()

  const [collapse, setCollapse] = React.useState(true)

  if (!item) return <></>

  return (
    <Card className="card-box mb-3 mt-3 w-100">
      <div className="card-header d-flex pb-1 pt-1" onClick={() => setCollapse(!collapse)} style={{ cursor: 'pointer' }}>
        <div className="card-header--title">
          {item.team === 0 && <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Chưa phân đội - {item.students?.length}</h4>}
          {item.team !== 0 && (
            <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
              Đội: {item.team} - {item.students?.length}
            </h4>
          )}
        </div>
        <Grid container item xs={4} justifyContent="flex-end">
          <div className="card-header--actions">
            <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
              <IconButton size="medium" color="primary">
                {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
      </div>
      <Divider />
      <div className="table-responsive" hidden={collapse}>
        <Table stickyHeader aria-label="sticky table" className="table table-hover text-nowrap mb-0">
          <thead>
            <tr>
              {/* <th className={styleClass.pinCell}>Mã ĐS</th> */}
              <th className={styleClass.pinCell}>Tên Thánh, Họ và Tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Ngày Rửa tội</th>
              <th>Do Linh mục</th>
              <th>Tại Giáo xứ</th>
              <th>Ngày Rước lễ</th>
              <th>Tại Giáo xứ</th>
              <th>Ngày Thêm sức</th>
              <th>Tại Giáo xứ</th>
              <th>Tên thánh, Họ và tên Cha</th>
              <th>SĐT</th>
              <th>Tên thánh, Họ và tên Mẹ</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Giáo khu/họ</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {[...item.students]
              .sort((a, b) => a.status - b.status || b.isTeamLead - a.isTeamLead || a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
              .map(student => (
                <tr key={`student-row-${student.id}`}>
                  {/* <td className={styleClass.pinCell}>{student.stuCode}</td> */}
                  <td className={styleClass.pinCell}>
                    {student.stuHolyname?.name ?? ''} {student.stuFirstName} {student.stuLastName}
                  </td>
                  <td>{student.stuDob ? moment(student.stuDob).format('DD-MM-YYYY') : ''}</td>
                  <td align="center">{student.stuGender ? 'Nam' : 'Nữ'}</td>
                  <td>{student.studentMoreInfo.stuBaptismDate ? moment(student.studentMoreInfo.stuBaptismDate).format('DD-MM-YYYY') : ''}</td>
                  <td>{student.studentMoreInfo.stuBaptismBy}</td>
                  <td>{student.studentMoreInfo.stuBaptismIn}</td>
                  <td>{student.studentMoreInfo.stuEucharistDate ? moment(student.studentMoreInfo.stuEucharistDate).format('DD-MM-YYYY') : ''}</td>
                  <td>{student.studentMoreInfo.stuEucharistIn}</td>
                  <td>{student.studentMoreInfo.stuConfirmationDate ? moment(student.studentMoreInfo.stuConfirmationDate).format('DD-MM-YYYY') : ''}</td>
                  <td>{student.studentMoreInfo.stuConfirmationIn}</td>
                  <td>
                    {student.studentMoreInfo.stuFatherHolyName?.name} {student.studentMoreInfo.stuFatherFullName}
                  </td>
                  <td>{student.studentMoreInfo.stuFatherPhone}</td>
                  <td>
                    {student.studentMoreInfo.stuMotherHolyName?.name} {student.studentMoreInfo.stuMotherFullName}
                  </td>
                  <td>{student.studentMoreInfo.stuMotherPhone}</td>
                  <td>{student.studentMoreInfo.stuAddress}</td>
                  <td>{student.studentMoreInfo.stuArea}</td>
                  <td>{student.stuNote}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}
