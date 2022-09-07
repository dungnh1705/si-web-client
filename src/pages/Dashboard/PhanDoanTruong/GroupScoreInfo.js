import React, { useState } from 'react'
import { Card, CardContent, Grid, LinearProgress, Box, IconButton, ButtonGroup, Button } from '@material-ui/core'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

// components
import { history } from 'App'
import _ from 'lodash'
import accounting from 'accounting'

// constance
import { Ranking } from 'app/enums'

export default function GroupScoreInfo({ info }) {
  const totalGroupStudent = _.sumBy(info?.summaryInfo, i => i.totalStudent)
  const [view, setView] = useState(1)

  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thống kê Phân đoàn</h4>
        </div>
        <div className="card-header--actions">
          <Box>
            <IconButton size="medium" variant="outlined" color="primary" onClick={() => history.push('/PDT/StudentGroupScore')}>
              <FontAwesomeIcon icon={faChevronRight} className="opacity-8 font-size-xs ml-1" />
            </IconButton>
          </Box>
        </div>
      </div>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item>
            <ButtonGroup>
              <Button variant="contained" onClick={() => setView(1)} color={view == 1 ? 'primary' : 'default'}>
                HKI
              </Button>
              <Button variant="contained" onClick={() => setView(2)} color={view == 2 ? 'primary' : 'default'}>
                HKII
              </Button>
              <Button variant="contained" onClick={() => setView(3)} color={view == 3 ? 'primary' : 'default'}>
                Cả Năm
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <div className="p-2">
              {Ranking.map((e, index) => {
                const total = _.sumBy(info?.summaryInfo, i =>
                  view === 1
                    ? _.size(i.semesterOne.filter(so => so.ranking == e))
                    : view === 2
                    ? _.size(i.semesterTwo.filter(so => so.ranking == e))
                    : _.size(i.scoreTotal.filter(so => so.ranking == e))
                )

                const percent = Number(accounting.toFixed((total / totalGroupStudent) * 100, 1))

                return (
                  <div className="mb-4" key={`group-score-${view}-${index}`}>
                    <div className="line-height-1">
                      <span className="font-size-lg font-weight-bold pr-3">{total}</span>
                      <span className="text-muted">{e}</span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="flex-grow-1">
                        <LinearProgress value={percent} color="primary" variant="determinate" />
                      </div>
                      <div className="text-dark font-weight-bold pl-3">{percent} %</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
