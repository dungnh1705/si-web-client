import React from 'react'
import { Grid } from '@material-ui/core'

import Forms from './Forms'
import EditorForm from './EditorForm'
import HeaderAction from './HeaderAction'
import { Suspense } from 'react'
import ModalSkeleton from 'components/Loading/modal-skeleton'

const ManageForm = () => {
  return (
    <Suspense fallback={<>Đang tải danh sách biểu mẫu...</>}>
      <Grid container spacing={3}>
        <Grid container item xs={12} justifyContent="flex-end">
          <HeaderAction />
        </Grid>
        <Forms />
      </Grid>
      <Suspense fallback={<ModalSkeleton loading />}>
        <EditorForm />
      </Suspense>
    </Suspense>
  )
}

export default ManageForm
