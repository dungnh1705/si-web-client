import React, { Fragment, useEffect, useState } from 'react'
import { Grid, CardContent, Tooltip, Card, IconButton, Divider, makeStyles } from '@material-ui/core'
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
import ScoreHeader from './ScoreHeader'
import ScoreBody from './ScoreBody'

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    backgroundColor: 'white',
    zIndex: 1,

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2.5px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentScore = ({ tabValue }) => {
  const ClassStyle = useStyle()

  const student = useRecoilValue(GetStudentDetails)
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const [collapse, setCollapse] = useState([])

  const setPhoneDialog = useSetRecoilState(PhoneCallDialogAtom)

  const getHolyName = holyId => {
    return lstHolyName?.find(h => h.id === holyId)?.name
  }

  const getHeaderScoreLabels = scoreLabels => {
    const dynamicLabels = [{ Label: 'FifteenTest' }, { Label: 'FifteenTest' }, { Label: 'LessonTest' }, { Label: 'SemesterTest' }]

    const fixLabels = [{ Label: 'Average' }, { Label: 'Morality' }, { Label: 'Ranking' }]

    const parseLabels = scoreLabels ? JSON.parse(scoreLabels) : null
    return (parseLabels || dynamicLabels).concat(fixLabels)
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
          const headerScoreLabels = getHeaderScoreLabels(sOne?.scoreForm)
          const sTwo = student.semesterTwo?.find(s => s.scholasticId === sl.class?.scholasticId)
          const total = student.total?.find(s => s.scholasticId === sl.class?.scholasticId)

          return (
            <Fragment key={key}>
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
                            <th className={ClassStyle.pinCell}></th>
                            <ScoreHeader scoreLabels={headerScoreLabels} />
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th className={ClassStyle.pinCell}>Học kỳ I</th>
                            <ScoreBody semesterData={sOne} headerLength={headerScoreLabels.length} />
                          </tr>
                          <tr>
                            <th className={ClassStyle.pinCell}>Nhận xét</th>
                            <th colSpan={headerScoreLabels.length} style={{ textAlign: 'center' }}>
                              {sOne?.comment}
                            </th>
                          </tr>
                          <tr>
                            <th className={ClassStyle.pinCell}>Học kỳ II</th>
                            <ScoreBody semesterData={sTwo} headerLength={headerScoreLabels.length} />
                          </tr>
                          <tr>
                            <th className={ClassStyle.pinCell}>Nhận xét</th>
                            <th colSpan={headerScoreLabels.length} style={{ textAlign: 'center' }}>
                              {sTwo?.comment}
                            </th>
                          </tr>
                          <tr>
                            <th className={ClassStyle.pinCell}>Cả năm</th>
                            <th style={{ textAlign: 'center' }} colSpan={Math.floor((headerScoreLabels.length - 3) / 2)}>
                              TB HKI: {total?.avgSemesterOne}
                            </th>
                            <th style={{ textAlign: 'center' }} colSpan={((headerScoreLabels.length - 3) / 2).toFixed()}>
                              TB HKII: {total?.avgSemesterTwo}
                            </th>
                            <th style={{ textAlign: 'center' }}>TB Cả năm: {total?.avgTotal}</th>
                            <th style={{ textAlign: 'center' }}>{total?.morality}</th>
                            <th style={{ textAlign: 'center' }}>{total?.ranking}</th>
                          </tr>
                          <tr>
                            <th className={ClassStyle.pinCell}>Nhận xét</th>
                            <th colSpan={headerScoreLabels.length} style={{ textAlign: 'center' }}>
                              {total?.comment}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </Fragment>
          )
        })}
      </div>
    )
  }
  if (tabValue === 1 && !student) return <div className="p-3">Đoàn sinh đã chọn chưa có quá trình học.</div>
  return null
}
export default StudentScore
