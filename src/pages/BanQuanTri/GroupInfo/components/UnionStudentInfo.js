import React from 'react'
import { useRecoilValue } from 'recoil'
import { StudentsInUnionSelector } from 'pages/BanQuanTri/GroupInfo/recoil'
import UnionStudentInfoItem from './UnionStudentInfoItem'

export default function UnionStudentInfo() {
  const unionStudentInfo = useRecoilValue(StudentsInUnionSelector)

  return <>{unionStudentInfo.length > 0 && unionStudentInfo?.map(item => <UnionStudentInfoItem item={item} key={`student-in-union-${item.team}`} />)}</>
}
