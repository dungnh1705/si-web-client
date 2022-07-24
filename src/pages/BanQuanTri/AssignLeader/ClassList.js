import { Grid } from '@material-ui/core'
import React from 'react'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import { ClassesQuery, UsersQuery } from './recoil'
import ClassListItem from './ClassListItem'

const ClassList = () => {
  const lstClass = useRecoilValue(ClassesQuery)
  const lstUser = useRecoilValue(UsersQuery)

  return (
    <Grid container spacing={2} justifyContent="center">
      {lstClass?.map((item, index) => {
        const filterUsers = _.filter(lstUser, e => {
          if (
            !lstClass
              .map(cl => {
                return cl.leaderId
              })
              .includes(e.id) ||
            e.id === item.leaderId
          )
            return e
        })

        return (
          <Grid item xs={12} md={6} lg={4} key={`class-${index}`}>
            <ClassListItem classInfo={item} users={filterUsers} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ClassList
