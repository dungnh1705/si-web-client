import { atom, selector } from 'recoil'
import _ from 'lodash'
import sessionHelper from 'utils/sessionHelper'

import config from 'config'
import { doGet } from 'utils/axios'

export const ReloadListAssign = atom({
  key: 'ReloadListAssign',
  default: 1
})

export const SelectedBranch = atom({
  key: 'SelectedBranch',
  default: 'CC'
})

export const ClassQueryForAssign = selector({
  key: 'ClassQueryForAssign',
  get: async ({ get }) => {
    get(ReloadListAssign)
    const scholasticId = sessionHelper().scholasticId

    const res = await doGet(`class/getClass`, { scholasticId: scholasticId })

    if (res && res.data.success) {
      return _.orderBy(res.data.data, ['id'], ['asc'])
    }
  }
})

export const UserQueryForAssign = selector({
  key: 'UserQueryForAssign',
  get: async ({ get }) => {
    get(ReloadListAssign)
    const res = await doGet(`user/getUserAssign`)

    if (res && res.data.success) {
      return _.orderBy(res.data.data, ['lastName'], ['asc'])
    }
  }
})
