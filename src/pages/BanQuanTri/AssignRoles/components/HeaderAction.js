import React, { Fragment } from 'react'
import { Grid, Button } from '@material-ui/core'
import { doDownload } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingState } from 'recoils/atoms'
import { NewUserDialogAtom } from 'components/Dialog/recoil'

export default function HeaderAction() {
  const setLoading = useSetRecoilState(loadingState)
  const [dialog, setDialog] = useRecoilState(NewUserDialogAtom)

  const handleDownloadUserExcel = () => {
    setLoading(true)
    return doDownload('file/downloadUserExcelFile', { scholasticId: sessionHelper().scholasticId }).finally(() => setLoading(false))
  }

  const handleAddNewuser = () => {
    setDialog({ ...dialog, open: true })
  }

  return (
    <Fragment className={'ml-0 mr-0'}>
      <Grid container spacing={3} justifyContent={'flex-end'} alignItems={'center'} className={'mt-2 mb-3'}>
        <Grid container item xs={12} justifyContent={'flex-end'}>
          <Button variant={'contained'} className={'mr-2'} onClick={handleAddNewuser}>
            Thêm mới
          </Button>

          <Button variant={'contained'} color={'primary'} onClick={handleDownloadUserExcel}>
            Tải Excel
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  )
}
