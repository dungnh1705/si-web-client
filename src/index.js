import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import SuspenseLoading from 'components/SuspenseLoading'

import App from './App'
import { saveLocalStorage } from 'utils/sessionHelper'
// import ConfigLoader from './ConfigLoader'

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('service-worker.js')
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission()
      saveLocalStorage('notification', `${permission}` ?? '')
      // console.log('Notification permission:', permission)
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }
}

const initApp = async () => {
  await registerServiceWorker()
  await requestNotificationPermission()
}

initApp()

const Wrapper = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<SuspenseLoading />}>
        <App />
      </Suspense>
    </RecoilRoot>
  )
}

// ReactDOM.render(<ConfigLoader ready={() => <Wrapper />}></ConfigLoader>, document.getElementById('root'))
ReactDOM.render(<Wrapper />, document.getElementById('root'))
