import axios from 'axios'
import { history } from 'App'
import moment from 'moment'

import saveAs from 'save-as'
import sessionHelper from './sessionHelper'

const apiEndpoint = process.env.REACT_APP_WEB_API

axios.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error' && !error.response) {
      return Promise.reject(error)
    }
    if (!error.response) return Promise.reject(error)
    const { status } = error.response
    if (status === 404) {
      history.push('/errors/error-404')
    } else {
      return Promise.reject(error)
    }
  }
)

const convertDateTimeOffset = payload => {
  if (payload instanceof FormData) {
    return payload
  }

  return Object.keys(payload)
    .filter(key => payload[key] instanceof Date)
    .reduce((result, key) => ({ ...result, [key]: moment(payload[key]).format('YYYY-MM-DD') }), { ...payload })
}

const doAxios = (method, action, data, params = null) => {
  const headers = sessionHelper().token
    ? {
        'Access-Control-Allow-Origin': '*',
        Authorization: sessionHelper().token
      }
    : {
        'Access-Control-Allow-Origin': '*'
      }

  return axios({
    method: method,
    url: `${apiEndpoint}\\${action}`,
    params: params,
    data: data ? convertDateTimeOffset(data) : data,
    withCredentials: true,
    timeout: 30000,
    headers: headers
  })
}

const doAxiosDownload = (method, action, params, data) => {
  const headers = sessionHelper().token
    ? {
        'Access-Control-Allow-Origin': '*',
        Authorization: sessionHelper().token
      }
    : {
        'Access-Control-Allow-Origin': '*'
      }

  axios({
    method: method,
    url: `${apiEndpoint}\\${action}`,
    data: data,
    params: params,
    withCredentials: true,
    timeout: 30000,
    responseType: 'blob',
    headers: headers
  }).then(res => {
    const blob = new Blob([res.data], { type: res.data.type })
    const contentDisposition = res.headers['content-disposition']
    let fileName = 'unknown'
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/)

      if (fileNameMatch && fileNameMatch.length === 2) {
        fileName = Buffer.from(fileNameMatch[1], 'base64').toString('utf8')
      }
    }

    saveAs(blob, fileName)
  })
}

const doPostDownloadAxios = (method, action, data) => {
  const headers = sessionHelper().token
    ? {
        'Access-Control-Allow-Origin': '*',
        Authorization: sessionHelper().token
      }
    : {
        'Access-Control-Allow-Origin': '*'
      }

  return axios({
    method: method,
    url: `${apiEndpoint}\\${action}`,
    data: data,
    withCredentials: true,
    timeout: 30000,
    responseType: 'stream',
    headers: headers
  })
}

export const doPost = (action, data) => {
  return doAxios('post', action, data)
}

export const doDownload = (action, params, data) => {
  return doAxiosDownload('get', action, params, data)
}

export const doGet = (action, params) => {
  return doAxios('get', action, null, params)
}

export const doPut = (action, data) => {
  return doAxios('put', action, data)
}

export const doUpload = (action, data) => {
  return axios.post(`${apiEndpoint}\\${action}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const doPostDownload = (action, data) => {
  return doPostDownloadAxios('post', action, data)
}
