import React, { useState } from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { documentTemplateQuery, groupStudentIdSelectedAtom, groupUnionSelectedAtom, checkAllIdsSelectedAtom } from 'pages/Form/recoil'

import { loadingState, toastState } from 'recoils/atoms'

import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded'
import sessionHelper from 'utils/sessionHelper'
import { doDownload } from 'utils/axios'

const buttonStyle = { fontSize: '1.5em', padding: '0.4em 0' }
const inputGrid = { xs: 12, sm: 8, md: 9 }
const buttonGrid = { xs: 12, sm: 4, md: 3 }

export default function () {
  const templates = useRecoilValue(documentTemplateQuery)
  const unionSelected = useRecoilValue(groupUnionSelectedAtom)

  const [selectedTemplate, setSelectedTemplate] = useState()
  const [toast, setToast] = useRecoilState(toastState)
  const setLoading = useSetRecoilState(loadingState)
  const setCheckAll = useSetRecoilState(checkAllIdsSelectedAtom)
  const [selectedIds, setSelectedIds] = useRecoilState(groupStudentIdSelectedAtom)

  const documentList = () => {
    return templates.length > 0 ? (
      templates.map(item => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem>Không có biểu mẫu phù hợp</MenuItem>
    )
  }

  const handleDownload = async () => {
    setLoading(true)

    try {
      const data = {
        StudentId: selectedIds,
        ClassId: sessionHelper().classId,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: selectedTemplate,
        IsPreview: false,
        UnionId: unionSelected
      }

      await doDownload('download/downloadPreviewForm', data)
      setLoading(false)
    } catch (error) {
      setToast({ ...toast, open: true, message: error.message, type: 'error' })
    } finally {
      setSelectedIds([])
      setCheckAll([])
    }
  }

  const checkDisabled = () => {
    return !(selectedTemplate && (selectedIds.length > 0 || unionSelected))
  }

  return (
    <Grid container spacing={3} className="mt-2" justifyContent="center">
      <Grid container {...inputGrid} item alignContent="center" direction="column">
        <TextField label="Chọn biểu mẫu" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} select onChange={e => setSelectedTemplate(e.target['value'])}>
          {documentList()}
        </TextField>
      </Grid>
      <Grid container {...buttonGrid} item spacing={1} alignContent="center" justifyContent="space-between" direction="row">
        <Grid item xs={12}>
          <Button
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            disabled={checkDisabled()}
            startIcon={<GetAppRoundedIcon />}
            style={buttonStyle}
            onClick={handleDownload}>
            Tải xuống
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
