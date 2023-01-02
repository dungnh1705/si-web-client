import React from 'react'
import { Grid, Card, CardContent, Box, IconButton } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserSlash, faChevronRight, faUserPlus, faMale, faUser, faRestroom, faUserLock } from '@fortawesome/free-solid-svg-icons'

import { history } from 'App'

const ClassInfo = ({ info }) => {
  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thông tin Chi đoàn</h4>
        </div>
        <div className="card-header--actions">
          <Box>
            <IconButton size="medium" variant="outlined" color="primary" onClick={() => history.push('/HT/StudentClass')}>
              <FontAwesomeIcon icon={faChevronRight} className="opacity-8 font-size-xs ml-1" />
            </IconButton>
          </Box>
        </div>
      </div>
      <CardContent className="p-3">
        <Grid container spacing={3} className="mt-4" justifyContent="center">
          <Grid item xs={4}>
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faUsers} className="font-size-xxl text-success" />
              </div>
              <div className="mt-3 line-height-sm">
                <b className="font-size-lg">{info?.totalStudent}</b>
                <span className="text-black-50 d-block">Tổng Đoàn sinh</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faUserPlus} className="font-size-xxl text-danger" />
              </div>
              <div className="mt-3 line-height-sm">
                <b className="font-size-lg">{info?.totalNewStudent}</b>
                <span className="text-black-50 d-block">Đoàn sinh mới</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faUser} className="font-size-xxl text-info" />
              </div>
              <div className="mt-3 line-height-sm">
                <b className="font-size-lg">{info?.totalOldStudent}</b>
                <span className="text-black-50 d-block">Đoàn sinh cũ</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faUserLock} className="font-size-xxl text-success" />
              </div>
              <div className="mt-3 line-height-sm">
                <b className="font-size-lg">{info?.totalStayInClass}</b>
                <span className="text-black-50 d-block">Đoàn sinh ở lại</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faRestroom} className="font-size-xxl text-danger" />
              </div>
              <div className="mt-3 line-height-sm">
                <b className="font-size-lg">
                  {info?.maleStudent} | {info?.femaleStudent}
                </b>
                <span className="text-black-50 d-block">Nam | Nữ</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="text-center">
              <div>
                <FontAwesomeIcon icon={faUserSlash} className="font-size-xxl text-info" />
              </div>
              <div className="mt-3 line-height-sm">
                <b className="font-size-lg">
                  {info?.totalStudentLeave} | {info?.totalStudentChangeChurch}
                </b>
                <span className="text-black-50 d-block">Nghỉ học | Chuyển xứ</span>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ClassInfo
