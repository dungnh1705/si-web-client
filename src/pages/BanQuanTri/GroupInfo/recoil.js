import { atom, selector } from 'recoil'
import { doGet } from 'utils/axios'

import _ from 'lodash'

import sessionHelper from 'utils/sessionHelper'

export const GroupSelected = atom({
  key: 'GroupSelected',
  default: undefined
})

export const UnionSelected = atom({
  key: 'UnionSelected',
  default: undefined
})

export const GroupSummaryInfoSelector = selector({
  key: 'GroupSummaryInfoSelector',
  get: async ({ get }) => {
    const { userId, scholasticId } = sessionHelper()
    const selectedGroup = get(GroupSelected)

    const data = selectedGroup
      ? {
          scholasticId,
          userId: selectedGroup.leaderId
        }
      : { scholasticId, userId }

    var res = await doGet(`dashboard/groupSummaryInfo`, data)

    if (res && res.data.data) {
      const { data } = res.data

      return data.groupSummary
    }

    return null
  }
})

export const UnionInGroupSelector = selector({
  key: 'UnionInGroupSelector',
  get: async ({ get }) => {
    const selectedGroup = get(GroupSelected)
    const scholasticId = sessionHelper().scholasticId

    if (selectedGroup) {
      let res = await doGet(`assignment/getListUnionInGroup`, { scholasticId: scholasticId, userId: selectedGroup.leaderId })

      if (res && res.data.success) {
        return _.orderBy(res.data.data, ['unionCode'], ['asc'])
      }
    }
    return []
  }
})

export const StudentsInUnionSelector = selector({
  key: 'StudentsInUnionSelector',
  get: async ({ get }) => {
    const selectedGroup = get(GroupSelected)
    const unionIdSelected = get(UnionSelected)
    if (unionIdSelected && selectedGroup) {
      const classId = selectedGroup.id

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
    }

    return []
  }
})

export const AssignmentOfUnionSelector = selector({
  key: 'AssignmentOfUnionSelector',
  get: async ({ get }) => {
    const groupSelected = get(GroupSelected)
    const unionIdSelected = get(UnionSelected)

    if (unionIdSelected && groupSelected) {
      const classId = groupSelected.id

      const res = await doGet(`assignment/getAssignmentInUnion`, { classId, unionId: unionIdSelected })
      if (res && res.data.success) {
        return res.data.data
      }
    }

    return []
  }
})
