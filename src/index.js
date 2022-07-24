import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import SuspenseLoading from 'components/SuspenseLoading'

import App from './App'
import ConfigLoader from './ConfigLoader'

const Wrapper = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<SuspenseLoading />}>
        <App />
      </Suspense>
    </RecoilRoot>
  )
}

ReactDOM.render(<ConfigLoader ready={() => <Wrapper />}></ConfigLoader>, document.getElementById('root'))
