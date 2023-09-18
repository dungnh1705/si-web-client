import React, { useEffect, useState } from 'react'
import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

// icons
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'

// constance
import sessionHelper from 'utils/sessionHelper'

// components
import { doDownload, doPost } from 'utils/axios'
import _ from 'lodash'
import { TemplateType } from 'app/enums'
import { loadingState, toastState } from 'recoils/atoms'
import { documentReview, reportTemplateQuery } from './recoil'
import ButtonLoading from 'components/UI/ButtonLoading'

const buttonStyle = { fontSize: '0.9em', padding: '0.75em 0' }
const inputGrid = { xs: 12, sm: 6, md: 8 }
const buttonGrid = { xs: 12, sm: 6, md: 4 }

export default function() {
  const templates = useRecoilValue(reportTemplateQuery)

  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [toast, setToast] = useRecoilState(toastState)
  const [loading, setLoading] = useRecoilState(loadingState)
  const setDocument = useSetRecoilState(documentReview)

  const handleReport = async (e, isPreview = true) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        StudentId: [],
        ClassId: sessionHelper().classId,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: selectedTemplate,
        IsPreview: isPreview
      }

      if (isPreview) {
        const res = await doPost(`download/previewForm`, data)
        if (res) {
          const { data } = res.data
          setDocument(data)
          setLoading(false)
        }
      } else {
        await doDownload('download/downloadPreviewForm', data)
        setLoading(false)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
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
      <MenuItem>Không có Báo cáo phù hợp</MenuItem>
    )
  }

  return (
    <Grid container spacing={3} className='mt-2' justifyContent='center'>
      <Grid container {...inputGrid} item alignContent='center' direction='column'>
        <TextField label='Chọn báo cáo' variant='outlined' fullWidth InputLabelProps={{ shrink: true }} select
                   onChange={e => setSelectedTemplate(e.target.value)}>
          {reportList()}
        </TextField>
      </Grid>
      <Grid container {...buttonGrid} item spacing={1} alignContent='center' justifyContent='space-between'
            direction='row'>
        <Grid item xs={6}>
          <Button
            size='large'
            fullWidth
            variant='contained'
            color='primary'
            disabled={!selectedTemplate}
            startIcon={<VisibilityRoundedIcon />}
            onClick={handleReport}
            style={buttonStyle}>
            Xem trước
          </Button>
        </Grid>
        <Grid item xs={6}>
          <ButtonLoading btnText='Tải xuống' loading={loading} handleButtonClick={e => handleReport(e, false)}
                         disabled={!selectedTemplate} startIcon={<GetAppRoundedIcon />} />
        </Grid>
      </Grid>
    </Grid>
  )
}
