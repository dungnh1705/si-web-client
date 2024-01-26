import { atom, selector } from 'recoil'
import _ from 'lodash'

// utils
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

// enum
import { Roles, TemplateType } from 'app/enums'

export const groupUnionSelectedAtom = atom({
  key: 'groupUnionSelectedAtom',
  default: undefined
})

export const groupStudentIdSelectedAtom = atom({
  key: 'groupStudentIdSelectedAtom',
  default: []
})

export const checkAllIdsSelectedAtom = atom({
  key: 'checkAllIdsSelectedAtom',
  default: []
})

export const documentTemplateQuery = selector({
  key: 'documentTemplateQuery',
  get: async () => {
    const userRoles = sessionHelper().roles
    const classId = sessionHelper().classId

    const res = await doGet(`template/get`)

    if (res && res.data.success) {
      let result = []
      const { data } = res.data

      data.forEach(item => {
        if (item.isActive) {
          userRoles.forEach(r => {
            if (item.roleTemplate & r) {
              result.push(item)

              if (r === Roles.HuynhTruong && !classId) {
                delete result[result.length - 1]
              }
            }
          })
        }
      })

      result = _.uniqBy(result, 'id').filter(temp => temp?.templateType === TemplateType.Document)

      return _.orderBy(result, ['name'], ['asc'])
    }
    return []
  }
})

export const unionInGroupQuery = selector({
  key: 'unionInGroupQuery',
  get: async () => {
    const userId = sessionHelper().userId
    const scholasticId = sessionHelper().scholasticId

    let res = await doGet(`assignment/getListUnionInGroup`, { scholasticId: scholasticId, userId: userId })

    if (res && res.data.success) {
      return _.orderBy(res.data.data, ['unionCode'], ['asc'])
    }
    return []
  }
})

export const studentsInUnionQuery = selector({
  key: 'studentsInUnionQuery',
  get: async ({ get }) => {
    let unionIdSelected = get(groupUnionSelectedAtom)

    // Trường hợp không phải Phân đoàn trưởng
    if (!unionIdSelected) {
      unionIdSelected = sessionHelper().unionId
    }
    const classId = sessionHelper().classId

    const res = await doGet(`student/getStudentInUnion`, { classId, unionId: unionIdSelected })

    if (res && res.data.success) {
      const { data } = res.data

      const distinctTeam = [...new Set(data?.map(x => x.studentClass.find(sc => Number(sc.classId) === Number(classId))?.team))]
      const lstStudent = []

      for (const t of distinctTeam) {
        lstStudent.push({ team: t, students: [] })
      }

      for (const student of data) {
        lstStudent.forEach(t => {
          if (t.team === student.studentClass.find(sc => Number(sc.classId) === Number(classId)).team) {
            if (student.studentClass.find(sc => Number(sc.classId) === Number(classId)).isTeamLead) {
              t.students.push({ ...student, isTeamLead: true })
            } else {
              t.students.push({ ...student, isTeamLead: false })
            }
          }
        })
      }

      return _.orderBy(lstStudent, ['team'], ['asc'])
    }

    return []
  }
})
