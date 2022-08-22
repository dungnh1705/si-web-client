import React from 'react'
import { Card, Box, IconButton, CardContent, Grid, Typography } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import _ from 'lodash'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserSlash, faChevronRight, faUserPlus, faMale, faFemale, faUser } from '@fortawesome/free-solid-svg-icons'

// components
import { history } from 'App'
import Slider from 'react-slick'

// states
import { HolyNameQuery } from 'recoils/selectors'

// utils
import StringUtils from 'utils/StringUtils'

export default function GroupInfo({ info }) {
  const lstHolyname = useRecoilValue(HolyNameQuery)

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thống kê Chi đoàn</h4>
        </div>
        <div className="card-header--actions">
          <Box>
            <IconButton size="medium" variant="outlined" color="primary" onClick={() => history.push('/PDT/StudentGroup')}>
              <FontAwesomeIcon icon={faChevronRight} className="opacity-8 font-size-xs ml-1" />
            </IconButton>
          </Box>
        </div>
      </div>

      <Slider {...settings} style={{ padding: '10px' }}>
        {info?.summaryInfo?.map(item => (
          <CardContent className="p-1" key={`Group-Info-${item.unionCode}`}>
            <Grid container spacing={3} className="mt-1" justifyContent="center">
              <Grid container item xs={12} justifyContent="center">
                <Typography variant="h4">Chi đoàn {item.unionCode}</Typography>
              </Grid>

              <Grid container item xs={12}>
                <Grid xs={12}>
                  Huynh trưởng phụ trách:
                </Grid>
                <Grid container xs={12} justifyContent="center" className='mt-1 mb-2'>
                  {item.assignments?.map(ass => (
                      <Grid item xs={12} lg={6} key={ass.id} className="text-center mt-1">
                        <Typography variant="h5">
                          {StringUtils.holyNameLookup(lstHolyname, ass.user.holyNameId)} {ass.user.firstName} {ass.user.lastName}
                        </Typography>
                      </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={4}>
                <div className="text-center">
                  <div>
                    <FontAwesomeIcon icon={faUsers} className="font-size-xxl text-success" />
                  </div>
                  <div className="mt-3 line-height-sm">
                    <b className="font-size-lg">{item.totalStudent}</b>
                    <span className="text-black-50 d-block">Tổng Đoàn sinh</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="text-center">
                  <div>
                    <FontAwesomeIcon icon={faUserPlus} className="font-size-xxl text-warning" />
                  </div>
                  <div className="mt-3 line-height-sm">
                    <b className="font-size-lg">{item.totalNewStudent}</b>
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
                    <b className="font-size-lg">{item.totalOldStudent}</b>
                    <span className="text-black-50 d-block">Đoàn sinh cũ</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="text-center">
                  <div>
                    <FontAwesomeIcon icon={faMale} className="font-size-xxl text-danger" />
                  </div>
                  <div className="mt-3 line-height-sm">
                    <b className="font-size-lg">{item.maleStudent}</b>
                    <span className="text-black-50 d-block">Nam</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="text-center">
                  <div>
                    <FontAwesomeIcon icon={faFemale} className="font-size-xxl text-success" />
                  </div>
                  <div className="mt-3 line-height-sm">
                    <b className="font-size-lg">{item.femaleStudent}</b>
                    <span className="text-black-50 d-block">Nữ</span>
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
                      {item.totalStudentLeave} | {item.totalStudentChangeChurch}
                    </b>
                    <span className="text-black-50 d-block">Nghỉ luôn | Chuyển xứ</span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        ))}
      </Slider>
    </Card>
  )
}
