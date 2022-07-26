import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Button, CardContent, Grid, TextField, MenuItem, Dialog, DialogContent } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import _ from 'lodash'

import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'

import { doPost } from 'utils/axios'
import { TemplatesQuery } from 'recoils/selectors'
import { Editor } from '@tinymce/tinymce-react'
import { DocumentPreviewDialogAtom } from './recoil'
import { toastState, loadingState } from 'recoils/atoms'
import sessionHelper from 'utils/sessionHelper'

const apiEndpoint = process.env.REACT_APP_WEB_API

export const DocumentPreviewDialog = () => {
  let [templateId, setTemplateId] = useState('')
  let [document, setDocument] = useState('')
  let templates = useRecoilValue(TemplatesQuery)
  let [dialog, setDialog] = useRecoilState(DocumentPreviewDialogAtom)
  let setToast = useSetRecoilState(toastState)
  let setLoading = useSetRecoilState(loadingState)
  let theme = useTheme()
  let fullscreen = useMediaQuery(theme.breakpoints.down('md'))

  let { openPreviewDialog, studentId, templateType } = dialog

  const handleClose = e => {
    e.preventDefault()
    setDocument('')
    setTemplateId('')
    setDialog({ ...dialog, openPreviewDialog: false })
  }

  const handlePreview = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      let data = {
        StudentId: [studentId],
        ClassId: sessionHelper().classId,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: templateId,
        IsPreview: true
      }

      let res = await doPost(`download/previewForm`, data)
      if (res && res.data.success) {
        setLoading(false)
        let { data } = res.data
        // setToast({ open: true, message: res.message, type: 'success' })
        setDocument(data)
      }
    } catch (err) {
      setLoading(false)
      setToast({ open: true, message: err.message, type: 'error' })
    }
  }

  const handleDownload = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      let data = {
        StudentId: [studentId],
        ClassId: sessionHelper().classId,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: templateId,
        IsPreview: false
      }

      let res = await doPost(`download/previewForm`, data)
      if (res && res.data.success) {
        setLoading(false)
        let { data } = res.data
        window.open(`${apiEndpoint}/file/get?fileName=${data}`, '_parent')
      }
    } catch (err) {
      setLoading(false)
      setToast({ open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Dialog open={openPreviewDialog} onClose={handleClose} fullScreen={fullscreen} scroll="body" maxWidth="md" fullWidth>
      <DialogContent>
        <CardContent style={{ padding: 0 }}>
          <Grid container spacing={1} alignContent="center">
            <Grid item xs={12} md={5}>
              <TextField label="Chọn biễu mẫu" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} select onChange={e => setTemplateId(e.target.value)}>
                {_.uniqBy(templates, 'id')
                  ?.filter(temp => temp.templateType === templateType)
                  ?.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid container item xs={12} md={7} alignItems="center" justifyContent="flex-end" spacing={1}>
              <Grid item xs={12} sm={4}>
                <Button
                  size="large"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={!templateId}
                  startIcon={<VisibilityRoundedIcon />}
                  onClick={handlePreview}
                  style={{ padding: 'auto 0' }}>
                  Xem trước
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  size="large"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={!templateId}
                  startIcon={<GetAppRoundedIcon />}
                  onClick={handleDownload}
                  style={{ padding: 'auto 0' }}>
                  Tải xuống
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button size="large" fullWidth variant="outlined" onClick={handleClose} style={{ padding: 'auto 0' }}>
                  Quay về
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Editor
                id="form-preview"
                textareaName="form-preview"
                apiKey="wb7w2gsu9xl1x2ybdqmdxdjy403ebj31rcygwmzrc5b8ndlx"
                value={document}
                init={{
                  selector: 'textarea',
                  menubar: false,
                  plugins: 'print ',
                  toolbar: 'print',
                  toolbar_sticky: true,
                  height: 600,
                  skin: 'oxide',
                  content_css: 'default'
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}
