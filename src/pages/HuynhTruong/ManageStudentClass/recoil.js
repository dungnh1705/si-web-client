import { atom, selector } from 'recoil'
import _, { lt } from 'lodash'

import { AbsentMode } from 'app/enums'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

export const ReloadStudentClass = atom({
  key: 'ReloadStudentClass',
  default: 0
})

export const AbsentViewMode = atom({
  key: 'AbsentViewMode',
  default: AbsentMode.Mass
})

export const StudentsQuery = selector({
  key: 'StudentsQuery',
  get: async ({ get }) => {
    get(ReloadStudentClass)
    const { classId, unionId } = sessionHelper()

    if (Number(unionId) !== 1) {
      var res = await doGet(`student/getStudentInClass`, { classCode: classId, unionId: unionId })

      if (res && res.data.success && res.data.data) {
        const stuRes = res.data.data

        const distinctTeam = [...new Set(stuRes?.map(x => x.studentClass.find(sc => Number(sc.classId) === Number(classId))?.team))]
        const lstStudent = []

        for (const t of distinctTeam) {
          if (t === 0) lstStudent.push({ team: 0, students: [] })
          if (t !== 0) lstStudent.push({ team: t, students: [] })
        }

        for (const stu of stuRes) {
          lstStudent.forEach(t => {
            if (t.team === stu.studentClass.find(sc => Number(sc.classId) === Number(classId)).team) {
              if (stu.studentClass.find(sc => Number(sc.classId) === Number(classId)).isTeamLead) {
                t.students.push({ ...stu, isTeamLead: true })
              } else {
                t.students.push({ ...stu, isTeamLead: false })
              }
            }
          })
        }

        return _.orderBy(lstStudent, ['team'], ['asc'])
      }
    }
    return null
  }
})

export const AssignmentQuery = selector({
  key: 'AssignmentQuery',
  get: async () => {
    const { classId, userId } = sessionHelper()

    var res = await doGet(`assignment/getAssignmentByClass`, { classId: classId, userId: userId })

    if (res && res.data.success) {
      const totalTeam = res.data.data.union.totalTeam
      return Array.from({ length: totalTeam }, (v, i) => i + 1)
    } else return null
  }
})
