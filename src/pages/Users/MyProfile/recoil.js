import { atom, selector } from 'recoil'
import sessionHelper from 'utils/sessionHelper'
import config from 'config'
import { doGet } from 'utils/axios'

export const ReloadUser = atom({
  key: 'ReloadUser',
  default: 1
})

export const ShowChangePassword = atom({
  key: 'ShowChangePassword',
  default: false
})

export const OpenEditAvatar = atom({ key: 'OpenEditAvatar', default: false })

export const UserQuery = selector({
  key: 'UserQuery',
  get: async ({ get }) => {
    get(ReloadUser)

    const res = await doGet(`user/getUser`, { userId: sessionHelper().userId })
    if (res && res.data.success) {
      return res.data.data
    }
  }
})
