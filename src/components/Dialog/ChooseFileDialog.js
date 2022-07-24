import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Divider, InputAdornment, ButtonGroup } from '@material-ui/core'

import ButtonLoading from 'components/UI/ButtonLoading'
import config from 'config'
import { doPost } from 'utils/axios'
import { toastState } from 'recoils/atoms'
import sessionHelper from 'utils/sessionHelper'
import { ReloadStudentList } from 'pages/HuynhTruong/ManageStudentScore/recoil'
import { ReloadGroupScore } from 'pages/PhanDoanTruong/ManageScoreGroup/recoil'
import { SemesterEnum } from 'app/enums'

import { ChooseFileDialogAtom } from './recoil'

export const ChooseFileDialog = () => {
  const [loading, setLoading] = useState(false)
  const [dialog, setDialog] = useRecoilState(ChooseFileDialogAtom)
  const [file, setFile] = useState(undefined)
  const [toast, setToast] = useRecoilState(toastState)
  const [semester, setSemester] = useState(301)
  const setReloadScoreClass = useSetRecoilState(ReloadStudentList)
  const setReloadScoreGroup = useSetRecoilState(ReloadGroupScore)

  let { openChooseFileDialog, pageCall } = dialog

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

    try {
      let fromData = new FormData()
      fromData.append('file', file[0])
      fromData.append('ScholasticId', sessionHelper().scholasticId)
      fromData.append('UserFullName', `${sessionHelper().firstName} ${sessionHelper().lastName}`)
      fromData.append('Semester', semester)
      fromData.append('IsLeader', pageCall === 'HT-StudentScore' ? false : true)

      var res = await doPost(`${config.ApiEndpoint}/file/uploadScoreFile`, fromData)
      if (res && res.data.success) {
        handleClose()
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        if (pageCall === 'HT-StudentScore') setReloadScoreClass(reload => reload + 1)
        if (pageCall === 'PDT-StudentGroupScore') setReloadScoreGroup(reload => reload + 1)
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
      <DialogTitle>Nhập điểm từ file</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <ButtonGroup color="primary" variant="contained" aria-label="contained primary button group">
              <Button color={semester === SemesterEnum.semesterOne ? 'primary' : 'default'} onClick={() => setSemester(SemesterEnum.semesterOne)}>
                Học kỳ I
              </Button>
              <Button color={semester === SemesterEnum.semesterTwo ? 'primary' : 'default'} onClick={() => setSemester(SemesterEnum.semesterTwo)}>
                Học kỳ II
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={file ? file[0].name : ''}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button size='large' variant="contained" component="label" fullWidth>
                      Tìm
                      <TextField type="file" onChange={onFileSelect} inputProps={{ accept: '.xlsx', hidden: true }} />
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: '10px 23px' }}>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item sm={6} md={3}>
            <ButtonLoading btnText="Tải lên" loading={loading} handleButtonClick={handleUpload} disabled={!file} />
          </Grid>
          <Grid item sm={6} md={3}>
            <Button onClick={handleClose} fullWidth variant="outlined">
              Quay về
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
