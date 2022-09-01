import React, { useState, Fragment, useEffect } from 'react'
import { Grid, Card, AppBar, Tabs, Tab } from '@material-ui/core'
import { useSetRecoilState } from 'recoil'
import { useParams } from 'react-router-dom'
// import { SyncLoader } from 'react-spinners'

import { DialerDialog, DocumentPreviewDialog } from 'components/Dialog'

import { SearchStudentId } from './recoil'
import StudentInfo from './StudentInfo'
import StudentScore from './StudentScore'

const FindStudents = () => {
  const { stuId } = useParams()

  const setStudentId = useSetRecoilState(SearchStudentId)

  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (stuId) setStudentId(stuId)
  }, [stuId])

  return (
    <Fragment>
      <Grid container spacing={2} justifyContent="center">
        {/* <Grid container item xs={12} lg={3} alignItems="flex-start">
          <Suspense fallback={<SyncLoader css={{ margin: 'auto', padding: 'auto' }} color={'#5383ff'} />}>
            <StudentList />
          </Suspense>
        </Grid> */}
        <Grid item xs={12}>
          <Card className="mt-3">
            {/* <div className="card-header-alt d-flex justify-content-between p-3">
              <div>
                <h6 className="font-weight-bold font-size-lg mb-1 text-black">Thông tin Đoàn sinh</h6>
              </div>
            </div> */}
            <div className="card-body-alt pt-2 px-2 pb-2">
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                      <Tab label="Thông tin Đoàn sinh" />
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

      <>
        <DialerDialog />
        <DocumentPreviewDialog />
      </>
    </Fragment>
  )
}

export default FindStudents
