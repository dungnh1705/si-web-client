import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, Button, Grid, Card, Tooltip, IconButton, TextField, MenuItem } from '@material-ui/core'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import ButtonLoading from 'components/UI/ButtonLoading'
import { StudentStatus } from 'app/enums'
import { doDownload, doPost } from 'utils/axios'

import { HolyNameQuery, TemplatesQuery } from 'recoils/selectors'
import { ScoreDownloadDialogAtom } from './recoil'
import sessionHelper from 'utils/sessionHelper'
import { toastState } from 'recoils/atoms'

export const ScoreDownloadDialog = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  let lstHolyname = useRecoilValue(HolyNameQuery)
  let templates = useRecoilValue(TemplatesQuery)
  let [loading, setLoading] = useState(false)
  let [downloadDialog, setDownloadDialog] = useRecoilState(ScoreDownloadDialogAtom)
  let [studentIds, setStudentIds] = useState([])
  let [toast, setToast] = useRecoilState(toastState)
  let [templateId, setTemplateId] = useState()

  let { openScoreDownload, lstStudent, teamCollapse } = downloadDialog

  const handleCardClick = (e, teamId) => {
    e.preventDefault()

    teamCollapse.some(d => d === teamId)
      ? setDownloadDialog({ ...downloadDialog, teamCollapse: teamCollapse.filter(i => i !== teamId) })
      : setDownloadDialog({ ...downloadDialog, teamCollapse: [...teamCollapse, teamId] })
  }

  const handleCollapse = teamId => {
    return teamCollapse.some(d => d === teamId)
  }

  const handleClickRow = e => {
    const val = e.target.value

    const isChecked = e.target.checked
    isChecked ? setStudentIds([...studentIds, val]) : setStudentIds(studentIds.filter(i => i !== val))
  }

  const handleCheckAll = e => {
    const val = Number(e.target.value)

    const lstId = lstStudent
      .find(v => v.team === val)
      .students.filter(stu => stu.status !== StudentStatus.ChangeChurch && stu.status !== StudentStatus.LeaveStudy)
      .map(s => s.id)

    if (e.target.checked) {
      let res = _.union(studentIds, lstId)
      setStudentIds(res)
    } else setStudentIds(studentIds.filter(i => !lstId.includes(i)))
  }

  const handleClose = () => {
    if (!loading) {
      setStudentIds([])
      setDownloadDialog({ ...downloadDialog, openScoreDownload: false })
    }
  }

  const handleDownload = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      let data = {
        StudentId: studentIds,
        ClassId: sessionHelper().classId,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: templateId,
        IsPreview: false
      }

      let res = await doPost(`download/previewForm`, data)
      if (res && res.data.success) {
        let { data } = res.data
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })

        doDownload('file/get', { fileName: data })
      }
    } catch (err) {
      setLoading(false)
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Dialog open={openScoreDownload} onClose={handleClose} aria-labelledby="responsive-download-dialog" fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle>Tải Phiếu báo điểm - {studentIds.length}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <TextField label="Loại biễu mẫu" variant="outlined" fullWidth InputLabelProps={{ shrink: true }} select onChange={e => setTemplateId(e.target.value)}>
              {templates?.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {lstStudent?.map((item, index) => (
            <Grid item xs={12} lg={6} key={`down-stu-${index}`}>
              <Card className="card-box mb-1 w-100">
                <div className="card-header d-flex pb-1 pt-1" onClick={e => handleCardClick(e, item.team)} style={{ cursor: 'pointer' }}>
                  <div className="card-header--title">
                    <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Đội:{item.team}</h4>
                  </div>
                  <Grid container item justifyContent="flex-end">
                    <div className="card-header--actions">
                      <Tooltip arrow title={!handleCollapse(item.team) ? 'Thu lại' : 'Mở rộng'}>
                        <IconButton size="medium" color="default">
                          {handleCollapse(item.team) ? <FontAwesomeIcon icon={['fas', 'angle-down']} /> : <FontAwesomeIcon icon={['fas', 'angle-up']} />}
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Grid>
                </div>
                <div className="table-responsive" hidden={handleCollapse(item.team)}>
                  <table className="table table-hover text-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>
                          <StyledCheckbox onChange={handleCheckAll} value={item.team} />
                        </th>
                        <th>Tên Thánh, Họ và Tên</th>
                      </tr>
                    </thead>
                    <tbody>
                      {_.orderBy(
                        item.students.filter(stu => stu.status !== StudentStatus.ChangeChurch && stu.status !== StudentStatus.LeaveStudy),
                        ['stuLastName'],
                        ['asc']
                      ).map((stu, index) => (
                        <tr key={`lst-stu-${stu.id}-${index}`} style={{ cursor: 'pointer' }}>
                          <td>
                            <StyledCheckbox onChange={handleClickRow} value={stu.id} checked={studentIds.some(v => v === stu.id)} />
                          </td>
                          <td>
                            {lstHolyname.find(h => h.id === stu.stuHolyId).name} {stu.stuFirstName} {stu.stuLastName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonLoading btnText="Tải xuống" loading={loading} handleButtonClick={handleDownload} disabled={!templateId || studentIds.length === 0} />
        <Button size="large" variant="contained" onClick={handleClose}>
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
