import React, { useState, Suspense } from 'react'
import { Card, IconButton, CardContent, Grid, Tooltip, Button, ButtonGroup, Divider } from '@material-ui/core'
import moment from 'moment'
import _ from 'lodash'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StudentAbsentItem from './StudentAbsentItem'
import { AbsentMode } from 'app/enums'

const StudentAbsent = ({ month }) => {
  const [collapse, setCollapse] = useState(true)
  let [abMode, setAbMode] = useState(1)

  const lstWeek = _.chain(month?.item)
    .groupBy('dateAbsent')
    .map((value, key) => ({ date: key, students: value }))
    .value()

  return (
    <Grid item xs={12}>
      <Card className="card-box mb-1 w-100">
        <div className="card-header d-flex pb-1 pt-1" onClick={() => setCollapse(!collapse)} style={{ cursor: 'pointer' }}>
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Tháng {month?.year}</h4>
          </div>
          <Grid container item xs={10} justifyContent="flex-end">
            <div className="card-header--actions">
              <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                <IconButton color="primary">{collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}</IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>
        <Divider />
        <CardContent hidden={collapse}>
          <div className="mb-2">
            <ButtonGroup variant="contained" aria-label="contained primary button group">
              <Button color={abMode === AbsentMode.Mass ? 'primary' : 'default'} onClick={() => setAbMode(AbsentMode.Mass)}>
                Lễ
              </Button>
              <Button color={abMode === AbsentMode.Class ? 'primary' : 'default'} onClick={() => setAbMode(AbsentMode.Class)}>
                Học
              </Button>
            </ButtonGroup>
          </div>
          <div className="table-responsive" hidden={collapse}>
            <table className="table table-hover text-nowrap mb-0">
              <thead>
                <tr>
                  <th rowSpan="2">Tên Thánh, Họ và Tên</th>
                  <th colSpan="2" style={{ textAlign: 'center' }}>
                    Tổng
                  </th>
                  {lstWeek?.map((d, i) => {
                    return (
                      <th colSpan="2" style={{ textAlign: 'center' }} key={`week-${d.date}`}>
                        {moment(d.date).format('DD')}
                      </th>
                    )
                  })}
                </tr>
                <tr>
                  <th style={{ textAlign: 'center' }}>P</th>
                  <th style={{ textAlign: 'center' }}>KP</th>
                  {lstWeek?.map((d, i) => {
                    return (
                      <Suspense key={`rows-${i * 33}`}>
                        <th style={{ textAlign: 'center' }}>P</th>
                        <th style={{ textAlign: 'center' }}>KP</th>
                      </Suspense>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                <StudentAbsentItem month={month} mode={abMode} />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default StudentAbsent
