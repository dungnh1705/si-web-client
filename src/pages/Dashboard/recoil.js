import { atom, selector } from 'recoil'

import config from 'config'
import { doGet } from 'utils/axios'

import sessionHelper from 'utils/sessionHelper'

export const classSummaryQuery = selector({
  key: 'classSummaryQuery',
  get: async () => {
    const { classId, unionId, scholasticId } = sessionHelper()

    var res = await doGet(`${config.ApiEndpoint}/dashboard/classSummary`, { scholasticId: scholasticId, classId: classId, unionId: unionId })

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
  get: async () => {
    const { userId, scholasticId } = sessionHelper()

    var res = await doGet(`${config.ApiEndpoint}/dashboard/groupSummary`, { scholasticId: scholasticId, userId: userId })

    if (res && res.data.data) {
      const { data } = res.data

      return data.groupSummary
    }

    return null
  }
})
