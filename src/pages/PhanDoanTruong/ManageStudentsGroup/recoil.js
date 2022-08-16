import { atom, selector } from 'recoil'
import _ from 'lodash'
// import slugify from 'slugify'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { UnionQuery } from 'recoils/selectors'

export const ReloadStudentGroup = atom({
  key: 'reloadStudentGroup',
  default: 0
})

export const StudentsGroupQuery = selector({
  key: 'studentsGroupQuery',
  get: async ({ get }) => {
    get(ReloadStudentGroup)
    // const searchKey = get(SearchGroupStudent)

    const userId = sessionHelper().userId
    const scholasticId = sessionHelper().scholasticId
    const classId = sessionHelper().classId

    const lstUnion = get(UnionQuery)

    var res = await doGet(`student/getStudentInGroup`, { scholasticId, userId, classId })

    if (res && res.data.success) {
      // const distinctUnion = [...new Set(res.result.map(x => x.studentClass.find(sc => sc.classId === x.classId).unionId))]
      const lstStudent = [{ unionId: 1, unionCode: 0, students: [] }]

      // Tạo mảng danh sách chi đoàn
      for (const t of lstUnion) {
        lstStudent.push({ unionId: t.unionId, unionCode: t.unionCode, students: [] })
      }
      if (res.data.data) {
        const stuRes = res.data.data

        // if (searchKey) {
        //   let keys = slugify(searchKey, { lower: true })
        //   stuRes = stuRes.filter(stu => slugify(`${stu.stuFirstName}-${stu.stuLastName}`, { lower: true }).includes(keys))
        // }

        // Đưa từng Đoàn sinh vô chi đoàn
        for (const stu of stuRes) {
          const stuUnionId = stu?.studentClass?.find(sc => sc.classId === stu.classId)?.unionId
          if (stuUnionId === 1) {
            lstStudent[0].students.push(stu)
          } else {
            lstStudent.forEach(t => {
              if (t.unionId === stuUnionId) {
                t.students.push(stu)
              }
            })
          }
        }
        return _.orderBy(lstStudent, ['union'], ['asc'])
      }
    }
    return null
  }
})

export const StudentEdit = atom({
  key: 'studentEdit',
  default: undefined
})

export const ShowStudentDetail = atom({
  key: 'showStudentDetail',
  default: false
})

export const SearchGroupStudent = atom({
  key: 'searchGroupStudent',
  default: undefined
})
