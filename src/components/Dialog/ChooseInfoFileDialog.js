import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  Divider,
  InputAdornment
} from '@material-ui/core'

import ButtonLoading from 'components/UI/ButtonLoading'
import { doPost } from 'utils/axios'
import { toastState } from 'recoils/atoms'
import sessionHelper from 'utils/sessionHelper'
import { ReloadStudentClass } from 'pages/HuynhTruong/ManageStudentClass/recoil'
import { ReloadStudentGroup } from 'pages/PhanDoanTruong/ManageStudentsGroup/recoil'

import { ChooseFileInfoDialogAtom } from './recoil'

export const ChooseInfoFileDialog = () => {
  const [dialog, setDialog] = useRecoilState(ChooseFileInfoDialogAtom)
  const [toast, setToast] = useRecoilState(toastState)

  const setReloadStudentClass = useSetRecoilState(ReloadStudentClass)
  const setReloadStudentGroup = useSetRecoilState(ReloadStudentGroup)

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(undefined)

  const { openChooseFileDialog, pageCall } = dialog

  const handleClose = () => {
    if (!loading) {
      setDialog({ ...dialog, openChooseFileDialog: false })
      setFile(undefined)
      setLoading(false)
    }
  }

  const handleUpload = async e => {
    e.preventDefault()
    setLoading(true)

    const pageUploadStudentInfo = ['PDT-StudentGroup', 'HT-StudentClass']

    try {
      let fromData = new FormData()
      fromData.append('file', file[0])
      fromData.append('ScholasticId', sessionHelper().scholasticId)
      fromData.append('UserFullName', `${sessionHelper().firstName} ${sessionHelper().lastName}`)
      fromData.append('UserId', sessionHelper().userId)
      fromData.append('ClassId', sessionHelper().classId)

      var res = pageUploadStudentInfo.includes(pageCall) ? await doPost(`file/uploadStudentInfoFile`, fromData) : await doPost(`file/addStudentFromFile`, fromData)
      if (res && res.data.success) {
        handleClose()
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        if (pageCall === 'HT-StudentClass') setReloadStudentClass(reload => reload + 1)
        if (pageCall === 'PDT-StudentGroup' || pageCall === 'PDT-AddStudentGroup') setReloadStudentGroup(reload => reload + 1)
      } else {
        setToast({ ...toast, open: true, message: res.data.message, type: 'error' })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const onFileSelect = e => {
    let file = e.target.files
    setFile(file)
  }

  return (
    <Dialog open={openChooseFileDialog} onClose={handleClose}>
      <DialogTitle>Nhập Thông tin Đoàn sinh từ file</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} justifyContent='center' alignItems='center'>
          <Grid item xs={12}>
            <TextField
              value={file ? file[0].name : ''}
              variant='outlined'
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button size='large' variant='contained' component='label' fullWidth>
                      Tìm
                      <TextField type='file' onChange={onFileSelect} inputProps={{ accept: '.xlsx', hidden: true }} />
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: '10px 23px' }}>
        <Grid container item spacing={2} justifyContent='flex-end'>
          <Grid item xs={6}>
            <ButtonLoading btnText='Tải lên' loading={loading} handleButtonClick={handleUpload} disabled={!file} />
          </Grid>
          <Grid item xs={6}>
            <Button size='large' onClick={handleClose} fullWidth variant='outlined'>
              Quay về
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
