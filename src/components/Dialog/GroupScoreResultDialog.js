import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import ButtonLoading from 'components/UI/ButtonLoading'
import { UnionQuery } from 'recoils/selectors'
import sessionHelper from 'utils/sessionHelper'

import { GroupScoreResultDialogAtom } from './recoil'

const apiEndpoint = process.env.REACT_APP_WEB_API

export const GroupScoreResultDialog = () => {
  const [loading, setLoading] = useState(false)
  const [unionIds, setUnionIds] = useState([])

  const [dialog, setDialog] = useRecoilState(GroupScoreResultDialogAtom)

  const lstUnion = useRecoilValue(UnionQuery)

  const { open, templateId, title } = dialog

  function handleClose() {
    setUnionIds([])
    setDialog({ ...dialog, open: false })
  }

  function handleDownload() {
    setLoading(true)

    const { scholasticId, userId, classId } = sessionHelper()
    const ids = unionIds.join('&UnionIds=')

    try {
      window.open(
        `${apiEndpoint}/download/downloadResultForm?IsGetGroupResult=true&TemplateId=${templateId}&ScholasticId=${scholasticId}&UserId=${userId}&UnionIds=${ids}&ClassId=${classId}`,
        '_parent'
      )

      setLoading(false)
    } catch (err) {
      setLoading(false)
    } finally {
      handleClose()
    }
  }

  function handleChooseUnion(unionId) {
    if (unionIds.includes(unionId)) {
      setUnionIds(unionIds.filter(id => id !== unionId))
    } else {
      setUnionIds([...unionIds, unionId])
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h4">Tải phiếu điểm Phân đoàn - {title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="h5">Chọn chi đoàn</Typography>
        <br />

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {lstUnion.map(union => (
            <Grid item xs={6} key={`list-union-${union.unionId}`} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleChooseUnion(union.unionId)}>
              <Typography
                variant="h4"
                style={{
                  padding: '15px',
                  color: unionIds.includes(union.unionId) ? 'red' : 'black',
                  border: unionIds.includes(union.unionId) ? '2px solid red' : '1px solid black',
                  borderRadius: '10px'
                }}>
                Chi đoàn {union.unionCode}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <br />
      <DialogActions>
        <ButtonLoading btnText="Tải xuống" loading={loading} handleButtonClick={handleDownload} disabled={unionIds.length === 0} />
        <Button size="large" variant="outlined" onClick={handleClose}>
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
