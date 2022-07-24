import React from 'react'
import { useSetRecoilState } from 'recoil'
import { Avatar, Grid, ListItem } from '@material-ui/core'
import Badge from 'components/UI/Badge'
import { StudentStatus } from 'app/enums'

import moment from 'moment'
import { ShowStudent } from './recoil'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  }
}))

const StudentItem = ({ student, action }) => {
  const classes = useStyles()
  const setShowStudent = useSetRecoilState(ShowStudent)

  const handleClickShow = () => {
    setShowStudent(student)
    action()
  }

  return (
    <ListItem button className="align-box-row" onClick={() => handleClickShow()} key={student?.id}>
      <Grid container spacing={3} item xs={12}>
        <div className="d-flex align-items-center pl-2">
          <Badge
            isActive={student?.status === StudentStatus.Active}
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            variant="dot"
            child={<Avatar className={classes.large}>{`${student?.stuFirstName?.substring(0, 1)}${student?.stuLastName?.substring(0, 1)}`}</Avatar>}
          />
          <div className="p-3">
            <a href="#/" onClick={e => e.preventDefault()} className="font-weight-bold text-black" title="...">
              {`${student?.stuHolyname?.name ?? ''} ${student?.stuFirstName ?? ''} ${student?.stuLastName ?? ''}`}
            </a>
            <span className="d-block">Mã Đoàn sinh: {student?.stuCode}</span>
            <span className="text-black-50 d-block">Ngày sinh: {student?.stuDob ? moment(student?.stuDob).format('DD-MM-YYYY') : ''}</span>
          </div>
        </div>
      </Grid>
    </ListItem>
  )
}

export default StudentItem
