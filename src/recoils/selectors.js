import { selector } from 'recoil'
import { themeOptionsState, reloadTemplates } from './atoms'
import config from 'config'
import { doGet } from 'utils/axios'
import _ from 'lodash'
import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'

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
    let res = await doGet(`${config.ApiEndpoint}/holyname/getall`)

    if (res && res.data && res.data.success) return _.orderBy(res.data.data, ['name'], ['asc'])
    else return null
  }
})

export const BranchQuery = selector({
  key: 'BranchQuery',
  get: async () => {
    let res = await doGet(`${config.ApiEndpoint}/class/getBranch`)

    if (res && res.data.success) return _.orderBy(res.data.data, ['branchOrder'], ['asc'])
    else return null
  }
})

export const GroupQuery = selector({
  key: 'GroupQuery',
  get: async () => {
    let res = await doGet(`${config.ApiEndpoint}/class/getGroup`)

    if (res && res.data.success) return _.orderBy(res.data.data, ['groupId'], ['asc'])
    else return null
  }
})

export const UnionQuery = selector({
  key: 'UnionQuery',
  get: async () => {
    const userId = sessionHelper().userId
    const scholasticId = sessionHelper().scholasticId

    let res = await doGet(`${config.ApiEndpoint}/assignment/getListUnionInGroup`, { scholasticId: scholasticId, userId: userId })

    if (res && res.data.success) {
      return _.orderBy(res.data.data, ['unionCode'], ['asc'])
    }
    return null
  }
})

export const TemplatesQuery = selector({
  key: 'TemplatesQuery',
  get: async ({ get }) => {
    get(reloadTemplates)

    let userRoles = sessionHelper().roles
    let res = await doGet(`${config.ApiEndpoint}/template/get`)

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
