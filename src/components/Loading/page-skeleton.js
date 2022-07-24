import * as React from 'react'
import { Skeleton } from '@material-ui/lab'
import { Card, Grid } from '@material-ui/core'

const PageSkeleton = () => {
  return (
    <Grid container spacing={2} style={{ marginTop: '20px' }}>
      <Grid item xs={12} sm={12} lg={6}>
        <Card className="card-box mb-2 w-100">
          <div className="card-header d-flex pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                <Skeleton />
              </h4>
            </div>
            <Grid container item xs={4} justifyContent="flex-end">
              <div className="card-header--actions">
                <Skeleton />
              </div>
            </Grid>
          </div>
          <div className="table-responsive">
            <table className="table table-hover text-nowrap mb-0">
              <thead>
                <tr>
                  <th>
                    <Skeleton />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Skeleton />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} lg={6}>
        <Card className="card-box mb-2 w-100">
          <div className="card-header d-flex pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                <Skeleton />
              </h4>
            </div>
            <Grid container item xs={4} justifyContent="flex-end">
              <div className="card-header--actions">
                <Skeleton />
              </div>
            </Grid>
          </div>
          <div className="table-responsive">
            <table className="table table-hover text-nowrap mb-0">
              <thead>
                <tr>
                  <th>
                    <Skeleton />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Skeleton />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PageSkeleton
