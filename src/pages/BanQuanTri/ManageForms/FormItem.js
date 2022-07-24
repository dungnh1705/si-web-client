/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Tooltip, FormControlLabel } from '@material-ui/core'
import { useSetRecoilState, useRecoilState } from 'recoil'
import IOSSwitch from 'components/UI/iOS-switch'

import { OpenEditorForm } from './recoil'

import config from 'config'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { toastState } from 'recoils/atoms'

const FormItem = ({ item }) => {
  let setEditorForm = useSetRecoilState(OpenEditorForm)
  const [toast, setToast] = useRecoilState(toastState)
  const [template, setTemplate] = useState(item)

  const handleTemplateClick = e => {
    e.preventDefault()

    setEditorForm({ OpenEditor: true, Template: item })
  }

  const handleChangeStatus = async e => {
    e.preventDefault()
    const val = e.target.checked

    try {
      let res = await doPost(`template/updateTemplateStatus`, { id: item.id, updatedUserId: sessionHelper().userId, isActive: val })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setTemplate({ ...template, isActive: val })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <a href="#" className="card card-box card-box-hover-rise card-box-hover text-black align-box-row align-items-center m-3 p-2">
      <div>
        <Tooltip title="Chỉnh sửa">
          <div className="display-4 font-weight-bold" onClick={handleTemplateClick}>
            {template?.name}
          </div>
        </Tooltip>
      </div>
      <div className="ml-auto card-hover-indicator">
        <FormControlLabel control={<IOSSwitch checked={template?.isActive} onChange={handleChangeStatus} name="status" />} />
      </div>
    </a>
  )
}

export default FormItem
