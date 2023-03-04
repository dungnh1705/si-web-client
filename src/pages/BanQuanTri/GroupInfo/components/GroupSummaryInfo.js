import React from 'react'
import { Card, Grid } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import _ from 'lodash'
import accounting from 'accounting'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserSlash, faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons'

// components
import CountUp from 'react-countup'

import { GroupSummaryInfoSelector } from 'pages/BanQuanTri/GroupInfo/recoil'

export default function GroupSummaryInfo() {
  const groupSummaryInfo = useRecoilValue(GroupSummaryInfoSelector)

  const totalStudentInGroup = _.sumBy(groupSummaryInfo?.summaryInfo, i => i.totalStudent)
  const totalNewStudentInGroup = _.sumBy(groupSummaryInfo?.summaryInfo, i => i.totalNewStudent)
  const totalOldStudentInGroup = _.sumBy(groupSummaryInfo?.summaryInfo, i => i.totalOldStudent)
  const totalStudentLeaveInGroup = _.sumBy(groupSummaryInfo?.summaryInfo, i => i.totalStudentLeave + i.totalStudentChangeChurch)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} lg={3}>
        <Card className="card-box border-0 card-shadow-first p-4 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-40 rounded-circle bg-first text-white text-center font-size-lg mr-3">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div className="text-black-50">Tổng Đoàn sinh</div>
          </div>
          <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
            <CountUp start={0} end={totalStudentInGroup ?? 0} duration={1} separator="" decimals={0} decimal="" />
          </div>
          <div className="text-black-50 text-center opacity-6 pt-3">
            <b>100%</b>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Card className="card-box border-0 card-shadow-first p-4 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-40 rounded-circle bg-warning text-white text-center font-size-lg mr-3">
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            <div className="text-black-50">Đoàn sinh mới</div>
          </div>
          <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
            <CountUp start={0} end={totalNewStudentInGroup} duration={1} separator="" decimals={0} decimal="" prefix="" suffix="" />
          </div>
          <div className="text-black-50 text-center opacity-6 pt-3">
            <b>{accounting.toFixed((totalNewStudentInGroup / totalStudentInGroup) * 100, 2)} %</b>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Card className="card-box border-0 card-shadow-first p-4 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-40 rounded-circle bg-primary text-white text-center font-size-lg mr-3">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="text-black-50">Đoàn sinh cũ</div>
          </div>
          <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
            <CountUp start={0} end={totalOldStudentInGroup ?? 0} duration={2} separator="" decimals={0} decimal="" prefix="" suffix="" />
          </div>
          <div className="text-black-50 text-center opacity-6 pt-3">
            <b>{accounting.toFixed((totalOldStudentInGroup / totalStudentInGroup) * 100, 2)} %</b>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Card className="card-box border-0 card-shadow-first p-4 mb-4">
          <div className="d-flex align-items-center">
            <div className="d-40 rounded-circle bg-danger text-white text-center font-size-lg mr-3">
              <FontAwesomeIcon icon={faUserSlash} />
            </div>
            <div className="text-black-50">Nghỉ luôn | Chuyển xứ</div>
          </div>
          <div className="display-3 text-center line-height-sm text-second text-center d-flex align-items-center pt-3 justify-content-center">
            <CountUp start={0} end={totalStudentLeaveInGroup ?? 0} duration={2} separator="" decimals={0} decimal="" prefix="" suffix="" />
          </div>
          <div className="text-black-50 text-center opacity-6 pt-3">
            <b>{accounting.toFixed((totalStudentLeaveInGroup / totalStudentInGroup) * 100, 2)}%</b>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
