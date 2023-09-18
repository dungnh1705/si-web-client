import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'
import { studentsInUnionQuery } from '../recoil'
import UnionSelectedStudentItem from './UnionSelectedStudentItem'


export default function() {
  const unionStudentInfo = useRecoilValue(studentsInUnionQuery)

  if (unionStudentInfo && unionStudentInfo.length === 0) return <></>
  
  return <Fragment>
    {unionStudentInfo.map(item => <UnionSelectedStudentItem item={item} key={`student-in-union-${item.team}`} />)}
  </Fragment>
}
