import React from 'react'
import { Grid } from '@material-ui/core'
import { Editor } from '@tinymce/tinymce-react'
import { useRecoilValue } from 'recoil'

import { documentReview } from './recoil'

export default function ReportViewer() {
  const document = useRecoilValue(documentReview)

  // const handleSaveAsPdf = content => {
  //   console.log(content)
  // }

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
            // external_plugins: {
            //   saveToPdf: 'https://cdn.rawgit.com/Api2Pdf/api2pdf.tinymce/master/save-to-pdf/dist/save-to-pdf/plugin.js'
            // },
            plugins: 'print',
            toolbar: 'print',
            toolbar_sticky: true,
            height: 700,
            skin: 'oxide',
            content_css: 'default'
            // setup: function (editor) {
            //   editor.ui.registry.addMenuItem('saveAsPdf', {
            //     text: 'SAVE AS',
            //     fetch: function (callback) {
            //       callback([
            //         {
            //           type: 'menuitem',
            //           text: 'PDF',
            //           // icon: 'unlock',
            //           onAction: function () {
            //             editor.save()
            //           }
            //         },
            //         {
            //           type: 'menuitem',
            //           text: 'PDF',
            //           // icon: 'unlock',
            //           onAction: function () {
            //             editor.save()
            //           }
            //         }
            //       ])
            //     }
            //   })
            // }
          }}
        />
      </Grid>
    </Grid>
  )
}
