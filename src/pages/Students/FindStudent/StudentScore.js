import React, { Fragment, useEffect, useState } from 'react'
import { Grid, CardContent, Tooltip, Card, IconButton, Divider } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Badge from 'components/UI/Badge'
import { orderBy } from 'lodash'

import { HolyNameQuery } from 'recoils/selectors'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { GetStudentDetails } from './recoil'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { UserStatus } from 'app/enums'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons'
import { PhoneCallDialogAtom } from 'components/Dialog/recoil'

const StudentScore = ({ tabValue }) => {
  const student = useRecoilValue(GetStudentDetails)
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const [collapse, setCollapse] = useState([])

  const setPhoneDialog = useSetRecoilState(PhoneCallDialogAtom)

  const getHolyName = holyId => {
    return lstHolyName?.find(h => h.id === holyId)?.name
  }

  const handleClickCollapse = sectionId => {
    collapse.some(item => item === sectionId) ? setCollapse(collapse.filter(i => i !== sectionId)) : setCollapse([...collapse, sectionId])
  }

  const handleClickCall = phoneNo => {
    if (phoneNo && !phoneNo.includes('null')) {
      setPhoneDialog({ phoneCallDialog: true, phoneNo: phoneNo })
    }
  }

  useEffect(() => {
    if (student) {
      setCollapse([`${student.id}-0`])
    }
  }, [student])

  if (tabValue === 1 && student) {
    return (
      <div className="mt-3">
        {orderBy(student?.studentClass, ['classId'], ['desc']).map((sl, index) => {
          const schoolYear = sl.class?.scholastic
          const leader = sl?.class?.leader
          const key = `${sl.studentId}-${index}`
          const groupInfo = sl?.class?.group
          const sOne = student.semesterOne?.find(s => s.scholasticId === sl.class?.scholasticId)
          const sTwo = student.semesterTwo?.find(s => s.scholasticId === sl.class?.scholasticId)
          const total = student.total?.find(s => s.scholasticId === sl.class?.scholasticId)

          return (
            <div key={key}>
              <Card className="card-box mb-2 w-100">
                <div className="card-header d-flex pb-1 pt-1" onClick={() => handleClickCollapse(key)} style={{ cursor: 'pointer' }}>
                  <div className="card-header--title">
                    <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Năm học: {`${schoolYear?.startYear} - ${schoolYear?.endYear}`}</h4>
                  </div>
                  <Grid container item xs={2} justifyContent="flex-end">
                    <div className="card-header--actions">
                      <Tooltip arrow title={!collapse.some(item => item === key) ? 'Thu lại' : 'Mở rộng'}>
                        <IconButton size="medium" color="primary">
                          {!collapse.some(item => item === key) ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Grid>
                </div>
                <Divider />
                <CardContent hidden={!collapse.some(item => item === key)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant={'h5'}>{`Phân đoàn: ${groupInfo.groupName} - Chi đoàn: ${sl.union?.unionCode ?? ''}`}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="d-flex align-items-center mt-2">
                        <Typography>Phân đoàn trưởng:</Typography>

                        <Typography variant={'h5'} className="ml-2">
                          {getHolyName(leader?.holyNameId)} {leader?.firstName} {leader?.lastName}
                        </Typography>
                        <Badge
                          isActive={leader?.status === UserStatus.Active}
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                          }}
                          variant="dot"
                          child={
                            <IconButton
                              color={leader?.status === UserStatus.Active && leader?.phone ? 'primary' : 'default'}
                              onClick={() => handleClickCall(`+84${leader?.phone}`)}>
                              <FontAwesomeIcon icon={faPhoneAlt} className="font-size-lg" />
                            </IconButton>
                          }
                          className="ml-2"
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="d-flex align-items-center mt-2">
                      <Typography>Huynh Trưởng phụ trách:</Typography>
                      {sl.class?.assignment
                        ?.filter(a => a.unionId === sl.union?.unionId && a.unionId !== 1) // UnionId = 1 là HT chưa đc phân chi đoàn
                        .map((ass, index) => {
                          const teacher = ass?.user
                          const teacherName = `${getHolyName(teacher?.holyNameId)} ${teacher?.firstName} ${teacher?.lastName}`

                          return (
                            <Fragment key={nanoid(5)}>
                              <Typography variant={'h5'} className="ml-2">
                                {teacherName}
                              </Typography>
                              <div className="ml-2">
                                <div className="avatar-icon-wrapper">
                                  <Badge
                                    isActive={teacher?.status === UserStatus.Active}
                                    overlap="circular"
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right'
                                    }}
                                    variant="dot"
                                    child={
                                      <IconButton
                                        color={teacher?.status === UserStatus.Active && teacher?.phone ? 'primary' : 'default'}
                                        onClick={() => handleClickCall(`+84${teacher?.phone}`)}>
                                        <FontAwesomeIcon icon={faPhoneAlt} className="font-size-lg" />
                                      </IconButton>
                                    }
                                  />
                                </div>
                              </div>
                            </Fragment>
                          )
                        })}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="table-responsive">
                      <table className="table text-nowrap mb-0 mt-3">
                        <thead>
                          <tr>
                            <th></th>
                            <th style={{ textAlign: 'center' }}>15'</th>
                            <th style={{ textAlign: 'center' }}>15'</th>
                            <th style={{ textAlign: 'center' }}>1 tiết</th>
                            <th style={{ textAlign: 'center' }}>Học kỳ</th>
                            <th style={{ textAlign: 'center' }}>TB</th>
                            <th style={{ textAlign: 'center' }}>Đạo đức</th>
                            <th style={{ textAlign: 'center' }}>Xếp loại</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>Học kỳ I</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.oldTest}</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.fifteenTest}</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.lessonTest}</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.semesterTest}</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.average}</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.morality}</th>
                            <th style={{ textAlign: 'center' }}>{sOne?.ranking}</th>
                          </tr>
                          <tr>
                            <th>Nhận xét</th>
                            <th colSpan={7} style={{ textAlign: 'center' }}>
                              {sOne?.comment}
                            </th>
                          </tr>
                          <tr>
                            <th>Học kỳ II</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.oldTest}</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.fifteenTest}</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.lessonTest}</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.semesterTest}</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.average}</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.morality}</th>
                            <th style={{ textAlign: 'center' }}>{sTwo?.ranking}</th>
                          </tr>
                          <tr>
                            <th>Nhận xét</th>
                            <th colSpan={7} style={{ textAlign: 'center' }}>
                              {sTwo?.comment}
                            </th>
                          </tr>
                          <tr>
                            <th>Cả năm</th>
                            <th style={{ textAlign: 'center' }} colSpan={2}>
                              {total?.avgSemesterOne}
                            </th>
                            <th style={{ textAlign: 'center' }} colSpan={2}>
                              {total?.avgSemesterTwo}
                            </th>
                            <th style={{ textAlign: 'center' }}>{total?.avgTotal}</th>
                            <th style={{ textAlign: 'center' }}>{total?.morality}</th>
                            <th style={{ textAlign: 'center' }}>{total?.ranking}</th>
                          </tr>
                          <tr>
                            <th>Nhận xét</th>
                            <th colSpan={7} style={{ textAlign: 'center' }}>
                              {total?.comment}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    )
  }
  if (tabValue === 1 && !student) return <div className="p-3">Đoàn sinh đã chọn chưa có quá trình học.</div>
  return null
}
export default StudentScore
