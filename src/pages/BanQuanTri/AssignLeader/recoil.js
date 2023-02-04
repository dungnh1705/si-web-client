import { atom, selector } from 'recoil'
import _ from 'lodash'
import sessionHelper from 'utils/sessionHelper'

import { doGet } from 'utils/axios'
import { UserStatus } from 'app/enums'
import FileUtils from 'utils/FileUtils'
import { storageState } from 'recoils/firebase'

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
  get: async ({ get }) => {
    const storage = get(storageState)

    const res = await doGet(`user/getUsers`, { scholasticId: sessionHelper().scholasticId })

    if (res && res.data.success) {
      const users = _.orderBy(
        res.data.data.filter(user => user.status === UserStatus.Active),
        ['lastName'],
        ['asc']
      )

      const avatarPromises = users.map(async user => {
        if (user.croppedAvatarId) {
          const avatars = await FileUtils.getFiles(storage, `avatars/${user.id}`)
          const userAvatar = avatars.find(img => img.fileName === `${user.croppedAvatarId}.png`)

          return { ...user, avatarUrl: userAvatar }
        }

        return user
      })
      return await Promise.all(avatarPromises)
    }
  }
})
