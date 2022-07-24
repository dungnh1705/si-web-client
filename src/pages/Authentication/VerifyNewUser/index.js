import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { history } from 'App'

import { toastState } from 'recoils/atoms'
import { doGet } from 'utils/axios'
import config from 'config'
import SuspenseLoading from 'components/SuspenseLoading'

const VerifyNewUser = () => {
  const { email } = useParams()
  const [isLoading, setIsLoading] = useState(false)

  const [toast, setToast] = useRecoilState(toastState)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      try {
        let res = await doGet(`${config.ApiEndpoint}/auth/verifyUser`, { Email: email })

        if (res) {
          setToast({ ...toast, open: true, message: res.data.message, title: res.data.success ? 'Success!' : 'Error', type: res.data.success ? 'success' : 'error' })
        }
      } catch (err) {
        setToast({ ...toast, open: true, message: err.message, title: 'Error', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData() // componentWillUnmount
    return () => {
      setIsLoading(null)
    }
  }, [])

  return <>{isLoading ? <SuspenseLoading /> : history.push('/Login')}</>
}

export default VerifyNewUser
