import React, { Fragment } from 'react'

import { useRecoilValue } from 'recoil'
import { GetTeamsInfoSelector } from './recoil'

import UnionTeamItem from './UnionTeamItem'
import { GroupSettingsQuery } from 'recoils/selectors'

const UnionTeams = () => {
  const teams = useRecoilValue(GetTeamsInfoSelector)
  const groupSettings = useRecoilValue(GroupSettingsQuery)

  return (
    <Fragment>
      {teams?.map(item => (
        <UnionTeamItem team={item.team} totalStudents={item.totalStudents} key={`UnionTeam-${item.team}`} form={groupSettings?.scoreForm} />
      ))}
    </Fragment>
  )
}

export default UnionTeams
