import React from 'react'
import { useRecoilValue } from 'recoil'
import { Divider, Grid } from '@material-ui/core'
import Slider from 'react-slick'

import { TemplateType } from 'app/enums'
import { TemplatesQuery } from 'recoils/selectors'
import FormItem from './FormItem'

const Forms = () => {
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  }

  const myTemplates = useRecoilValue(TemplatesQuery)

  return (
    <>
      <Grid item xs={12}>
        <div className="card d-block mb-4 pb-3">
          <div className="card-header pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">BIỂU MẪU</h4>
            </div>
          </div>
          <Divider />
          {myTemplates
            ?.filter(t => t.templateType === TemplateType.Document)
            ?.map(item => (
              <FormItem key={item.id} item={item} />
            ))}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="card d-block mb-4 pb-3">
          <div className="card-header d-flex pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">BÁO CÁO</h4>
            </div>
          </div>
          <Divider />

          {myTemplates
            ?.filter(t => t.templateType === TemplateType.Report)
            ?.map(item => (
              <FormItem key={item.id} item={item} />
            ))}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="card d-block mb-4 pb-3">
          <div className="card-header d-flex pb-2 pt-2">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">EMAIL TỰ ĐỘNG</h4>
            </div>
          </div>
          <Divider />

          {myTemplates
            ?.filter(t => t.templateType === TemplateType.SystemTemplate)
            ?.map(item => (
              <FormItem key={item.id} item={item} />
            ))}
        </div>
      </Grid>
    </>
  )
}

export default Forms
