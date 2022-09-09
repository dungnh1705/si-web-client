import { atom } from 'recoil'

import firebase from 'firebase/app'
import 'firebase/firestore'
// import 'firebase/functions'
import 'firebase/storage'
// import 'firebase/auth'

import { FirebaseProdConfig, FirebaseStagingConfig } from 'config/index'

let firebaseConfig = FirebaseStagingConfig

const env = process.env.REACT_APP_ENVIRONMENT
if (env === 'prod') firebaseConfig = FirebaseProdConfig

console.log('Init firebase')
firebase.initializeApp(firebaseConfig)

export const firestoreState = atom({
  key: 'firestoreState',
  default: firebase.app().firestore()
})

// export const cloudFunctionState = atom({
//   key: 'cloudFunctionState',
//   default: firebase.app().functions()
// })

// export const authState = atom({
//   key: "authState",
//   default: firebase.app().auth(),
// })

// export const authState = selector({
//   key: 'authState',
//   get: () => {
//     const auth = firebase.app().auth()
//     return auth
//   },
//   dangerouslyAllowMutability: true
// })

export const storageState = atom({
  key: 'storageState',
  default: firebase.storage()
})
