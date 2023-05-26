import React from 'react'
import { Grid, TextField, CardContent, Avatar, Tooltip } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Slider from 'react-slick'
import Badge from 'components/UI/Badge'

import { HolyNameQuery } from 'recoils/selectors'
import { useRecoilValue } from 'recoil'
import { orderBy } from 'lodash'

import { GetStudentDetails } from './recoil'

const StudentScore = ({ tabValue }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  const student = useRecoilValue(GetStudentDetails)
  const lstHolyName = useRecoilValue(HolyNameQuery)

  const TextField_Props = (name, label, val) => {
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      value: val ?? '',
      InputProps: {
        readOnly: true
      },
      InputLabelProps: { shrink: true }
    }
  }

  const getHolyName = holyId => {
    return lstHolyName?.find(h => h.id === holyId)?.name
  }

  if (tabValue === 1 && student) {
    return (
      <Slider {...settings}>
        {orderBy(student?.studentClass, ['classId'], ['desc'])?.map((cl, index) => {
          const schoolYear = cl.class?.scholastic
          const leader = cl?.class?.leader
          return (
            <div key={`scl-${index * 77}`}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography>Năm học: {`${schoolYear?.startYear} - ${schoolYear?.endYear}`}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{`Phân đoàn: ${cl.class?.group?.groupName} - Chi đoàn: ${cl.union?.unionCode == 0 ? '' : cl.union?.unionCode}`}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <div className="d-flex align-items-center">
                      <Typography>Phân đoàn trưởng:</Typography>
                      <Badge
                        isActive={leader?.status == 2}
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        variant="dot"
                        child={
                          <Tooltip title={`${getHolyName(leader?.holyNameId)} ${leader?.firstName} ${leader?.lastName}`}>
                            <Avatar src={leader?.croppedAvatarId ? `img/avatar/${leader?.croppedAvatarId}.png` : ''}>
                              {`${leader?.firstName?.substring(0, 1)}${leader?.lastName?.substring(0, 1)}`}
                            </Avatar>
                          </Tooltip>
                        }
                        className="ml-2"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <div className="d-flex align-items-center">
                      <Typography variant="subtitle1">HT phụ trách: </Typography>
                      <div className="ml-4">
                        {cl.class?.assignment
                          ?.filter(a => a.unionId === cl.union?.unionId && a.unionId !== 1) // UnionId = 1 là HT chưa đc phân chi đoàn
                          .map((ass, index) => {
                            const teacher = ass?.user
                            return (
                              <div className="avatar-icon-wrapper" key={`teacher-${index * 66}`}>
                                <Badge
                                  isActive={teacher?.status == 2}
                                  overlap="circular"
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                  }}
                                  variant="dot"
                                  child={
                                    <Tooltip title={`${getHolyName(teacher?.holyNameId)} ${teacher?.firstName} ${teacher?.lastName}`}>
                                      <Avatar src={teacher?.croppedAvatarId ? `img/avatar/${teacher?.croppedAvatarId}.png` : ''}>
                                        {`${teacher?.firstName?.substring(0, 1)}${teacher?.lastName?.substring(0, 1)}`}
                                      </Avatar>
                                    </Tooltip>
                                  }
                                />
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </Grid>
                </Grid>
                {orderBy(
                  student?.semesterOne?.filter(s => s.scholasticId === cl.class?.scholasticId),
                  ['scholasticId'],
                  ['desc']
                ).map(sOne => {
                  return (
                    <Grid container spacing={3} key={135}>
                      <Grid item xs={12} lg={1}>
                        <Typography>HKI:</Typography>
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('oldTest', 'Miệng', sOne.oldTest)} />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('fifteenTest', `15'`, sOne.fifteenTest)} />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('lessonTest', '1 Tiết', sOne.lessonTest)} />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('semesterTest', 'HK', sOne.semesterTest)} />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('average', 'TB', sOne.average)} />
                      </Grid>
                      <Grid item xs={6} md={4} lg={2}>
                        <TextField {...TextField_Props('ranking', 'Xếp loại', sOne.ranking)} />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('morality', 'Đạo đức', sOne.morality)} />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <TextField {...TextField_Props('comment', 'Nhận xét', sOne.comment)} />
                      </Grid>
                    </Grid>
                  )
                })}
                {orderBy(
                  student?.semesterTwo?.filter(s => s.scholasticId === cl.class?.scholasticId),
                  ['scholasticId'],
                  ['desc']
                ).map(sTwo => {
                  return (
                    <Grid container spacing={3} key={579}>
                      <Grid item xs={12} lg={1}>
                        <Typography>HKII:</Typography>
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('oldTest', 'Miệng', sTwo.oldTest)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('fifteenTest', `15'`, sTwo.fifteenTest)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('lessonTest', '1 Tiết', sTwo.lessonTest)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('semesterTest', 'HK', sTwo.semesterTest)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('average', 'TB', sTwo.average)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={2}>
                        <TextField {...TextField_Props('ranking', 'Xếp loại', sTwo.ranking)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('morality', 'Đạo đức', sTwo.morality)} type="text" />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <TextField {...TextField_Props('comment', 'Nhận xét', sTwo.comment)} type="text" />
                      </Grid>
                    </Grid>
                  )
                })}
                {orderBy(
                  student?.total?.filter(s => s.scholasticId === cl.class?.scholasticId),
                  ['scholasticId'],
                  ['desc']
                ).map(tt => {
                  return (
                    <Grid container spacing={3} key={913}>
                      <Grid item xs={12} lg={1}>
                        <Typography>Cả năm:</Typography>
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('avgSemesterOne', 'TB HKI', tt.avgSemesterOne)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('avgSemesterTwo', 'TB HKII', tt.avgSemesterTwo)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('avgTotal', 'TB Cả năm', tt.avgTotal)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={2}>
                        <TextField {...TextField_Props('ranking', 'Xếp loại', tt.ranking)} type="text" />
                      </Grid>
                      <Grid item xs={6} md={4} lg={1}>
                        <TextField {...TextField_Props('morality', 'Đạo đức', tt.morality)} type="text" />
                      </Grid>
                      <Grid item xs={12} lg={5}>
                        <TextField {...TextField_Props('comment', 'Nhận xét', tt.comment)} type="text" />
                      </Grid>
                    </Grid>
                  )
                })}
              </CardContent>
            </div>
          )
        })}
      </Slider>
    )
  }
  if (tabValue === 1 && !student) return <div className="p-3">Chưa có thông tin Đoàn sinh.</div>
  return null
}
export default StudentScore
