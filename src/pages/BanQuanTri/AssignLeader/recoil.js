import { atom, selector } from 'recoil'
import _ from 'lodash'
import sessionHelper from 'utils/sessionHelper'

import { doGet } from 'utils/axios'
import { UserStatus } from 'app/enums'

export const ReloadClasses = atom({
  key: 'ReloadClasses',
  default: 1
})

export const ClassesQuery = selector({
  key: 'ClassesQuery',
  get: async ({ get }) => {
    get(ReloadClasses)

    const res = await doGet(`class/getClasses`, { scholasticId: sessionHelper().scholasticId })
    if (res && res.data.success) {
      return _.orderBy(res.data.data, item => item.group.branch.branchOrder, ['asc'])
    }
  }
})

export const UsersQuery = selector({
  key: 'UsersQuery',
  get: async () => {
    var res = await doGet(`user/getUsers`, { scholasticId: sessionHelper().scholasticId })

    if (res && res.data.success) {
      return _.orderBy(
        res.data.data.filter(user => user.status == UserStatus.Active),
        ['lastName'],
        ['asc']
      )
    }
  }
})
