import { atom, selector } from 'recoil'

import { orderBy } from 'lodash'

import sessionHelper from 'utils/sessionHelper'
import { doGet } from 'utils/axios'
import { UnionQuery } from 'recoils/selectors'

export const ReloadStudents = atom({
  key: 'reloadStudents',
  default: 0
})

export const StudentsQuery = selector({
  key: 'studentsQuery',
  get: async ({ get }) => {
    get(ReloadStudents)
    const lstUnion = get(UnionQuery)

    const { userId, scholasticId, classId, unionId } = sessionHelper()

    var res = await doGet(`student/getStudents`, { scholasticId, userId, classId, unionId })

    if (res && res.data.success) {
      const lstStudent = [{ unionId: 1, unionCode: 0, students: [] }]

      // Tạo mảng danh sách chi đoàn
      for (const t of lstUnion) {
        lstStudent.push({ unionId: t.unionId, unionCode: t.unionCode, students: [] })
      }
      if (res.data.data) {
        const stuRes = res.data.data

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
        return orderBy(lstStudent, ['union'], ['asc'])
      }
    }
    return null
  }
})
