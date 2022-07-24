import { atom, selector } from 'recoil'
import _ from 'lodash'
import config from 'config'
import sessionHelper from 'utils/sessionHelper'

import { doGet } from 'utils/axios'

export const ReloadUserInGroup = atom({
  key: 'reloadUserInGroup',
  default: 1
})

export const AssignmentIdSelected = atom({
  key: 'assignmentIdSelected',
  default: []
})

export const UserInGroupQuery = selector({
  key: 'userInGroupQuery',
  get: async ({ get }) => {
    get(ReloadUserInGroup)

    const scholasticId = sessionHelper().scholasticId
    const userId = sessionHelper().userId

    const res = await doGet(`user/getUserInGroup`, { scholasticId: scholasticId, userId: userId })

    if (res && res.data.success) {
      const result = _.chain(res.data.data)
        .groupBy('unionId')
        .map((value, key) => ({ unionId: Number(key), assigns: value }))
        .value()

      return result
    }
  }
})
