import React from 'react'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { Avatar, TextField, Card, Divider, CardContent } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'

import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

import { loadingState, toastState } from 'recoils/atoms'
import { ReloadClasses } from './recoil'

const ClassListItem = ({ classInfo, users }) => {
  const [toast, setToast] = useRecoilState(toastState)
  const setLoading = useSetRecoilState(loadingState)
  const setReloadClass = useSetRecoilState(ReloadClasses)

  const formData = useFormik({
    initialValues: classInfo.leader,
    validationSchema: Yup.object({}),
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const handleAgree = async (e, newVal) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await doPost(`user/assignLeader`, { ...classInfo, leader: newVal, userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}` })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadClass(reload => reload + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
      formData.setValues(newVal)
    }
  }

  return (
    <Card className="card-box mb-3 w-100">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">{classInfo.group.groupName}</h4>
        </div>
      </div>
      <Divider />
      <CardContent>
        <div className="d-flex align-items-center">
          <Autocomplete
            fullWidth
            className="w-100"
            noOptionsText="Không tìm thấy Huynh Trưởng phù hợp"
            value={formData.values}
            onChange={(e, newValue) => {
              handleAgree(e, newValue)
            }}
            disableClearable
            id={`leader-${classInfo.id}`}
            options={users}
            renderOption={(option, { inputValue }) => {
              const matches = match(`${option.holyName?.name} ${option.firstName} ${option.lastName}`, inputValue)
              const parts = parse(`${option.holyName?.name} ${option.firstName} ${option.lastName}`, matches)
              return (
                <div className="d-flex align-items-center">
                  <Avatar src={option?.avatarUrl} className="mr-2">
                    {`${option?.firstName?.substring(0, 1)}${option?.lastName?.substring(0, 1)}`}
                  </Avatar>
                  <div>
                    {parts.map((part, index) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }}
            getOptionLabel={option => `${option.holyName?.name} ${option.firstName} ${option.lastName}`}
            renderInput={params => (
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                fullWidth
                {...params}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassListItem
