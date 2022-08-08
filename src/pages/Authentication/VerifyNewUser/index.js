import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { history } from 'App'

import { toastState } from 'recoils/atoms'
import { doGet } from 'utils/axios'
import SuspenseLoading from 'components/SuspenseLoading'
import { saveLoginData } from 'utils/sessionHelper'

const VerifyNewUser = () => {
  const { email } = useParams()
  const [isLoading, setIsLoading] = useState(false)

  const [toast, setToast] = useRecoilState(toastState)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const res = await doGet(`auth/verifyUser`, { Email: email })

        if (res && res.data.success) {
          const { data } = res.data
          saveLoginData(data)

          window.location.href = '/MyProfile'
        } else {
          setToast({ ...toast, open: true, message: res.data.message, title: 'Error', type: 'error' })
          setIsLoading(false)
        }
      } catch (err) {
        setToast({ ...toast, open: true, message: err.message, title: 'Error', type: 'error' })
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
