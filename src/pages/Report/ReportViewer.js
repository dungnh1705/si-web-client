import React from 'react'
import { Grid } from '@material-ui/core'
import { Editor } from '@tinymce/tinymce-react'
import { useRecoilValue } from 'recoil'

import { documentReview } from './recoil'

export default function ReportViewer() {
  const document = useRecoilValue(documentReview)

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Editor
          id="form-preview-report"
          textareaName="form-preview-report"
          apiKey="wb7w2gsu9xl1x2ybdqmdxdjy403ebj31rcygwmzrc5b8ndlx"
          value={document}
          init={{
            selector: 'textarea',
            menubar: false,
            plugins: 'print ',
            toolbar: 'print',
            toolbar_sticky: true,
            height: 700,
            skin: 'oxide',
            content_css: 'default'
          }}
        />
      </Grid>
    </Grid>
  )
}
