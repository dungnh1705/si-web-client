import { atom, selector } from 'recoil'

import { orderBy } from 'lodash'

import sessionHelper from 'utils/sessionHelper'
import { doGet } from 'utils/axios'
import { UnionQuery } from 'recoils/selectors'
import { Roles } from 'app/enums'

export const ReloadStudents = atom({
  key: 'reloadStudents',
  default: 0
})

export const NewUnionIdSelected = atom({
  key: 'newUnionIdSelected',
  default: undefined
})

export const ActiveButton = atom({
  key: 'activeButton',
  default: 0
})

export const ActiveStep = atom({
  key: 'activeStep',
  default: 0
})

export const StudentSelected = atom({
  key: 'studentSelected',
  default: []
})

export const TypeSelected = atom({
  key: 'typeSelected',
  default: 0
})

export const UnionSelected = atom({
  key: 'unionSelected',
  default: 0
})

export const UnionLeftSide = atom({
  key: 'UnionIdLeftSide',
  default: 1
})

export const TeamLeftSide = atom({
  key: 'TeamIdLeftSide',
  default: 0
})

export const UnionRightSide = atom({
  key: 'unionIdRightSide',
  default: 1
})

export const TeamRightSide = atom({
  key: 'TeamRightSide',
  default: 0
})

export const StudentsQuery = selector({
  key: 'studentsQuery',
  get: async ({ get }) => {
    get(ReloadStudents)
    const lstUnion = get(UnionQuery)

    const { userId, scholasticId, classId, unionId, roles } = sessionHelper()
    const isGetAll = roles.includes(Roles.PhanDoanTruong) || roles.includes(Roles.HocTap)

    const res = await doGet(`student/getStudents`, { scholasticId, userId, classId, unionId, isGetAll })

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
