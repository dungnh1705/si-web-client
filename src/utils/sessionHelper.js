import jwt from 'jsonwebtoken'
import _ from 'lodash'
import StringUtils from './StringUtils'
import { Roles } from '../app/enums'

const LOGIN_INFO_KEY = 'login_info'
const secretKey = process.env.REACT_APP_SECRET_KEY

export function saveLocalStorage(key, value) {
  localStorage.setItem(key, value)
}

export function getLocalStorage(key) {
  return localStorage.getItem(key)
}

export function setLocalStoreData(key, data) {
  const localData = JSON.parse(localStorage.getItem(LOGIN_INFO_KEY))
  localData[key] = data

  localStorage.setItem(LOGIN_INFO_KEY, JSON.stringify(localData))
}

export function saveLoginData(data) {
  localStorage.setItem(LOGIN_INFO_KEY, JSON.stringify(data))
}

export function deleteLoginData() {
  localStorage.removeItem(LOGIN_INFO_KEY)
}

export function checkSession() {
  return localStorage.getItem(LOGIN_INFO_KEY) ? true : false
}

export function getMaxRole(roles = [], isCheckLoginUser = true) {
  if (roles.length > 0) {
    let maxRoles = _.max(
      roles.map(e => {
        return e.id
      })
    )
    return StringUtils.buildRoleName(maxRoles)
  } else {
    /// Trường hợp check User đang login
    if (isCheckLoginUser) {
      const localData = JSON.parse(localStorage.getItem(LOGIN_INFO_KEY))

      let maxRoles = _.max(localData.roles)
      return StringUtils.buildRoleName(maxRoles)
    }

    /// nếu có UserId mà k có roles th return ""
    return ''
  }
}

export function getLevel(roles = [], isCheckLoginUser = true) {
  if (roles.length > 0) {
    const rolesId = roles.map(e => {
      return e.id
    })
    if (rolesId.includes(Roles.HuynhTruong)) return 'HT'
    if (rolesId.includes(Roles.DuTruong)) return 'DT'
    return ''
  } else {
    if (isCheckLoginUser) {
      const localData = JSON.parse(localStorage.getItem(LOGIN_INFO_KEY))

      if (localData.roles.includes(Roles.HuynhTruong)) return 'HT'
      if (localData.roles.includes(Roles.DuTruong)) return 'DT'
      return ''
    }

    return ''
  }
}

export function checkLoginToken() {
  try {
    const loginInfo = localStorage.getItem(LOGIN_INFO_KEY)

    if (loginInfo == null) {
      return false
    }

    const token = JSON.parse(loginInfo).token
    if (token) {
      const auth = jwt.verify(token, secretKey)
      if (auth) {
        if (Date.now() >= auth.exp * 1000) {
          deleteLoginData()
          return false
        } else {
          return true
        }
      }
    }

    deleteLoginData()
    return false
  } catch (err) {
    return false
  }
}

const sessionHelper = () => {
  return { ...JSON.parse(localStorage.getItem(LOGIN_INFO_KEY)) }
}

export default sessionHelper
