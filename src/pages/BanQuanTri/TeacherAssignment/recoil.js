import { atom, selector } from 'recoil'
import sessionHelper from 'utils/sessionHelper'

import { UserStatus } from 'app/enums'
import { doGet } from 'utils/axios'

export const ReloadAssignmentsAtom = atom({
  key: 'ReloadAssignments',
  default: 0
})

export const ReloadUsersQueryAtom = atom({
  key: 'ReloadUsersQueryAtom',
  default: 0
})

export const ClassSelector = selector({
  key: 'ClassSelector',
  get: async ({ get }) => {
    get(ReloadAssignmentsAtom)
    const scholasticId = sessionHelper().scholasticId

    const res = await doGet(`class/getClass`, { scholasticId: scholasticId })

    if (res && res.data.success) {
      return res.data.data
    }

    return []
  }
})

export const UsersAvailableSelector = selector({
  key: 'UsersAvailableSelector',
  get: async ({ get }) => {
    get(ReloadAssignmentsAtom)

    const res = await doGet(`user/getUserAssign`, { scholasticId: sessionHelper().scholasticId })

    if (res && res.data.success) {
      const result = res.data.data.map(item => {
        return {
          id: item.id,
          label: item.fullName
        }
      })

      return result
    }

    return []
  }
})

export const UsersQuerySelector = selector({
  key: 'UsersQuerySelector',
  get: async ({ get }) => {
    get(ReloadUsersQueryAtom)

    const res = await doGet(`user/getUsers`, { scholasticId: sessionHelper().scholasticId })

    if (res && res.data.success) {
      return res.data.data
        .filter(user => user.status === UserStatus.Active)
        .map(item => {
          return { id: item.id, label: item.fullName }
        })
    }

    return []
  }
})
