import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Autocomplete } from '@material-ui/lab'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ReloadUsersQueryAtom, UsersQuerySelector } from '../recoil'
import { loadingState, toastState } from 'recoils/atoms'

import { useFormik } from 'formik'
import Yup from 'utils/Yup'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { nanoid } from 'nanoid'

export default function GroupLeader({ info }) {
  const users = useRecoilValue(UsersQuerySelector)

  const [toast, setToast] = useRecoilState(toastState)
  const setLoading = useSetRecoilState(loadingState)

  const setReloadUsers = useSetRecoilState(ReloadUsersQueryAtom)

  const formData = useFormik({
    initialValues: info.leader,
    validationSchema: Yup.object({}),
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const handleAgree = async (e, newVal) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await doPost(`user/assignLeader`, {
        ...info,
        leader: newVal,
        userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
      })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadUsers(reload => reload + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
      formData.setValues(newVal)
    }
  }

  return (
    <Grid container spacing={3} justifyContent={'flex-start'} alignItems={'center'}>
      <Grid item xs={12}>
        Phân đoàn trưởng
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          fullWidth
          className="w-100"
          noOptionsText="Không tìm thấy Huynh Trưởng phù hợp"
          value={formData.values}
          onChange={(e, newValue) => {
            handleAgree(e, newValue)
          }}
          disableClearable
          id={`leader-${nanoid(2)}`}
          options={users.filter(user => user.id !== formData.values['id'])}
          renderOption={(option, { inputValue }) => {
            const matches = match(`${option.holyName?.name} ${option.firstName} ${option.lastName}`, inputValue)
            const parts = parse(`${option.holyName?.name} ${option.firstName} ${option.lastName}`, matches)
            return (
              <div className="d-flex align-items-center">
                {/*<Avatar src={option?.avatarUrl} className="mr-2">*/}
                {/*  {`${option?.firstName?.substring(0, 1)}${option?.lastName?.substring(0, 1)}`}*/}
                {/*</Avatar>*/}
                <div className="p-2">
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </div>
              </div>
            )
          }}
          getOptionLabel={option => option.fullName}
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
      </Grid>
    </Grid>
  )
}
