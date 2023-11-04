import React, { useState } from 'react'
import { Button, Grid, TextField } from '@material-ui/core'
import { nanoid } from 'nanoid'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { Autocomplete } from '@material-ui/lab'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ReloadAssignmentsAtom, UsersAvailableSelector } from '../recoil'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'
import { doPost } from 'utils/axios'
import { loadingState, toastState } from 'recoils/atoms'

export default function GroupMember({ info }) {
  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)

  const usersAvailable = useRecoilValue(UsersAvailableSelector)
  const setReloadAssignment = useSetRecoilState(ReloadAssignmentsAtom)
  const [changed, setChanged] = useState(false)

  const assignments = info.assignment.map(item => {
    return {
      id: item.appUserId,
      label: item.user.fullName
    }
  })

  const assignmentForm = useFormik({
    initialValues: assignments.filter(item => item.id !== info.leaderId),
    validationSchema: Yup.object({}),
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const handleCancelChange = () => {
    assignmentForm.resetForm()
    setChanged(false)
  }

  const handleSaveChange = async () => {
    setLoading(true)

    const data = {
      classId: info.id,
      members: assignmentForm.values
    }

    try {
      const res = await doPost(`assignment/updateClassAssignment`, data)

      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setChanged(false)
        setReloadAssignment(old => old + 1)
      }
    } catch (err) {
      setLoading(false)
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Grid container spacing={3} justifyContent={'flex-start'} alignItems={'flex-start'}>
      <Grid item xs={12}>
        Thành viên
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple={true}
          fullWidth
          className="w-100"
          noOptionsText="Không tìm thấy Huynh Trưởng phù hợp"
          onChange={async (e, newValue) => {
            await assignmentForm.setValues(newValue)
            setChanged(true)
          }}
          // onBlur={handleCancelChange}
          disableClearable
          value={assignmentForm.values}
          id={`member-${nanoid(2)}`}
          options={usersAvailable}
          renderOption={(option, { inputValue }) => {
            const matches = match(`${option.label}`, inputValue)
            const parts = parse(`${option.label}`, matches)
            return (
              <div className="d-flex align-items-center">
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
          getOptionLabel={option => option.label}
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
      {changed && (
        <Grid container item xs={12} spacing={3} justifyContent={'flex-end'} alignItems={'center'}>
          <Button variant={'contained'} onClick={handleCancelChange} className={'mr-2'}>
            Hủy
          </Button>
          <Button variant={'contained'} color={'primary'} onClick={handleSaveChange}>
            Lưu
          </Button>
        </Grid>
      )}
    </Grid>
  )
}
