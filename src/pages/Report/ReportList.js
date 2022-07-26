import React, { useState, useEffect } from 'react'
import { Grid, TextField, MenuItem, Button, Hidden } from '@material-ui/core'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

// icons
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'

// constance
import sessionHelper from 'utils/sessionHelper'
import config from 'config'

// components
import { doPost } from 'utils/axios'
import _ from 'lodash'
import { TemplateType } from 'app/enums'
import { loadingState, toastState } from 'recoils/atoms'
import { documentReview, reportTemplateQuery } from './recoil'

const buttonStyle = { fontSize: '0.9em', padding: '0.75em 0' }
const inputGrid = { xs: 12, sm: 6, md: 8, lg: 9 }
const buttonGrid = { xs: 12, sm: 6, md: 4, lg: 3 }
const apiEndpoint = process.env.REACT_APP_WEB_API

export default function () {
  const templates = useRecoilValue(reportTemplateQuery)

  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [toast, setToast] = useRecoilState(toastState)
  const setLoading = useSetRecoilState(loadingState)
  const setDocument = useSetRecoilState(documentReview)

  const handleReport = async (e, isPreview = true) => {
    e.preventDefault()
    setLoading(true)

    try {
      let data = {
        StudentId: [],
        ClassId: sessionHelper().classId,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: selectedTemplate,
        IsPreview: isPreview
      }
      let res = await doPost(`download/previewForm`, data)
      if (res && res.data.success) {
        let { data } = res.data
        isPreview ? setDocument(data) : window.open(`${apiEndpoint}/file/get?fileName=${data}`, '_parent')
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedTemplate) setDocument(undefined)
  }, [selectedTemplate])

  const reportList = () => {
    const lstTemplate = _.uniqBy(templates, 'id')?.filter(temp => temp?.templateType === TemplateType.Report)

    return lstTemplate.length > 0 ? (
      lstTemplate.map(item => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem>Không có biểu mẫu</MenuItem>
    )
  }

  return (
    <Grid container spacing={3} className="mt-2" justifyContent="center">
      <Grid container {...inputGrid} item alignContent="center" direction="column">
        <TextField label="Chọn biễu mẫu" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} select onChange={e => setSelectedTemplate(e.target.value)}>
          {reportList()}
        </TextField>
      </Grid>
      <Grid container {...buttonGrid} item spacing={1} alignContent="center" justifyContent="space-between" direction="row">
        <Grid item xs={6}>
          <Button size='large' fullWidth variant="contained" color="primary" disabled={!selectedTemplate} startIcon={<VisibilityRoundedIcon />} onClick={handleReport} style={buttonStyle}>
            Xem trước
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            size='large'
            fullWidth
            variant="contained"
            color="secondary"
            disabled={!selectedTemplate}
            startIcon={<GetAppRoundedIcon />}
            onClick={e => handleReport(e, false)}
            style={buttonStyle}>
            Tải xuống
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
