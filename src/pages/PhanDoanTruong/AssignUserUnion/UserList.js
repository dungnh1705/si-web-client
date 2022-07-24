import React, { Suspense, useState } from 'react'
import { Card, Tooltip, IconButton, Grid } from '@material-ui/core'
import _ from 'lodash'
import { useRecoilValue } from 'recoil'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { UnionQuery } from 'recoils/selectors'
import UserListItem from './UserListItem'

const UserList = ({ item }) => {
  const [collapse, setCollapse] = useState(false)
  const lstUnion = useRecoilValue(UnionQuery)

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  return (
    <Suspense>
      <Card className="card-box mb-1 w-100">
        <div className="card-header d-flex pb-1 pt-1" onClick={handleCollapse} style={{ cursor: 'pointer' }}>
          <div className="card-header--title">
            {item.unionId === 1 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân chi đoàn - {item?.assigns?.length}</h4>}
            {item.unionId !== 1 && (
              <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                Chi đoàn: {lstUnion?.find(u => u.unionId == item.unionId)?.unionCode} - {item?.assigns?.length}
              </h4>
            )}
          </div>
          <Grid container item xs={4} justifyContent="flex-end">
            <div className="card-header--actions">
              <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                <IconButton color="primary">{collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}</IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>
        <div className="table-responsive" hidden={collapse}>
          <table className="table table-hover text-nowrap mb-0">
            <thead>
              <tr>
                {item.unionId === 1 && <th></th>}
                <th>Tên Thánh, Họ và Tên</th>
                {item.unionId !== 1 && <th></th>}
              </tr>
            </thead>
            <tbody>
              {_.orderBy(item?.assigns, ['LastName'], ['asc']).map((assign, index) => {
                return <UserListItem key={`user-class-${assign.id}-${index}`} assign={assign} />
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Suspense>
  )
}

export default UserList
