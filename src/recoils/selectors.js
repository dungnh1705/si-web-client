import { selector, selectorFamily } from 'recoil'
import _ from 'lodash'

import { Roles } from 'app/enums'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { storageState } from 'recoils/firebase'

import { themeOptionsState, reloadTemplates, reloadListUnion, reloadUserAvatar } from './atoms'

export const themeOptionsActions = selector({
  key: 'themeOptionsActions',
  set: ({ set, get }, action) => {
    const themeOptions = get(themeOptionsState)
    set(themeOptionsState, { ...themeOptions, [action.name]: action.value })
  }
})

export const HolyNameQuery = selector({
  key: 'HolyNameQuery',
  get: async () => {
    let res = await doGet(`holyname/getall`)

    if (res && res.data && res.data.success) return _.orderBy(res.data.data, ['name'], ['asc'])
    else return []
  }
})

export const BranchQuery = selector({
  key: 'BranchQuery',
  get: async () => {
    let res = await doGet(`class/getBranch`)

    if (res && res.data.success) return _.orderBy(res.data.data, ['branchOrder'], ['asc'])
    else return []
  }
})

export const GroupQuery = selector({
  key: 'GroupQuery',
  get: async () => {
    let res = await doGet(`class/getGroup`)

    if (res && res.data.success) return _.orderBy(res.data.data, ['groupId'], ['asc'])
    else return []
  }
})

export const UnionQuery = selector({
  key: 'UnionQuery',
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

export const UnionRegisterQuery = selectorFamily({
  key: 'UnionRegisterQuery',
  get:
    groupId =>
    async ({ get }) => {
      get(reloadListUnion)
      const res = await doGet(`assignment/getUnionByGroupId`, { groupId })

      if (res && res.data.success) {
        const unionOrdered = _.orderBy(res.data.data, ['unionCode'], ['asc'])
        return unionOrdered
      }
      return []
    }
})

export const TemplatesQuery = selector({
  key: 'TemplatesQuery',
  get: async ({ get }) => {
    get(reloadTemplates)

    let userRoles = sessionHelper().roles
    let res = await doGet(`template/get`)

    if (res && res.data.success) {
      let result = []

      if (userRoles.includes(Roles.BanQuanTri)) return res.data.data

      res.data.data.forEach(item => {
        userRoles.forEach(r => {
          if (item.roleTemplate & r) result.push(item)
        })
      })
      return _.orderBy(result, ['name'], ['asc'])
    }
    return []
  }
})

export const UserAvatarQuery = selector({
  key: 'GetUserAvatar',
  get: async ({ get }) => {
    get(reloadUserAvatar)

    const storage = get(storageState)
    console.log(storage)
    const { userId, croppedAvatarId } = sessionHelper()

    const avatarFiles = await FileUtils.getFiles(storage, `avatars/${userId}`)
    const userAvatar = avatarFiles.find(img => img.fileName === `${croppedAvatarId}.png`)

    return userAvatar ? userAvatar.url : ''
  }
})
