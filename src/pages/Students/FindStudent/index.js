import React, { useState, Fragment, Suspense } from 'react'
import { Grid, Card, AppBar, Tabs, Tab } from '@material-ui/core'
import { SyncLoader } from 'react-spinners'

import StudentInfo from './StudentInfo'
import StudentScore from './StudentScore'
import { DialerDialog, DocumentPreviewDialog } from 'components/Dialog'
import StudentList from './StudentList'
import ModalSkeleton from 'components/Loading/modal-skeleton'

const FindStudents = () => {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Fragment>
      <Grid container spacing={2} justifyContent="center">
        <Grid container item xs={12} lg={3} alignItems="flex-start" justifyContent="flex-start">
          <Suspense fallback={<SyncLoader color={'#5383ff'} />}>
            <StudentList />
          </Suspense>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Card>
            <div className="card-header-alt d-flex justify-content-between p-3">
              <div>
                <h6 className="font-weight-bold font-size-lg mb-1 text-black">Thông tin Đoàn sinh</h6>
              </div>
            </div>
            <div className="card-body-alt pt-1 px-4 pb-4">
              <Grid container spacing={4}>
                <Grid item xs={12} lg={12}>
                  <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                      <Tab label="Thông tin cá nhân" />
                      <Tab label="Quá trình học tập" />
                    </Tabs>
                  </AppBar>
                  <StudentInfo tabValue={value} />
                  <StudentScore tabValue={value} />
                </Grid>
              </Grid>
            </div>
          </Card>
        </Grid>
      </Grid>
      <Suspense fallback={<ModalSkeleton loading={true} />}>
        <DialerDialog />
        <DocumentPreviewDialog />
      </Suspense>
    </Fragment>
  )
}

export default FindStudents
