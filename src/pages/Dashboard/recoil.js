import { atom, selector } from 'recoil'
import { doGet } from 'utils/axios'

import sessionHelper from 'utils/sessionHelper'

/// atom
export const selectedClass = atom({
  key: 'selectedClass',
  default: undefined
})

export const classSummaryQuery = selector({
  key: 'classSummaryQuery',
  get: async () => {
    const { classId, unionId, scholasticId } = sessionHelper()

    var res = await doGet(`dashboard/classSummary`, { scholasticId: scholasticId, classId: classId, unionId: unionId })

    if (res && res.data.data) {
      // console.log(res.data)
      const { data } = res.data

      return data.classSummary
    }

    return null
  }
})

export const groupSummaryQuery = selector({
  key: 'groupSummaryQuery',
  get: async ({ get }) => {
    const { userId, scholasticId } = sessionHelper()
    const classInfo = get(selectedClass)

    const data = classInfo
      ? {
          scholasticId,
          userId: classInfo.leaderId
        }
      : { scholasticId, userId }

    var res = await doGet(`dashboard/groupSummary`, data)

    if (res && res.data.data) {
      const { data } = res.data

      return data.groupSummary
    }

    return null
  }
})

export const totalGroupSummaryQuery = selector({
  key: 'totalGroupSummaryQuery',
  get: async () => {
    const { scholasticId } = sessionHelper()

    var res = await doGet(`dashboard/totalGroupInfoSummary`, { scholasticId })

    if (res && res.data.data) {
      const { data } = res.data
      // console.log(data)
      return data
    }

    return null
  }
})
